// pages/home/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft:0,
    //宫格，不用修改
    iconList: [
  {
      icon: 'rank',
      color: 'yellow',
      badge: 0,
      name: '美食排行'
    }, {
      icon: 'group',
      color: "red",
      badge: 0,
      name: '评价广场'
    }, {
      icon: 'cascades',
      color: 'purple',
      badge: 0,
      name: '更多好玩'
    }],
    gridCol:3,
    skin: false,
    //餐厅信息，后续从数据库读取
    canteens:[
    {
      "canteen_name":"听涛园",
      "canteen_picture":"../../images/canteens/听涛园.jfif",
      "canteen_rank":"5",
      "canteen_cost":"￥18/人",
      "canteen_opentime":"9:00-18:00",
      "canteen_location":"学堂路与至善路交界处",
      "canteen_tag":"好吃"
    },
    {
      "canteen_name":"观畴园",
      "canteen_picture":"../../images/canteens/观畴园.jfif",
      "canteen_rank":"3",
      "canteen_cost":"￥18/人",
      "canteen_opentime":"9:00-18:00",
      "canteen_location":"学堂路与至善路交界处",
      "canteen_tag":"好吃"
    }
  ]
  },

  //tab键目前选定的页面
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
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