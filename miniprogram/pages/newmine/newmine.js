// pages/newmine/newmine.js
const app = getApp()
const fileManager = wx.getFileSystemManager();
Page({
  data: {
    is_admin: app.globalData.userInfo.is_admin,
    TabCur: 0,
    tabNav: ['最近浏览', '收藏', '消息','我的评论'],
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
    informations:[],
    information:[{responder_image:'',responder:'听涛园'}],
    current_id:'',
    apprise_list:[]
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
      modalName: e.currentTarget.dataset.target,
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
      url: 'http://'+app.globalData.IpAddress + '/changeUserinfo',
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
    // wx.reLaunch({
    //   url: "newmine"
    // })
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
    url: 'http://'+app.globalData.IpAddress + '/new_feedback',
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
          url: 'http://'+app.globalData.IpAddress + '/collection_delete',
          data: {
            user_id: app.globalData.userInfo.id,
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
see_feedback(e){
  var that = this
  console.log('asdsadsad')
  wx.showModal({
    title: '提示',
    content: e.target.id,
    confirmText: "确定",
    showCancel: true,

  })
},
delete_recent_view(e) {
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
          url: 'http://'+app.globalData.IpAddress + '/recent_view_delete',
          data: {
            user_id: app.globalData.userInfo.id,
            recent_view_id: e.target.id
          },
          method: 'GET',
          success: (res) => {
            console.log('recent')
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
remind(e){
  var that=this
  console.log('一小步')
  console.log(e)
  console.log(e.target.dish_cost)
  console.log(that.data.collection)
  wx.requestSubscribeMessage({
    tmplIds:["Yv59njM4WU9VKlileHqg0ceX12mJPnBoKTdLLoQ6fAM"],
    success(res){
      console.log('successfully use the template')
      wx.request({
        url: 'http://' + globalData.IpAddress +  '/remind_dish',
        data: {
          user_id: app.globalData.userInfo.id,
          dish_id: e.target.id,
          business_hours: e.target.dataset.business_hours
        },
        success: (res) => {
          console.log(res.data)
          wx.cloud.callFunction({
            // name: 'sendSubscribeMessage',
            name:'jf',
            data:{
               timedelay: res.data,
               openid:app.globalData.userInfo.id,
               dish: e.target.dataset.dish_name,
               canteen: e.target.dataset.dish_canteen
             },
             success:res=>{
               if (res.result.errCode == 0) {
                 wx.showModal({
                   title: '提示',
                   content: '反馈成功！',
                   confirmText: "我知道了",
                   showCancel: false,
                   success(res) {
                     if (res.confirm) {
                       console.log('用户点击确定')
                       wx.navigateBack({
                         delta: 1
                       })
                     } else if (res.cancel) {
                       console.log('用户点击取消')
                     }
                   }
                 })
               }
             },
             fail:err=>{
               wx.showModal({
                 title: '提示',
                 content: '该消息已回复，不能再回复',
                 confirmText: "我知道了",
                 showCancel: false,
                 success(res) {
                   if (res.confirm) {
                     console.log('用户点击确定')
                     wx.switchTab({
                       url:"../management/management"
                     })
                   } else if (res.cancel) {
                     console.log('用户点击取消')
                   }
                 }
               })
             }
 
 
           })
        }
      })
    },
    fail(res){
      console.log('fail to use the template')
      console.log(res)
    }
  })
  // wx.request({
  //   url: 'http://'+app.globalData.IpAddress+'/remind_dish',
  //   data: {
  //     user_id: app.globalData.userInfo.id,
  //     dish_id: e.target.id,
  //     business_hours: e.target.dataset.business_hours
  //   },
  //   success: (res) => {
  //     console.log(res.data)
  //   }
  // })
  // wx.request({
  //   url: 'http://'+app.globalData.IpAddress+'/getAccessToken',
  //   success: (res) => {
  //     console.log(res.data)
  //   }
  // })
},
switchToDish: function (e) {
  var dish = e.currentTarget.dataset.dish
  var canteen = e.currentTarget.dataset.canteen
  //console.log(dish)
  //console.log(canteen)
  wx.navigateTo({
    url: "../dish/dish?dish=" + dish + '&canteen=' + canteen
  })
},
sendinfo(e){
  var that = this
  subscribeMessage.send({

  })
},
to_feedbackmag(e){
  wx.navigateTo({
    url:"../feedbackmag/feedbackmag"
  })
},
delete_information(e) {
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
        console.log('用户点击确定 delete_information')
        wx.request({
          url: 'http://'+app.globalData.IpAddress + '/information_delete',
          data: {
            user_id: app.globalData.userInfo.id,
            information_id: e.target.id
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

delete_appraise(e) {
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
          url: 'http://'+app.globalData.IpAddress + '/appraise/delete',
          data: {
            id: e.target.id
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
switchToComment: function(e) {
  //console.log(e.currentTarget.dataset.canteen)
  var id = e.currentTarget.dataset.id
  wx.navigateTo({
    url: "../comments/comments?id="+id
  })
},
  /**
   * 页面的初始数据
   */

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      nickname: app.globalData.userInfo.nickname,
      new_nickname: app.globalData.userInfo.nickname,
      avatarUrl: app.globalData.userInfo.avatarUrl,
      new_avatarUrl: app.globalData.userInfo.avatarUrl,
      new_gender: app.globalData.userInfo.gender,
      new_is_in_school: app.globalData.userInfo.is_in_school,
      is_admin:app.globalData.userInfo.is_admin
    })
    wx.request({
      url: 'http://'+app.globalData.IpAddress + '/get_recent_view',
      data: {
        user_id: app.globalData.userInfo.id
      },
      method: 'GET',
      success: (res) => {
        // console.log('最近浏览')
        // console.log(res.data)
        that.setData({
          dishes: res.data
        })
      }
    })
    wx.request({
      url: 'http://'+app.globalData.IpAddress + '/get_collection',
      // url: 'http://127.0.0.1:5000/get_collection',
      data: {
        user_id: app.globalData.userInfo.id
      },
      method: 'GET',
      success: (res) => {
        that.setData({
          collection: res.data
        })
        console.log('收藏')
        console.log(res.data)
      }
    })
    wx.request({
      url: 'http://'+app.globalData.IpAddress + '/get_information',
      data: {
        user_id: app.globalData.userInfo.id
      },
      method: 'GET',
      success: (res) => {
        that.setData({
          informations: res.data
        })
        // console.log('用户消息')
        // console.log(that.data.informations)
      }
    })
    wx.request({
      url: 'http://'+app.globalData.IpAddress + '/appraise/get_by_user',
      data: {
        user_id: app.globalData.userInfo.id
      },
      method: 'GET',
      success: (res) => {
        that.setData({
          apprise_list: res.data.appraise
        })
        // console.log('用户消息')
        console.log(res.data)
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
    var that = this
    that.setData({
      nickname: app.globalData.userInfo.nickname,
      new_nickname: app.globalData.userInfo.nickname,
      avatarUrl: app.globalData.userInfo.avatarUrl,
      new_avatarUrl: app.globalData.userInfo.avatarUrl,
      new_gender: app.globalData.userInfo.gender,
      new_is_in_school: app.globalData.userInfo.is_in_school,
      is_admin:app.globalData.userInfo.is_admin
    })
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
      this.getTabBar().changeFormat()
    }
    wx.request({
      url: 'http://'+app.globalData.IpAddress + '/get_collection',
      data: {
        user_id: app.globalData.userInfo.id
      },
      method: 'GET',
      success: (res) => {
        that.setData({
          collection: res.data
        })
        console.log('收藏')
        console.log(res.data)
      }
    })
    wx.request({
      url: 'http://'+app.globalData.IpAddress + '/get_recent_view',
      data: {
        user_id: app.globalData.userInfo.id
      },
      method: 'GET',
      success: (res) => {
        // console.log('最近浏览')
        // console.log(res.data)
        that.setData({
          dishes: res.data
        })
      }
    })
    wx.request({
      url: 'http://'+app.globalData.IpAddress + '/get_information',
      data: {
        user_id: app.globalData.userInfo.id
      },
      method: 'GET',
      success: (res) => {
        that.setData({
          informations: res.data
        })
        // console.log('用户消息')
        // console.log(that.data.informations)
      }
    })
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
