// pages/player/index.js
const api = require('../../api/index.js')
const timeSuffix = ' 00:00:00.0'
const backgroundAudioManager = wx.getBackgroundAudioManager()
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:'', //日期
    today:'', //今天
    channelInfo:{},
    programList:[],
    playingName:'',
    playingImgUrl:'',
    liveStream:'', //直播流
    isLiveIndex:-1, //直播index
    isToday:true, //是否当天
    isPlayIndex:-1, //正在播放的index
    isShowLive:true, //是否显示live播放
    audioPercent:-1, 
    isPlaying:true,
    currentTime:'00:00',
    duration:'00:00',
    scrollTop:300
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let cid = options.cid;
    this.cid = cid
    wx.showLoading({
      title: "加载中..."
    })
    let today = this._getToDay()
    this.setData({
      date : today,
      today : today
    })
    this._fetch(cid, this._timeToStamp(today + timeSuffix)).then((res) => {
      console.log(res)
      if(res.playIndex) {
        this.setData({
          isLiveIndex: res.playIndex
        })
      }    
      this.listenPlayer(res.liveStream)
    })    
  },
  _fetch(cid, stamp) {
    wx.showLoading({
      title: "加载中..."
    })
    return new Promise((resolve,reject) => {
      api.clickItem(cid, stamp).then((res) => {
        console.log(res)
        let programs = res.programs;
        if (programs && programs.length>0) {
          let liveStream = res.streams[0];
          let playingName = res.live;
          let playIndex = this._isPlay(programs)
          let playingImgUrl = res.image
          this.setData({
            liveStream,
            playingName,
            playingImgUrl,
            isPlayIndex: playIndex,
            channelInfo: res,
            programList: this._createArr(programs)
          })
          resolve({
            playIndex, liveStream
          })
        }else{
          let liveStream = res.streams[0];
          let playingName = res.live || res.name;
          this.setData({
            liveStream,
            playingName,
            channelInfo: res,
          })
          resolve({
            liveStream
          })
        }
        
        setTimeout(() => {
          wx.hideLoading()
        }, 20)
        
      })
    })
  },
  listenPlayer(src) {
    backgroundAudioManager.title = this.data.playingName || "河南广播" ;
    backgroundAudioManager.src = src;
    backgroundAudioManager.coverImgUrl = 'http://program.hndt.com' + this.data.playingImgUrl;
    backgroundAudioManager.protocol = 'hls';
    backgroundAudioManager.onPlay(() => {
      this.setData({
        isPlaying: true
      })
      wx.hideLoading()
    })
    backgroundAudioManager.onPause(() => {
      this.setData({
        isPlaying: false
      })
     
    })
    backgroundAudioManager.onWaiting(() => {
      wx.showLoading({
        title: '音频加载...',
      })
    })
    backgroundAudioManager.onCanplay(() => {
      backgroundAudioManager.play()
      wx.hideLoading()
    })
    backgroundAudioManager.onTimeUpdate(() => {
      let { duration, currentTime } = backgroundAudioManager
      let audioPercent = (currentTime / duration * 100).toFixed(2);
      duration = util.formatPlayTime(duration)
      currentTime = util.formatPlayTime(currentTime)
      this.setData({
        currentTime,
        duration,
        audioPercent
      })
    })
  },
  seekAudio(event) {
    let { value } = event.detail
    let seekTime = backgroundAudioManager.duration * value / 100 | 0;
    backgroundAudioManager.seek(seekTime)
    backgroundAudioManager.play()
    wx.seekBackgroundAudio({
      position: seekTime,
      success:() => {
        setTimeout(() => {
         
          backgroundAudioManager.play()
        },20)
      },
      complete:() => {
        setTimeout(() => {
          backgroundAudioManager.play()
        }, 20)
      }
    })    
  },
  audioPause() {
    // backgroundAudioManager.pause()
  },
  onLaunch() {
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    
  },
  //播放暂停
  switchPlayState() {
    if (backgroundAudioManager.paused) {
      backgroundAudioManager.play()
    } else {
      backgroundAudioManager.pause()
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  _createArr(arr) {
    let newArr = []
    
    for(let i =0, len = arr.length;i < len; i++) {
      let item = arr[i];
      let obj = {
        begin: this._format(item.beginTime),
        end: this._format(item.endTime),
        title: item.title,
        playUrl: item.playUrl[0]
      }
      
      newArr.push(obj)
    }

    return newArr
  },
  _formatPlayTime(interval) {
    interval = interval | 0
    const minute = this._pad(interval / 60 | 0)
    const second = this._pad(interval % 60)
    return `${minute}:${second}`
  },
  _format(interval) {
    let val = parseInt(interval) * 1000;
    let time = new Date(val);
    const hour = this._pad(time.getHours());
    const min = this._pad(time.getMinutes());
    return `${hour}:${min}`
  },
  _pad(num, n = 2) {
    let len = num.toString().length
    while (len < n) {
      num = '0' + num
      len++
    }
    return num
  },
  _getToDay() {
    let year = (new Date()).getFullYear();
    let month = this._pad(new Date().getMonth() + 1);
    let day = this._pad(new Date().getDate())
    let today = `${year}-${month}-${day}`
    return today
  },
  //时间转时间戳
  _timeToStamp(date) {
    // var date = '2015-03-05 00:00:00.0';
    date = date.substring(0, 19);
    date = date.replace(/-/g, '/');
    var timestamp = new Date(date).getTime();
    return timestamp / 1000;
  },
  bindDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let date = e.detail.value;
    let today = this._getToDay()
    this._fetch(this.cid, this._timeToStamp(date + timeSuffix))
    console.log(date, today)
    if (date == today) {
      this.setData({
        isToday:true
      })
    }else {
      this.setData({
        isToday: false
      })
    }
    this.setData({
      date
    })
  },
  _isPlay(programs) {
    let currentTime = (new Date()).getTime() / 1000 | 0;//当前时间时间戳
    let index = 0
    for (let i = 0; i < programs.length; i++) {
      let item = programs[i];
      if (currentTime <= item.endTime && currentTime >= item.beginTime) {
        return i
      }
    }
  },
  //列表点击播放
  playBack(event) {
    let dataset = event.currentTarget.dataset
    let src = dataset.src || dataset.livesrc
    let playname = dataset.playname
    let index = dataset.index
    let liveIndex = dataset.liveindex
    let isToday = parseInt(dataset.istoday)
    if(src) {
      setTimeout(() => {
        if (isToday && index == liveIndex) {
          this.setData({
            isShowLive: true
          })
        } else {
          this.setData({
            isShowLive: false
          })
        }
      }, 20)
      this.setData({
        playingName: playname,
        isPlayIndex: index
      })
      //音频源
      console.log(src)
      // audioCtx.src = src
      this.listenPlayer(src)
    }else{
      return 
    }
    
  },
  //播放进度条更新
  _timeupdate(audio) {
    let currentTime = audio.currentTime
    let duration = audio.duration
    this.setData({
      audioPercent: currentTime / duration * 100 | 0,
      duration: this._formatPlayTime(duration),
      currentTime: this._formatPlayTime(currentTime) 
    })
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})