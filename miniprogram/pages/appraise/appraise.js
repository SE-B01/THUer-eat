// pages/appraise/appraise.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    appraise_id:"",
    time:"",
    user_avatar: "",
    user_name: "",
    comment: "",
    img_list: [],
    canteen_name:"",
    like:0,
    isClick:false,
    like_changed:false,
  },

  likeClick: function(e) {
    var that = this
    //点赞、是否变化取反

    if (that.data.isClick){
      that.data.like--
    }
    else{
      that.data.like++
    }
    that.data.isClick = !that.data.isClick
    that.data.like_changed = !that.data.like_changed
    //刷新
    that.setData({
      isClick: that.data.isClick,
      like: that.data.like,
    })
  },

  getAppraiseDetail: function (appraise_id) {
    wx.showLoading({
      title: "加载中",
      mask: true
    })
    var id = app.globalData.openid
    var appraise_id = appraise_id
    var that = this
    wx.request({
      url: 'http://127.0.0.1:5000/appraise/get_detail',
      data: {
        user_id: id,
        appraise_id: appraise_id,
      },
      success: function(res){
        console.log(res)
        wx.hideLoading()
        that.setData({
          user_avatar: res.data.avatar,
          time:res.data.time,
          user_name: res.data.user_name,
          comment: res.data.comment,
          img_list: res.data.img_list,
          canteen_name: res.data.canteen_name,
          like: res.data.like,
          isClick: res.data.isClick,
        })
      }
    })
  },

  switchToCanteen: function (e) {
    var canteen = e.currentTarget.dataset.canteen
    wx.navigateTo({
      url: "../canteen/canteen?canteen=" + canteen
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //console.log(app.globalData)
    that.setData({
      appraise_id: options.appraise_id
      // canteen: "听涛园"
    })
    that.getAppraiseDetail(options.appraise_id)

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