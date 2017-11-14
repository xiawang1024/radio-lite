// pages/radio/index.js
const api = require('../../api/index.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    liveList:[],
    currentIndex:-1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: "加载中..."
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    api.getLiveList(1).then((res) => {
      var list = res;
      var _this = this
      api.getLiveList(2).then((res) => {
        list = list.concat(res)
        console.log(list)
        _this.setData({
          liveList: list
        })
        setTimeout(() => {
          wx.hideLoading()
        }, 20)
      })      
    })
    this.audioCtx = wx.createAudioContext('myAudio')
  },
  play(e){
    
    let index = e.currentTarget.dataset.index;
    let streams = e.currentTarget.dataset.streams;
    let cid = e.currentTarget.dataset.cid;
    if (this.data.currentIndex == index) {
      this.audioCtx.pause()
      this.setData({
        currentIndex: -1
      })
    }else{
      
      this.setData({
        currentIndex: index
      })
    } 
    if (cid != 17 && cid != 18 && cid != 19 && cid != 20 && cid != 21 && cid != 22 && cid != 23) {
      this.audioCtx.pause()
      wx.navigateTo({
        url: '/pages/player/index?cid=' + cid,
      })
    }else{
      this.setSrc(streams)
    }
    
  },
  setSrc(src) {
    this.audioCtx.setSrc(src)
    this.audioCtx.play()
  },
  
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    api.getLiveList(1).then((res) => {
      this.setData({
        newsList: res.list
      })
      setTimeout(() => {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }, 20)
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})