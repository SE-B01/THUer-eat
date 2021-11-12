// pages/map/map.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    addmissage: '选的位置',
    // markers	 Array	标记点
    stitle:'故宫',
    latitude: "",
    longitude: "",
    scale: 14,
    markers: [],
    distanceArr: [],
    active: 0,
    value: 4,
    open: false,
    index: 0,
    paymethod: ['仅校园卡', '校园卡及其它方式', '仅其他方式'],
    cost:["1-5￥","6-10￥","11-15￥","16-20￥",">20￥"],
    // select: [{
    //     title: '支付方式',
    //     open: false
    //   },
    //   {
    //     title: '人均消费',
    //     open: false
    //   },
    //   {
    //     title: '更多筛选',
    //     open: false
    //   },
    //   {
    //     title: '附近食堂',
    //     open: false
    //   }
    // ],
    indexSign: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //获取当前的地理位置、速度
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        //赋值经纬度
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
 
        })
      }
    })
  },
})