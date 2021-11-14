// pages/home/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 1,
    scrollLeft: 0,
    //宫格，不用修改
    iconList: [{
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
    gridCol: 3,
    skin: false,

    //dropDownMenu数据
    dropDownMenuTitle: ['美食种类', '附近', '支付方式','排序方式'],
    dropDownMenuFourthData: [{
      id: 1,
      title: '智能排序'
    }, {
      id: 2,
      title: '好评优先'
    }, {
      id: 3,
      title: '距离优先'
    }], //排序数据
    dropDownMenuFirstData: [
      {id: 1, title: '清淡菜品',
      childModel: [
        { id: '11', title: '粤菜'}, 
        { id: '12', title:'淮扬菜'}]
    },
      {id: 2, title: '川湘口味',
      childModel: [
        { id: '11', title: '川菜'}, 
        { id: '12', title:'湘菜'}]},
    ],
    dropDownMenuSecondData: [
      {id: 1, title: '<500m'},
      {id: 2, title: '<1km'},
      {id: 3, title: '<3km'},
    ],
    dropDownMenuThirdData: [
      {id: 1, title: '仅支持校园卡'},
      {id: 2, title: '可以使用支付宝'}
    ],
    //餐厅信息，后续从数据库读取
    canteens: [{
        "canteen_name": "听涛园",
        "canteen_picture": "../../images/canteens/听涛园.jfif",
        "canteen_rank": "5",
        "canteen_cost": "18",
        "canteen_opentime": "9:00-18:00",
        "canteen_location": "学堂路与至善路交界处",
        "canteen_tag": ["好吃", "便宜", "哈哈哈"]
      },
      {
        "canteen_name": "观畴园",
        "canteen_picture": "../../images/canteens/观畴园.jfif",
        "canteen_rank": "3",
        "canteen_cost": "20",
        "canteen_opentime": "9:00-18:00",
        "canteen_location": "学堂路与至善路交界处",
        "canteen_tag": ["好吃", "人较多"]
      }
    ],
    //菜品信息，后续从数据库读取
    dishes: [{
        "dish_picture": "../../images/dishes/打卤面.jfif",
        "dish_name": "打卤面",
        "dish_cost": 9,
        "dish_comment": "咸淡适中，肉量很足。",
        "dish_canteen": "清芬园"
      },
      {
        "dish_picture": "../../images/dishes/铁板鸡饭.jfif",
        "dish_name": "铁板鸡饭",
        "dish_cost": 21,
        "dish_comment": "真的非常好吃，鸡肉量很大而且很香，酱汁的味道也很浓郁，还想再吃。",
        "dish_canteen": "观畴园"
      },
      {
        "dish_picture": "../../images/dishes/石锅拌饭.jfif",
        "dish_name": "石锅拌饭",
        "dish_cost": 18,
        "dish_comment": "超喜欢，比喜欢嘉然还喜欢。",
        "dish_canteen": "玉树园"
      },
      {
        "dish_picture": "../../images/dishes/葱油饼.jfif",
        "dish_name": "葱油饼",
        "dish_cost": 12,
        "dish_comment": "香，真的香。",
        "dish_canteen": "观畴园"
      },
      {
        "dish_picture": "../../images/dishes/派蒙.jpg",
        "dish_name": "应急食品",
        "dish_cost": 648,
        "dish_comment": "派蒙才不是食物！",
        "dish_canteen": "原神"
      },
    ]

  },

  //tab键目前选定的页面
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  //dropDownMenu选定的选项
  selectedFourth:function(e){
    console.log("选中第" + e.detail.index + "个标签，选中的id：" + e.detail.selectedId + "；选中的内容：" + e.detail.selectedTitle);
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
    if (typeof this.getTabBar === 'function' &&
    this.getTabBar()) {
    this.getTabBar().setData({
      selected: 0
    })
    this.getTabBar().changeFormat()
  }


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