// pages/map/map.js
"use strict";
const chooseLocation = requirePlugin('chooseLocation');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    addmissage: '选的位置',
    // markers	 Array	标记点
    stitle: '故宫',
    latitude: "",
    longitude: "",
    scale: 14,
    markers: [{ 'id': 1, 'latitude': 40.010952, 'longitude': 116.326157 }],
    distanceArr: [],
    active: 0,
    value: 4,
    open: false,
    index: 0,
    paymethod: ['仅校园卡', '校园卡及其它方式', '仅其他方式'],
    cost: ["1-5￥", "6-10￥", "11-15￥", "16-20￥", ">20￥"],
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
    wx.request({
      url: 'http://127.0.0.1:5000/canteen/map_get',
      data: {
      },
      method: 'GET',
      success: (res) => {
        console.log(res.data)
        this.setData({
          markers: res.data.markers
        })
      }
    })
  },

  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
      this.getTabBar().changeFormat()
    }
  },

  //显示地图
  showMap() {
    //使用在腾讯位置服务申请的key（必填）
    const key = "ALFBZ-ZBXW3-F7M3H-YVUCC-SJBT3-2CBKW";
    //调用插件的app的名称（必填）
    const referer = "THUer今天吃什么";
    wx.navigateTo({
      url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer
    });
  },
   //显示路径
  showPath() {
    let plugin = requirePlugin('routePlan');
    let key = 'ALFBZ-ZBXW3-F7M3H-YVUCC-SJBT3-2CBKW';  //使用在腾讯位置服务申请的key
    let referer = 'THUer今天吃什么';   //调用插件的app的名称
    let endPoint = JSON.stringify({  //终点
      'name': '吉野家(北京西站北口店)',
      'latitude': 39.89631551,
      'longitude': 116.323459711
    });
    wx.navigateTo({
      url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
    });
  }
})