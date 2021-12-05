// pages/appraise/appraise.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    appraises:[],
    //changed_likes: 记录用户点赞的变化，每次关闭页面前需要更新到数据库
    changed_likes:[],
  },

  likeClick: function(e) {
    var that = this
    var idx = e.target.dataset.idx
    if (that.data.appraises[idx].isClick) {
      that.data.appraises[idx].like_number--
      for (var i = 0; i < that.data.changed_likes.length; i++) {
        if (that.data.changed_likes[i] == idx){
          that.data.changed_likes.splice(i,1)
          break
        }
      }
    } else {
      that.data.appraises[idx].like_number++
      that.data.changed_likes.splice(0,0,idx)
    }
    //点赞取反
    that.data.appraises[idx].isClick = !that.data.appraises[idx].isClick
    //刷新
    that.setData({
      appraises: that.data.appraises
    })
    console.log(that.data.changed_likes)
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.setIsClick()

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