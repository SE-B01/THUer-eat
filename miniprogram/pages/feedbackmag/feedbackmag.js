// pages/feedbackmag/feedbackmag.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    feedbacks:[{
      contents:"我是你爹",
      name:"你的老父亲",
      times:"12/1",
      done:"已反馈"
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: 'http://127.0.0.1:5000/get_feedback',
      data: {
        user_id: app.globalData.userInfo.id
      },
      method: 'GET',
      success: (res) => {
        that.setData({
          feedbacks: res.data
        })
        console.log(that.data.feedbacks)
      }
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