// pages/home/index.js
const app = getApp()
const fileManager = wx.getFileSystemManager();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //TabCur：校园食堂/发现好菜互相跳转

    loadProgress:0,
    //用户信息
    nickName: "未登录",
    is_admin: false,
    userInfo:'',
    openid: "",
    newuser:"0",
    
    //选择菜品时dropDownMenu数据

    //模态框信息

  },
  // loading框
  isLoading (e) {
    this.setData({
      isLoad: e.detail.value
    })
  },
  loadModal () {
    this.setData({
      loadModal: true
    })
    setTimeout(()=> {
      this.setData({
        loadModal: false
      })
    }, 20000)
  },
  loadProgress(){
    this.setData({
      loadProgress: this.data.loadProgress+3
    })
    if (this.data.loadProgress<100){
      setTimeout(() => {
        this.loadProgress();
      }, 100)
    }else{
      this.setData({
        loadProgress: 0
      })
    }
  },


  getOpenid: function () {
    //获得当前登录用户的openid
    var that = this
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://'+app.globalData.IpAddress + '/getUserId',
            data: {
              code: res.code,
              appid: "wxf14afe0de0f6f4e7"
              //这里没有传appsecret，放在后端了
            },
            success: function(res){

              that.setData({
                openid: res.data[0].openid,
                newuser: res.data[1]
              })
              app.globalData.openid = that.data.openid
              if (that.data.newuser==0){
                that.getUserNameAvatar()
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
        console.log('加载完成')
        app.globalData.showbar=true
        wx.hideLoading()
        that.showModalClear()
        wx.switchTab({
        url: "../home/home"
        })
      },
      fail:err=>{
        console.log('加载完成')
        that.showModalClear()
      },
    });
  },
  searchUserNameAvatar: function () {
    var that = this
    //console.log('searching')
    wx.request({
      url: 'https://'+app.globalData.IpAddress + '/searchUserinfo',
      data: {
        openid: that.data.openid
      },
      method: 'GET',
      success: (res) => {
        //console.log("get user info")
        console.log(res.data)
        that.setData({
          userInfo: res.data[0],
          is_admin: res.data[0].is_admin
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
      url: 'https://'+app.globalData.IpAddress + '/insertUserinfo',
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
      url: 'https://'+app.globalData.IpAddress + '/get_select_canteens',
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
      url: 'https://'+app.globalData.IpAddress + '/get_select_dishes',
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

  // 管理员相关：增加食堂/菜品的模态框弹出

  showModalClear(e) {
    this.setData({
      modalName: null,
      loadModal: false
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  // 管理员：修改餐厅信息
  paymentChange(e) {
    this.setData({
      new_canteen_payment: e.detail.value
    })
  },

  getLocation: function () {
    var _this = this
    wx.chooseLocation({
      success: function (res) {
        _this.setData({
          new_canteen_latitude: res.latitude,
          new_canteen_longitude: res.longitude
        })
      },
      complete(r) {
        console.log(r)
      }
    })
  },

  //管理员：上传图片
  // 上传图片
  ChooseImage() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        console.log(res.tempFilePaths);
        let len = res.tempFilePaths.length
        var i;
        let base64 = []
        for (i = 0; i < len; i++) {
          base64.push(fileManager.readFileSync(res.tempFilePaths[i], 'base64'));
          console.log(base64[i]);
        }

        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths),
            base64imgList: this.data.base64imgList.concat(base64)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths,
            base64imgList: base64
          })
        }
      }
    });
  },
  // 浏览缩略图
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  // 删除图片
  DelImg(e) {
    wx.showModal({
      content: '确定要删除这张图片吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.data.base64imgList.splice(e.currentTarget.dataset.index, 1)
          this.setData({
            imgList: this.data.imgList,
            base64imgList: this.data.base64imgList
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    
    var that = this
    //加载页面函数
    //that.loadModal()
    wx.showLoading({
      title: '加载中',
      mask:true
    })
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