// pages/feedbackmag/feedbackmag.js
const app = getApp()
const fileManager = wx.getFileSystemManager();
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
  showModal(e) {
    console.log('触发showModal')
    console.log(e.feedbackid)
    console.log(e)
    this.setData({
      textareaAValue: '',
      modalName: e.currentTarget.dataset.target,
      feedbackid:e.currentTarget.dataset.feedbackid
    })
  },
  showModalClear(e) {
    this.setData({
      modalName: null
    })
  },
  hideModal(e) {
    console.log(this.data.imgUrl)
    this.setData({
      textareaAValue: '',
      modalName: null
    })
  },
  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
  })
},
  replyFeedback(e) {
    var that = this
    console.log(that.data.textareaAValue)
    console.log(that.data.feedbackid)
      wx.showToast({
      title: '回复反馈成功',
      icon: 'success',
      duration: 1500,
      success: (res) => {
        //console.log('success')
        this.setData({
          textareaAValue: ''
        })
      }
    }),
    this.setData({
      modalName: null
    }),
    wx.request({
      url: 'http://127.0.0.1:5000/reply_feedback',
      data: {
        content: this.data.textareaAValue,
        feedbackid:that.data.feedbackid,
        userid:app.globalData.userInfo.id
      },
      method: 'GET',
      success: (res) => {
        wx.reLaunch({
          url: 'feedbackmag',
        })
      }
    })
    //console.log('textareaAValue: ' + this.data.textareaAValue)
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
        console.log('feedback')
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