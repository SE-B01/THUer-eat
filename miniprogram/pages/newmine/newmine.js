// pages/newmine/newmine.js
const app = getApp()
const fileManager = wx.getFileSystemManager();
Page({
  data: {
    TabCur: 0,
    tabNav: ['最近浏览', '收藏', '消息'],
    dishes: [],
    collection: [],
    nickname: '',
    new_nickname: '',
    new_gender: null,
    genders: ["男", "女", "其他", "保密"],
    new_is_in_school: null,
    state: ["校内", "校外"],
    new_avatarUrl: '',
    avatarUrl: '',
    imgBase64: '',
    collections: [{
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

  showModal(e) {
    this.setData({
      textareaAValue: '',
      modalName: e.currentTarget.dataset.target
    })
  },
  showModalClear(e) {
    this.setData({
      modalName: null
    })
  },
  hideModal(e) {
    console.log(this.data.imgUrl)
    this.setData({
      textareaAValue: '',
      modalName: null
    })
  },
  nameChange(e) {
    console.log(e.detail.value)
    this.setData({
      new_nickname: e.detail.value
    })
  },
  genderChange(e) {
    console.log(e);
    this.setData({
      new_gender: e.detail.value
    })
  },
  stateChange(e) {
    console.log(e);
    this.setData({
      new_is_in_school: e.detail.value
    })
  },
  ChooseImage() {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        console.log(res.tempFilePaths);
        let base64 = fileManager.readFileSync(res.tempFilePaths[0], 'base64');
        console.log(base64)
        this.setData({
          new_avatarUrl: res.tempFilePaths[0],
          imgBase64: base64
        })
      }
    });
  },
  changeUserinfo(e) {
    wx.showToast({
      title: '修改成功',
      icon: 'success',
      duration: 1500,
      success: (res) => {
        //console.log('success')
        this.setData({
          modalName: null
        })
      }
    })
    wx.request({
      url: 'http://127.0.0.1:5000/changeUserinfo',
      data: {
        id: app.globalData.userInfo.id,
        nickname: this.data.new_nickname,
        gender: this.data.new_gender,
        is_in_school: this.data.new_is_in_school,
        imgBase64: this.data.imgBase64
      },
      method: 'POST',
      success: (res) => {
        this.setData({
          nickname: this.data.new_nickname,
          avatarUrl: this.data.new_avatarUrl
        })
      }
    })
  },
  storeFeedback(e) {
  console.log(this.data.textareaAValue)
    wx.showToast({
    title: '反馈成功',
    icon: 'success',
    duration: 1500,
    success: (res) => {
      //console.log('success')
      this.setData({
        textareaAValue: ''
      })
    }
  }),
  this.setData({
    modalName: null
  }),
  wx.request({
    url: 'http://127.0.0.1:5000/new_feedback',
    data: {
      content: this.data.textareaAValue
    },
    method: 'GET',
    success: (res) => {

    }
  })
  //console.log('textareaAValue: ' + this.data.textareaAValue)
},
  textareaAInput(e) {
  this.setData({
    textareaAValue: e.detail.value
  })
  //console.log('textareaAValue: ' + this.data.textareaAValue)
},
  delete_collection(e) {
  var that = this
    console.log(e)
    console.log(e.target.id)
    wx.showModal({
    title: '提示',
    content: '确定删除吗',
    confirmText: "确定",
    showCancel: true,
    success(res) {
      if (res.confirm) {
        console.log('用户点击确定')
        wx.request({
          url: 'http://127.0.0.1:5000/collection_delete',
          data: {
            user_id: 1,
            collection_id: e.target.id
          },
          method: 'GET',
          success: (res) => {
            console.log(res.data)
          }
        })
        wx.reLaunch({
          url: 'newmine',
        })
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })

  //console.log('textareaAValue: ' + this.data.textareaAValue)
},
  /**
   * 页面的初始数据
   */

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(app.globalData.userInfo)
    that.setData({
      nickname: app.globalData.userInfo.nickname,
      new_nickname: app.globalData.userInfo.nickname,
      avatarUrl: app.globalData.userInfo.avatarUrl,
      new_avatarUrl: app.globalData.userInfo.avatarUrl,
      new_gender: app.globalData.userInfo.gender,
      new_is_in_school: app.globalData.userInfo.is_in_school
    })
    console.log('userInfo')
    console.log(app.globalData.userInfo)
    console.log('nickName')
    console.log(that.data.nickname)
    wx.request({
      url: 'http://127.0.0.1:5000/get_recent_view',
      data: {
        user_id: 1
      },
      method: 'GET',
      success: (res) => {
        //console.log(res.data)
        that.setData({
          dishes: res.data
        })
      }
    })
    wx.request({
      url: 'http://127.0.0.1:5000/get_collection',
      data: {
        user_id: 1
      },
      method: 'GET',
      success: (res) => {
        that.setData({
          collection: res.data
        })
      }
    })
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
        selected: 2
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
