// pages/index/index.js
const api = require('../../api/index.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsList:[],
    pageIndex:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: "加载中..."
    })
    //首页数据
    api.getNewsList(this.data.pageIndex).then((res) => {
      console.log(res.list)
      this.setData({
        newsList: res.list
      })
      setTimeout(() => {
        wx.hideLoading()
      }, 20)
    })
  },
  /**
   * 获取新闻列表
   */
  getDataList(page){
    api.getNewsList(page)
  },
  goToInner:function(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/inner/index?id='+id,
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
    wx.showNavigationBarLoading()
    api.getNewsList(1).then((res) => {
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
    console.log('0000')
    this.data.pageIndex ++;
    api.getNewsList(this.data.pageIndex).then((res) => {
      let newNewsList = this.data.newsList.concat(res.list)
      this.setData({
        newsList: newNewsList
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {

  }
})