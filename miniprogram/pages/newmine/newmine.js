// pages/mine/mine.js
const app = getApp();
Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        TabCur:0,
        tabNav: ['最近浏览', '收藏', '消息'],
        dishes: [{
          "dish_picture": "../../images/dishes/打卤面.jfif",
          "dish_name": "打卤面",
          "dish_cost": 9,
          "dish_comment": "咸淡适中，肉量很足。",
          "dish_canteen": "清芬园",
          "dish_canteen_on": "营业中"
        },
        {
          "dish_picture": "../../images/dishes/铁板鸡饭.jfif",
          "dish_name": "铁板鸡饭",
          "dish_cost": 21,
          "dish_comment": "真的非常好吃，鸡肉量很大而且很香，酱汁的味道也很浓郁，还想再吃。",
          "dish_canteen": "观畴园",
          "dish_canteen_on": "营业中"
        },
        {
          "dish_picture": "../../images/dishes/石锅拌饭.jfif",
          "dish_name": "石锅拌饭",
          "dish_cost": 18,
          "dish_comment": "超喜欢，比喜欢嘉然还喜欢。",
          "dish_canteen": "玉树园",
          "dish_canteen_on": "营业中"
        },
        {
          "dish_picture": "../../images/dishes/葱油饼.jfif",
          "dish_name": "葱油饼",
          "dish_cost": 12,
          "dish_comment": "香，真的香。",
          "dish_canteen": "观畴园",
          "dish_canteen_on": "营业中"
        },
        {
          "dish_picture": "../../images/dishes/派蒙.jpg",
          "dish_name": "应急食品",
          "dish_cost": 648,
          "dish_comment": "派蒙才不是食物！",
          "dish_canteen": "原神",
          "dish_canteen_on": "营业中"
        },
      ]
      },
      tabSelect(e) {
        console.log(e);
        this.setData({
          TabCur: e.currentTarget.dataset.id,
          scrollLeft: (e.currentTarget.dataset.id - 1) * 60
        })
        
      },
    /**
     * 页面的初始数据
     */

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