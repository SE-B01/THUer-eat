// pages/index/index.js

//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: "未登录",
    avatarUrl: "/images/icons/user-unlogin.png",
    userInfo: {},
    hot_words: [],
    search_word: "",
    user: {},
    is_admin: false
  },

  hotword: function(e) {
    console.log(e)
    var word = e.currentTarget.dataset.word
    this.setData({
      search_word: word
    })
    this.search()
  },

  search: function(e) {
    if (!app.globalData.logged) {
      wx.showModal({
        title: '提示',
        content: '请先登录哦~',
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
    } else if (this.data.search_word == "") {
      wx.showModal({
        title: '提示',
        content: '请输入要查询的词语~',
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
    } else {
      var that = this
      wx.navigateTo({
        url: '../search/search?search_word=' + that.data.search_word,
        success: function(res) {
          //通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', {
            search_word: that.data.search_word,
          })
        }
      })
    }
  },

  management: function() {
    if (!app.globalData.logged) {
      wx.showModal({
        title: '提示',
        content: '请先登录哦~',
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
    } else {
      wx.navigateTo({
        url: '../management/management',
      })
    }
  },

  feedback: function(e) {
    if (!app.globalData.logged) {
      wx.showModal({
        title: '提示',
        content: '请先登录哦~',
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
    } else {
      wx.navigateTo({
        url: '../feedback/feedback',
      })
    }
  },

  bindKeyInput: function(e) {
    var input = e.detail.value
    console.log("检测输入：" + input)
    this.setData({
      search_word: input,
    })
  },

  // onGetUserInfo: function(e) {
  //   if (!app.globalData.logged && e.detail.userInfo) {
  //     this.setData({
  //       userInfo: e.detail.userInfo,
  //       nickName: e.detail.userInfo.nickName,
  //       avatarUrl: e.detail.userInfo.avatarUrl,
  //     })
  //     app.globalData.userInfo = e.detail.userInfo
  //     this.onGetOpenid()
  //   }
  // },

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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
                console.log("已经调用getUserProfile-from getuserinfo")
                console.log(res)
                this.setData({
                  nickName: res.userInfo.nickName,
                  avatarUrl: res.userInfo.avatarUrl,
                  userInfo: res.userInfo
                })
                app.globalData.userInfo = res.userInfo
                console.log(this.data.userInfo)
                this.onGetOpenid()
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else if (this.data.search_word == "") {
      wx.showModal({
        title: '提示',
        content: '请输入要查询的词语~',
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
    } else {
      var that = this
      wx.navigateTo({
        url: '../search/search?search_word=' + that.data.search_word,
        success: function(res) {
          //通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', {
            search_word: that.data.search_word,
          })
        }
      })
    }

   

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          // zyx20211007
          // wx.getUserInfo({
          //   success: res => {
          //     this.setData({
          //       nickName: res.userInfo.nickName,
          //       avatarUrl: res.userInfo.avatarUrl,
          //       userInfo: res.userInfo
          //     })
          //     app.globalData.userInfo = res.userInfo
          //     this.onGetOpenid()
          //   }
          // })
          wx.getUserProfile({
            desc: '请填写你的信息',
            success: res => {
              console.log("已经调用getUserProfile")
              this.setData({
                nickName: res.userInfo.nickName,
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
              app.globalData.userInfo = res.userInfo
              this.onGetOpenid()
            }
          })
        }
      }
    })
  },
  getUserProfile(e) {
    wx.getUserProfile({
      desc: '请填写你的信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log("已经调用getUserProfile-from getuserinfo")
        console.log(res)
        this.setData({
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl,
          userInfo: res.userInfo
        })
        app.globalData.userInfo = res.userInfo
        console.log(this.data.userInfo)
        this.onGetOpenid()
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (typeof this.getTabBar === 'function' &&
    this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
      this.getTabBar().changeFormat()
    }
    var that = this
    // 调用云函数
    wx.cloud.callFunction({
      name: 'get_hot_words',
      data: {},
      success: res => {
        console.log(res);
        if (res.result.errCode == 0) {
          that.setData({
            hot_words: res.result.data.hot_words
          })
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
        console.error('[云函数] [get_hot_words] 调用失败', err)
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '快速查询近反义词',
      path: '/pages/index/index',
      success: function(res) {}
    }
  }
})