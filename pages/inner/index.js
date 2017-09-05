// pages/inner/index.js
const WxParse = require('../../wxParse/wxParse.js');
const api = require('../../api/index.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleData:{},
    hd:{}
  },
  /**
   * 根据id获取正文数据
   */
  getArticleById(id){
    api.getArticleById(id).then((data) => {
      let article = data.body;
      let hd = {}
      hd.title = data.title
      hd.time = data.time
      hd.origin = data.origin
      this.setData({
        hd:hd
      })
      WxParse.wxParse('article', 'html', article, this, 0);
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getArticleById(options.id)
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
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