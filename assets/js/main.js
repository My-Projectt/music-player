const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')

const playBtn = $('.btn-toggle-play')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const player = $('.player')
const progress = $('#progress')


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [{
            name: '3107 - 3',
            singer: 'W/n x Duongg x Nâu x Titie',
            path: './assets/music/song1.mp3',
            image: './assets/img/song1.jpg'
        },
        {
            name: '3107 - 2',
            singer: 'W/n x Duongg x Nâu',
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            name: 'Dù Cho Mai Về Sau',
            singer: 'buitruonglinh',
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.jpg'
        },
        {
            name: 'Đường Tôi Chở Em Về',
            singer: 'buitruonglinh',
            path: './assets/music/song4.mp3',
            image: './assets/img/song4.jpg'
        },
        {
            name: 'Kẻ Điên Tin Vào Tình Yêu',
            singer: 'LilZpoet',
            path: './assets/music/song5.mp3',
            image: './assets/img/song5.jpg'
        },
        {
            name: 'Ái Nộ',
            singer: 'Masew x Khoi Vu',
            path: './assets/music/song6.mp3',
            image: './assets/img/song6.jpg'
        },
    ],
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}">
                <div class="thumb" 
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`

        })
        $('.playlist').innerHTML = htmls.join('')
    },
    handleEvents: function() {
        const cdWidth = cd.offsetWidth //! set width của cdWidth = width của class .cd
        const _this = this

        //todo: Xử lí CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([{
            transform: 'rotate(360deg)'
        }], {
            duration: 10000, //! quay hết 1 vòng là 10 giây
            iterations: Infinity //! quay vô hạn lần
        })
        cdThumbAnimate.pause() //! Khi bài hát ở trạng thái ban đầu thì CD ko quay

        //Thu nhỏ và làm mờ CD khi lăn chuột
        document.onscroll = function() {
            //todo: chọn scroll từ màn hình hoặc scroll từ element HTML
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop //! Lấy width của cd hiện tại trừ cho vị trí scrollTop

            //todo: Thu nhỏ và làm mờ CD khi lăn chuột
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        //Xử lí khi click play
        playBtn.onclick = function() {

            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
        //Khi bài hát đc Play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play() //! Khi play thì CD quay
        }
        //Khi bài hát bị Pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause() //! Khi pause thì CD dừng quay
        }

        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            //todo: duration trả về số giây của audio
            if (audio.duration) {
                //todo: Tính tỉ lệ phần trăm
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                    //todo: Gán value của Element <input id="progress" class="progress" 
                    //todo:                       type="range" value="0" step="1" min="0" max="100">
                progress.value = progressPercent
            }
        }

        //Xử lí khi tua bài hát trên thanh seekbar
        progress.onchange = function(e) {
            //todo: Tính số giây khi đang chạy bài hát
            //todo: e.target.value tính phần trăm tiến độ thanh seekbar (target lấy value của id #progress)
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        //Xử lí khi Next và Prev bài hát
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong() //! Random khi Next
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
        }
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong() //! Random khi Prev
            }else{
                _this.prevSong()
            }
            audio.play()
            _this.render()
        }

        // Xử lí (bật/tắt) Random
        randomBtn.onclick = function(){
            _this.isRandom = !_this.isRandom
            //todo: Nếu isRandom = true thì sẽ add class active
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // Xử lí khi Repeat
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat
            //todo: Nếu isRandom = true thì sẽ add class active
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Xử lí Next khi bài hát kết thúc
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
        }
    },
    defineProperties: function() {
        //app.currentSong = bài hát đầu tiên
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    },
    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function() {
        //Xử lí các sự kiện
        this.handleEvents()

        //Định nghĩa các thuộc tính cho Object
        this.defineProperties()

        //Load thông tin bài hát đầu tiên vào UI khi load trang web
        this.loadCurrentSong()

        this.render()
    }
}

app.start()