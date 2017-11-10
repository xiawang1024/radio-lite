// pages/player/index.js
const api = require('../../api/index.js')
const timeSuffix = ' 00:00:00.0'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:'',
    today:'',
    channelInfo:{},
    programList:[],
    isLiveIndex:0,
    isToday:true,
    isPlayIndex:0,
    isShowLive:true,
    audioPercent:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: "加载中..."
    })
    let today = this._getToDay()
    this.setData({
      date : today,
      today : today
    })
    this._fetch(7, this._timeToStamp(today + timeSuffix)).then((res) => {
      this.setData({
        isLiveIndex:res
      })
      setTimeout(() => {

      },20)
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
        let playIndex = this._isPlay(programs)

        this.setData({
          isPlayIndex: playIndex,
          channelInfo: res,
          programList: this._createArr(programs)
        })

        setTimeout(() => {
          wx.hideLoading()
        }, 20)
        resolve(playIndex)
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.audioCtx = wx.createAudioContext('wxAudio')
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
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let date = e.detail.value;
    this._fetch(7, this._timeToStamp(date + timeSuffix))
    if(date == this.today) {
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
  playBack(event) {
    let dataset = event.currentTarget.dataset
    let src = dataset.src || dataset.livesrc
    let index = dataset.index
    let liveIndex = dataset.liveindex
    let isToday = dataset.istoday
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
    },20)
    this.setData({
      isPlayIndex: index
    })
    //音频源
    console.log(src)
    this.audioCtx.setSrc('http://owaup0bqu.bkt.clouddn.com/0802%20%E6%B2%B3%E5%8D%97%E5%B9%BF%E6%92%ADAPP%E5%AE%A3%E4%BC%A0%EF%BC%88%E6%A6%82%E5%BF%B5%E7%AF%87%E4%B8%8B%E7%AF%87%EF%BC%89%20Banana%20Studio%E5%87%BA%E5%93%81.mp3')
    this.audioCtx.play()
  },
  timeupdate(event) {
    let detail = event.detail
    let currentTime = detail.currentTime
    let duration = detail.duration
    this.setData({
      audioPercent: currentTime / duration * 100 | 0 
    })
    console.log(detail)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})