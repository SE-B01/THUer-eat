// pages/appraise/appraise.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comments:[
      {
        img:"../../images/dishes/石锅拌饭.jfif",
        content:"非常好吃哦。",
        avatar:"../../images/dishes/派蒙.jpg",
        user_name:"派蒙",
        like_number:20,
        isClick:false,
        comment_canteen:"听涛园",
      },
      {
        img:"../../images/dishes/葱油饼.jfif",
        content:"太好吃了吧，简直是珍馐，我们一起吃好不好，一起做学园厨师！",
        avatar:"../../images/dishes/唐可可.webp",
        user_name:"唐可可",
        like_number:30,
        isClick:false,
        comment_canteen:"观畴园",
      },
    ],
    //like_comments_idx: 记录已经被用户点赞的评论，每次关闭页面前需要更新到数据库
    like_comments_idx:[0],
  },

  likeClick: function(e) {
    var that = this
    var idx = e.target.dataset.idx
    if (that.data.comments[idx].isClick) {
      that.data.comments[idx].like_number--
      for (var i = 0; i < that.data.like_comments_idx.length; i++) {
        if (that.data.like_comments_idx[i] == idx){
          that.data.like_comments_idx.splice(i,1)
          break
        }
      }
    } else {
      that.data.comments[idx].like_number++
      that.data.like_comments_idx.splice(0,0,idx)
    }
    //点赞取反
    that.data.comments[idx].isClick = !that.data.comments[idx].isClick
    //刷新
    that.setData({
      comments: that.data.comments
    })
    console.log(that.data.like_comments_idx)
  },
  setIsClick: function() {
    var that = this
    for (var i = 0; i < that.data.like_comments_idx.length; i++) {
      if (that.data.comments[that.data.like_comments_idx[i]].isClick == false){
        that.data.comments[that.data.like_comments_idx[i]].isClick = true
      }
    }
    that.setData({
      comments: that.data.comments
    })
  },

  getAppraise: function () {
    
    
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