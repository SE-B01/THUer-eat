// pages/reply.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: "",
    id:"",
    openid:"",
  },

  bindTextAreaBlur: function (e) {
    console.log("Content input", e.detail.value)
    this.setData({
      content: e.detail.value
    })
  },

  submitClick: function (e) {
    var that = this
    if (this.data.content == "") {
      wx.showModal({
        title: '提示',
        content: '还什么都没有输入呢~',
        confirmText: "我知道了",
        showCancel: false,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      // 调用云函数
      console.log("before send_reply")
      console.log(that.data.openid)
      console.log(that.data.content)
      wx.cloud.callFunction({
        name: 'send_reply',
        data: {
          content: that.data.content,
          openid: that.data.openid,
        },
        success: res => {
          console.log(res);
          if (res.result.errCode == 0) {
            wx.showModal({
              title: '提示',
              content: '发送回复成功！',
              confirmText: "我知道了",
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.navigateBack({
                    delta: 1
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          } else {
            wx.showModal({
              title: '抱歉，出错了呢~',
              content: res.result.errMsg,
              confirmText: "我知道了",
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        },
        fail: err => {
          console.error('[云函数] [send_reply] 调用失败', err)
          wx.showModal({
            title: '调用失败',
            content: '请检查云函数是否已部署',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      })
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id,
      openid:options.openid
    })
    console.log(this.data.openid)
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