// pages/map/map.js
const app = getApp();
"use strict";
const chooseLocation = requirePlugin('chooseLocation');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    latitude: "",
    longitude: "",
    scale: 16,
    markers: [{ 'id': 1, 'title': "桃李园", 'latitude': 40.010952, 'longitude': 116.326157 }],
    distanceArr: [],
    value: 4,
    open: false,
    modalName: '',
    target: "",
    canteen_list: null
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
      url: 'http://'+app.globalData.IpAddress + '/canteen/map_get',
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
    const location = chooseLocation.getLocation();
    if (location) {
      console.log(location)
    }
  },

  //显示路径
  showPath() {
    let plugin = requirePlugin('routePlan');
    let key = 'ALFBZ-ZBXW3-F7M3H-YVUCC-SJBT3-2CBKW';  //使用在腾讯位置服务申请的key
    let referer = 'THUer今天吃什么';   //调用插件的app的名称
    let endPoint = JSON.stringify({  //终点
      'name': this.data.canteen,
      'latitude': this.data.canteen_latitude,
      'longitude': this.data.canteen_longitude
    });
    wx.navigateTo({
      url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
    });
  },

  bindmarkertap(e) {
    console.log(e)
    console.log(this.data.markers)
    wx.request({
      url: 'http://'+app.globalData.IpAddress + '/canteen/get_byid',
      data: {
        id: e.markerId
      },
      method: 'GET',
      success: (res) => {
        console.log(res.data)
        this.setData({
          modalName: "bottomModal",
          canteen_list: res.data
        })
      }
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  searchCanteen(e) {
    wx.request({
      url: 'http://'+app.globalData.IpAddress + '/canteen/search',
      data: {
        text: e.detail.value
      },
      method: 'GET',
      success: (res) => {
        //console.log("get dishes success")
        console.log(res.data)
        this.setData({
          canteen_list: res.data,
          modalName: 'bottomModal'
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
  controltap(e) {
    let mpCtx = wx.createMapContext("map");
    mpCtx.moveToLocation();
  }
})