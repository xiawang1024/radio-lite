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
    programList:[]
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
    this._fetch(7, this._timeToStamp(today + timeSuffix))
    
  },
  _fetch(cid, stamp) {
    wx.showLoading({
      title: "加载中..."
    })
    api.clickItem(cid, stamp).then((res) => {
      console.log(res)
      this.setData({
        channelInfo: res,
        programList: this._createArr(res.programs)
      })

      setTimeout(() => {
        wx.hideLoading()
      }, 20)
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
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
    this.setData({
      date
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})