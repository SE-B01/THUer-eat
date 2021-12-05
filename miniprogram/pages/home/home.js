// pages/home/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //TabCur：校园食堂/发现好菜互相跳转
    TabCur: 0,
    scrollLeft: 0,

    //用户信息
    nickName: "未登录",
    is_admin: false,
    userInfo:'',
    openid: "",
    newuser:"0",
    //宫格，不用修改

    //选择食堂时dropDownMenu数据
    drop_canteen_titles: ['附近', '用餐风格', '支付方式', '排序方式'],
    drop_canteen_distance: [
      {id: 0, title: '不限距离'},
      {id: 1, title: '<500m'},
      {id: 2, title: '<1km'},
      {id: 3, title: '<3km'},
    ],
    drop_canteen_style: [
      {id: 0, title: '风格不限'},
      {id: 1, title: '个人独享'},
      {id: 2, title: '朋友小聚'},
      {id: 3, title: '宴请四方'}
    ],
    drop_canteen_payment: [
      {id: 0, title: '支付方式不限'},
      {id: 1, title: '仅支持校园卡'},
      {id: 2, title: '可以使用支付宝'}
    ],
    drop_canteen_sortby: [
      {id: 0, title: '智能排序'},
      {id: 1, title: '好评优先'},
      {id: 2, title: '距离优先'}
    ],

    //选择菜品时dropDownMenu数据
    drop_dish_titles: ['附近', '口味', '价格区间','排序方式'],
    drop_dish_distance: [
      {id: 0, title: '不限距离'},
      {id: 1, title: '<500m'},
      {id: 2, title: '<1km'},
      {id: 3, title: '<3km'},
    ],
    drop_dish_favour: [
      {id: 0, title: '口味不限'},
      {id: 1, title: '清淡口味'},
      {id: 2, title: '鲜辣口味'},
      {id: 3, title: '大鱼大肉'},
    ],
    drop_dish_price: [
      {id: 0, title: '价格不限'},
      {id: 1, title: '5-10元'},
      {id: 2, title: '10-50元'},
      {id: 3, title: '50元以上'}
    ],
    drop_dish_sortby: [
      {id: 0, title: '智能排序'},
      {id: 1, title: '好评优先'},
      {id: 2, title: '新菜优先'}
    ],
    //目前的筛选信息
    canteen_select:[0,0,0,0],
    dish_select:[0,0,0,0],

    //餐厅信息，从数据库读取
    canteens: [],

    //菜品信息，从数据库读取
    dishes: []

  },

  //tab键目前选定的页面
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  //dropDownMenu选定的选项
  filterSelect: function (e) {
    if (this.data.TabCur==0){
      if ((e.detail.selectdata[0] != this.data.canteen_select[0]) ||(e.detail.selectdata[1] != this.data.canteen_select[1]) || (e.detail.selectdata[2] != this.data.canteen_select[2]) ||(e.detail.selectdata[3] != this.data.canteen_select[3])) {
        this.setData({
          canteen_select: e.detail.selectdata
        })
        //console.log(this.data.canteen_select)
        this.getSelectCanteens()
      }
    }
    else {
      this.setData({
        dish_select: e.detail.selectdata
      })
      this.getSelectDishes()
    }
  },

  //点击餐厅图片跳转到指定餐厅
  switchToCanteen: function (e) {
    var canteen = e.currentTarget.dataset.canteen
    wx.navigateTo({
      url: "../canteen/canteen?canteen=" + canteen
    })
  },
  //点击菜品图片跳转到指定菜品
  switchToDish: function (e) {
    var dish = e.currentTarget.dataset.dish
    var canteen = e.currentTarget.dataset.canteen
    //console.log(dish)
    //console.log(canteen)
    wx.navigateTo({
      url: "../dish/dish?dish=" + dish + '&canteen=' + canteen
    })
  },
  switchToPlaza: function (e) {
    wx.navigateTo({
      url: "../plaza/plaza"
    })
  },
  search: function (e){
    wx.navigateTo({
      url: "../search/search?" 
    })
  },

  getOpenid: function () {
    //获得当前登录用户的openid
    var that = this
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'http://127.0.0.1:5000/getUserId',
            data: {
              code: res.code,
              appid: "wxf14afe0de0f6f4e7"
              //这里没有传appsecret，放在后端了
            },
            success: function(res){
              //console.log('openid_res')
              //console.log(res)
              //console.log(res.data[1])
              that.setData({
                openid: res.data[0].openid,
                newuser: res.data[1]
              })
              //console.log('get openid0')
              app.globalData.openid = that.data.openid
              //console.log('get openid')
              //console.log(app.globalData.openid)
              //console.log(app.globalData.openid)
              //console.log(that.data.newuser)
              if (that.data.newuser==0){
                that.getUserNameAvatar()
                //console.log('begin user info')
              }
              else{
                app.globalData.logged=true
                that.searchUserNameAvatar()
              }
              
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  searchUserNameAvatar: function () {
    var that = this
    //console.log('searching')
    wx.request({
      url: 'http://127.0.0.1:5000/searchUserinfo',
      data: {
        openid: that.data.openid
      },
      method: 'GET',
      success: (res) => {
        //console.log("get user info")
        //console.log(res.data)
        that.setData({
          userInfo: res.data[0],
        })
        app.globalData.userInfo=that.data.userInfo
        app.globalData.is_admin = that.data.userInfo.is_admin
      }
    })

  },
  getUserNameAvatar: function () {
    var that = this
    if (!app.globalData.logged) {
      wx.showModal({
        title: '提示',
        content: '请先登录哦~',
        confirmText: "我知道了",
        showCancel: false,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.getUserProfile({
              desc: '请填写你的信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
              success: (res) => {
                console.log("已经调用getUserProfile")
                //console.log(res)
                //console.log(res.userInfo.nickName)
                that.setData({
                  nickName: res.userInfo.nickName,
                  avatarUrl: res.userInfo.avatarUrl,
                  userInfo: res.userInfo
                })
                app.globalData.userInfo = res.userInfo
                console.log('登陆成功')
                console.log(that.data.userInfo)
                that.insertUserinfo()
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      return
    }  
  },
  insertUserinfo: function () {
    var that = this
    console.log('inserting')
    wx.request({
      url: 'http://127.0.0.1:5000/insertUserinfo',
      data: {
        nickName: that.data.nickName,
        avatarUrl: that.data.avatarUrl,
        userInfo: that.data.userInfo,
        openid: that.data.openid
      },
      method: 'GET',
      success: (res) => {
        console.log("get canteens success")
        //console.log(res.data)
        that.setData({
          canteens: res.data,
        })
      }
    })
  },

  getSelectCanteens: function () {
    var that = this
    wx.request({
      url: 'http://127.0.0.1:5000/get_select_canteens',
      data: {
        distance: that.data.canteen_select[0],
        style: that.data.canteen_select[1],
        payment: that.data.canteen_select[2],
        sortby: that.data.canteen_select[3]
      },
      method: 'GET',
      success: (res) => {
        console.log("get canteens success")
        //console.log(res.data)
        that.setData({
          canteens: res.data,
        })
      }
    })
  },

  getSelectDishes: function () {
    var that = this
    wx.request({
      url: 'http://127.0.0.1:5000/get_select_dishes',
      data: {
        distance: that.data.dish_select[0]
      },
      method: 'GET',
      success: (res) => {
        //console.log("get dishes success")
        //console.log(res.data)
        that.setData({
          dishes: res.data,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var that = this
    //加载页面函数
    that.getSelectCanteens()
    that.getSelectDishes()
    //测试：getOpenid
    //console.log("test openid")
    that.getOpenid()
    //登录模块
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