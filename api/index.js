//api
const newsBaseUrl = "https://api.hndt.com"
/**
 * 获取新闻列表
 * 默认一页40条数据
 */
const getNewsList = (page, rows = 40) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: newsBaseUrl + '/api/page?template_id=93&rows=' + rows + '&page=' + page,
      success: (res) => {
        resolve(res.data)
      }
    })
  })
}
/**
 * 根据文章id查找文章
 */
const getArticleById = (id) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: newsBaseUrl + '/api/page?template_id=164&article_id=' + id,
      success: (res) => {
        resolve(res.data)
      }
    })
  })
}
/**
 * 获取直播播放列表
 */
const getLiveList = (id) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://program.hndt.com/get/live/class/' + id,
      success:(res) => {
        resolve(res.data)
      }
    })
  })
}

const clickItem = (channelId, time) => {
  return new Promise((resolve,reject) => {
    wx.request({
      url: 'https://program.hndt.com/get/vod/'+ channelId + '/' + time,
      success:(res) => {
        resolve(res.data)
      }
    })
  })
}

module.exports = {
  getNewsList,
  getArticleById,
  getLiveList,
  clickItem
}