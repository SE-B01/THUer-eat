// pages/appraise/appraise.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comments:[
      {
        img:"../../images/dishes/石锅拌饭.jfif",
        content:"太好吃了吧，简直是珍馐，我们一起吃好不好，一起做学园厨师！",
        avatar:"../../images/dishes/派蒙.jpg",
        user_name:"唐可可",
        like_number:20,
        comment_canteen:"听涛园",
      },
      {
        img:"../../images/dishes/葱油饼.jfif",
        comment_content:"太好吃了吧，简直是珍馐，我们一起吃好不好，一起做学园厨师！",
        comment_user_avatar:"../../images/icons/love_color.png",
        comment_user_name:"派蒙",
        like_number:20,
        comment_canteen:"听涛园",
      },
    ],
  },

  loveClick: function(e) {
    var that = this
    console.log(e)
    var id = e.target.id
    var idx = e.target.dataset.idx
    console.log("id:" + id + ",idx:" + idx)
    if (this.data.similar_words[idx].isClick) {

    } else {


    }

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