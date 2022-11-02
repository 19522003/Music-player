/*
Danh sách các chức năng cần làm
1. Render songs
2. Scroll top
3. Play / pause / seek
4. CD rotate
5. Next / prev
6. Random
7. Next / Repeat when ended
8. Active song
9. Scroll active song into view
10. Play song when click
 */
const cd = document.querySelector(".cd");
const heading = document.querySelector("header h2");
const cdThumb = document.querySelector(".cd-thumb");
const audioElement = document.querySelector("#audio");
const player = document.querySelector(".player");
const playBtn = document.querySelector(".btn-toggle-play");
const progressBar = document.querySelector("#progress");
const nextBtn = document.querySelector(".btn-next");
const prevBtn = document.querySelector(".btn-prev");
const randomBtn = document.querySelector(".btn-random");
const repeatBtn = document.querySelector(".btn-repeat");
const playlist = document.querySelector(".playlist");
const PLAYER_STORAGE_KEY = "MUSIC_PLAYER";

const app = {
  currentSongIndex: 0,
  // settings: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  // setConfig: function (key, value) {
  //   this.config[key] = value;
  //   localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  // },

  songs: [
    {
      name: "Hero",
      singer: "Cash",
      path: "./music/Day-Dut-Noi-Dau-Mr-Siro.mp3",
      img: "./img/1.png",
    },
    {
      name: "Nhạc 2",
      singer: "Singer 2",
      path: "./music/Shay-Nanggg-AMEE-Obito.mp3",
      img: "./img/2.jpg",
    },
    {
      name: "Nhạc 3",
      singer: "Singer 3",
      path: "./music/MotNganNoiDau-VanMaiHuongHuaKimTuyen-7561897.mp3",
      img: "./img/3.jpg",
    },
    {
      name: "Hero",
      singer: "Cash",
      path: "./music/Day-Dut-Noi-Dau-Mr-Siro.mp3",
      img: "./img/1.png",
    },
    {
      name: "Nhạc 2",
      singer: "Singer 2",
      path: "./music/Shay-Nanggg-AMEE-Obito.mp3",
      img: "./img/2.jpg",
    },
    {
      name: "Nhạc 3",
      singer: "Singer 3",
      path: "./music/MotNganNoiDau-VanMaiHuongHuaKimTuyen-7561897.mp3",
      img: "./img/3.jpg",
    },
  ],
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;
    isPlaying = false;
    isRandom = false;
    isRepeat = false;

    // Xử lý CD quay / dừng
    const cdThumbAnimate = cdThumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 10000, // 10seconds = 10000
        iterations: Infinity,
      }
    );

    cdThumbAnimate.pause();
    // Xử lý phóng to thu nhỏ CD
    document.onscroll = function () {
      var scrollTopPX = window.scrollY || document.documentElement.scrollTop;
      var newScrollPX = cdWidth - scrollTopPX;
      cd.style.width = newScrollPX > 0 ? newScrollPX + "px" : 0;
      cd.style.opacity = newScrollPX / cdWidth;
    };

    // Xử lý khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
    };

    // Khi bài hát được play
    audioElement.onplay = function () {
      _this.isPlaying = true;
      cdThumbAnimate.play();
      player.classList.add("playing");
    };

    // Khi bài hát pause
    audioElement.onpause = function () {
      _this.isPlaying = false;
      cdThumbAnimate.pause();
      player.classList.remove("playing");
    };

    // Thanh tiến độ bài hát
    audioElement.ontimeupdate = function () {
      if (audioElement.duration) {
        var progressPercent = Math.floor(
          (audioElement.currentTime / audioElement.duration) * 100
        );
        progressBar.value = progressPercent;
      }
    };
    // Xử lý khi tua bài hát
    progressBar.oninput = function (e) {
      const seekTime = (e.target.value * audioElement.duration) / 100;
      audioElement.currentTime = seekTime;
    };

    // Xử lý bấm next bài hát
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.nextSong();
      }
      _this.scrollToActiveSong();
      audioElement.play();
      _this.render();
    };

    // Xử lý khi bấm trở về bài hát
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.prevSong();
      }
      _this.scrollToActiveSong();
      audioElement.play();
      _this.render();
    };

    // Xử lý khi click vào nút random
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      // _this.setConfig("isRandom", _this.isRandom);
      this.classList.toggle("active", _this.isRandom);
    };

    // Xử lý bài hát kết thúc
    audioElement.onended = function () {
      if (_this.isRepeat) {
        audioElement.play();
      } else {
        nextBtn.click();
      }
    };

    // Xử lý bấm nút repeat
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      // _this.setConfig("isRepeat", _this.isRandom);
      repeatBtn.classList.toggle("active");
    };

    // Xử lý click vào playlist
    playlist.onclick = function (e) {
      if (
        e.target.closest(".song:not(.active)") ||
        e.target.closest(".option")
      ) {
        if (e.target.closest(".song:not(.active)")) {
          _this.currentSongIndex = Number(
            e.target.closest(".song:not(.active)").dataset.index
          );
          _this.loadCurrentSong();
          _this.render();
          audioElement.play();
        }
      }
    };
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentSongIndex];
      },
    });
  },
  prevSong: function () {
    this.currentSongIndex--;
    if (this.currentSongIndex < 0) {
      this.currentSongIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  nextSong: function () {
    this.currentSongIndex++;
    if (this.currentSongIndex >= this.songs.length) {
      this.currentSongIndex = 0;
    }
    this.loadCurrentSong();
  },
  randomSong: function () {
    let newIndexSong;
    do {
      newIndexSong = Math.floor(Math.random() * this.songs.length);
    } while (newIndexSong === this.currentSongIndex);
    this.currentSongIndex = newIndexSong;
    console.log(this.currentSongIndex);
    this.loadCurrentSong();
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      document.querySelector(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 500);
  },
  loadCurrentSong: function () {
    heading.innerText = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`;
    audioElement.setAttribute("src", this.currentSong.path);
  },
  render: function () {
    const _this = this;
    const htmls = this.songs.map(function (song, index) {
      return `
        <div class='song ${
          index === _this.currentSongIndex ? "active" : ""
        }' data-index="${index}">
          <div
            class="thumb"
            style="
              background-image: url('${song.img}');
            "
          ></div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>`;
    });
    playlist.innerHTML = htmls.join("");
  },
  start: function () {
    // Định nghĩa các thuộc tính cho object
    this.defineProperties();

    // Lắng nghe/ xử lý các sự kiện DOM
    this.handleEvents();

    // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();

    // Render ra playlist
    this.render();
  },
};

app.start();
