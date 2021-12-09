// pages/appraise/appraise.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //appraises: 存放评论
    appraises:[],

    //like_changed: 记录用户点赞状态变化的评论，关闭页面前提交到数据库
    like_changed:[],
  },

  likeClick: function(e) {
    var that = this
    var idx = e.target.dataset.idx
    if (that.data.appraises[idx].isClick) {
      that.data.appraises[idx].like--
      for (var i = 0; i < that.data.like_changed.length; i++) {
        if (that.data.like_changed[i] == idx){
          that.data.like_changed.splice(i,1)
          break
        }
      }
    } else {
      that.data.appraises[idx].like++
      that.data.like_changed.splice(0,0,idx)
    }
    //点赞取反
    that.data.appraises[idx].isClick = !that.data.appraises[idx].isClick
    //刷新
    that.setData({
      appraises: that.data.appraises
    })
    console.log(that.data.like_changed)
  },

  getAppraise: function (get_new_lines) {
    wx.showLoading({
      title: "加载中",
      mask: true
    })
    var get_new_lines = get_new_lines||false;
    var id = app.globalData.openid
    var that = this
    wx.request({
      url: 'http://127.0.0.1:5000/appraise/get_all',
      data: {
        user_id: id,
        get_new_lines: get_new_lines,
        now_lines: that.data.appraises.length
      },
      success: function(res){
        wx.hideLoading()
        if (get_new_lines){
          if (res.data.length == 0){
            wx.showToast({
              title: '已加载所有评论',
              icon: 'success',
              duration: 1000
             })
          }
          else{
            that.setData({
              appraises: that.data.appraises.concat(res.data),
            })
          }
        }
        else{
          that.setData({
            appraises: res.data,
          })
        }
      }
    })
  },
  
  pushLikeChange: function () {
    var that = this
    if (that.data.like_changed.length != 0){
      var like_id = []
      for (var i = 0; i < that.data.like_changed.length; i++) {
        like_id.splice(0,0,that.data.appraises[that.data.like_changed[i]]["id"])
      }
      console.log(like_id)
      wx.request({
        url: 'http://127.0.0.1:5000/appraise/changeLiked',
        data: {
          user_id: app.globalData.openid,
          like_changed: like_id.join(';')
        },
        success: function(res){
          console.log(res)
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAppraise()

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
    this.pushLikeChange()

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.pushLikeChange()

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
    this.getAppraise(true)

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})