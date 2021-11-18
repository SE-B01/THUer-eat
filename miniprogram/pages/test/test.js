// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      msg: {},
      testData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 前端 -> 后端
    wx.request({
      url: 'http://127.0.0.1:5000/appraise_test',
      data: {
        test: [1, 2, 3]
      },
      method: 'GET',
      success: (res) => {

      }
    }),
    // 后端 -> 前端
    wx.request({
      url: 'http://127.0.0.1:5000/appraise_test2',
      data: {

      },
      method: 'GET',
      success: (res) => {
        console.log(res.data.appraise)
        this.setData({
          testData: res.data.appraise
        })
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