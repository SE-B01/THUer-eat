// pages/home/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,

    scrollLeft:0,
    nickName: "未登录",
    is_admin: false,

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

    //选择食堂时dropDownMenu数据
    drop_canteen_titles: ['附近', '支付方式','排序方式'],
    drop_canteen_distance: [
      {id: 0, title: '不限距离'},
      {id: 1, title: '<500m'},
      {id: 2, title: '<1km'},
      {id: 3, title: '<3km'},
    ],
    drop_canteen_payment: [
      {id: 0, title: '支付方式不限'},
      {id: 1, title: '仅支持校园卡'},
      {id: 2, title: '可以使用支付宝'}
    ],
    drop_canteen_filter: [
      {id: 0, title: '智能排序'},
      {id: 1, title: '好评优先'},
      {id: 2, title: '距离优先'}
    ], 

    //选择菜品时dropDownMenu数据
    drop_dish_titles: ['附近', '口味','用餐风格'],
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
      {id: 4, title: '大鱼大肉'}
    ],
    drop_dish_filter: [
      {id: 0, title: '风格不限'},
      {id: 1, title: '个人独享'},
      {id: 2, title: '朋友小聚'},
      {id: 3, title: '宴请四方'}
    ], 

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
  filterSelect:function(e){
    console.log("选中第" + e.detail.index + "个标签，选中的id：" + e.detail.selectedId + "；选中的内容：" + e.detail.selectedTitle);
  },

  //点击餐厅图片跳转到指定餐厅
  switchToCanteen: function(e) {
    console.log(e)
    console.log(app.globalData)
    var canteen = e.currentTarget.dataset.canteen
    wx.navigateTo({
      url: "../canteen/canteen?canteen="+canteen
    })
  },
  //点击菜品图片跳转到指定菜品
  switchToDish: function(e) {
    console.log(e)
    console.log(app.globalData)
    var dish = e.currentTarget.dataset.dish
    console.log(dish)
    wx.navigateTo({
      url: "../dish/dish?dish="+dish
    })
  },

  onGetOpenid: function() {
    var that = this
    // 调用云函数
    wx.cloud.callFunction({
      name: 'wechat_sign',
      data: {
        avatarUrl: that.data.avatarUrl,
        gender: that.data.userInfo.gender,
        nickName: that.data.nickName
      },
      success: res => {
        console.log(res);
        if (res.result.errCode == 0) {
          that.setData({
            is_admin: res.result.data.user.is_admin
          })
          app.globalData.logged = true
          app.globalData.is_admin = res.result.data.user.is_admin
          that.getTabBar().changeFormat()
          that.data.user = res.result.data.user
          app.globalData.user = res.result.data.user
        } else {
          wx.showModal({
            title: '抱歉，出错了呢~',
            content: res.result.errMsg,
            confirmText: "我知道了",
            showCancel: false,
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      },
      fail: err => {
        console.error('[云函数] [wechat_sign] 调用失败', err)
        wx.showModal({
          title: '调用失败',
          content: '请检查云函数是否已部署',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    })
  },

  getSelectCanteens: function () {
    var that = this
    wx.request({
      url: 'http://127.0.0.1:5000/get_select_canteens',
      data: {
      },
      method: 'GET',
      success: (res) => {
        console.log("get canteens success")
        //console.log(res.data)
        that.setData({
          canteens:res.data,
        })
      }
    })
  },

  getSelectDishes: function () {
    var that = this
    wx.request({
      url: 'http://127.0.0.1:5000/get_select_dishes',
      data: {
      },
      method: 'GET',
      success: (res) => {
        console.log("get dishes success")
        //console.log(res.data)
        that.setData({
          dishes:res.data,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad: function(options) {
    var that = this
    //加载页面函数
    that.getSelectCanteens()
    that.getSelectDishes()
    //登录模块
    if (!wx.cloud) {
      wx.showModal({
        title: '初始化失败',
        content: '请使用 2.2.3 或以上的基础库以使用云能力',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return
    }
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
                console.log(res)
                that.setData({
                  nickName: res.userInfo.nickName,
                  avatarUrl: res.userInfo.avatarUrl,
                  userInfo: res.userInfo
                })
                app.globalData.userInfo = res.userInfo
                console.log('thererererer')
                console.log(that.data.userInfo)
                
              }
            })

          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else{
      return
    }

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