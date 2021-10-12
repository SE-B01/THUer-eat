// pages/management/management.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    feedbacks: []
  },
  del: function(e) {
    var that = this

    console.log(e)
    var id = e.target.id
    var idx = e.target.dataset.idx
    console.log("id:" + id + ",idx:" + idx)

    wx.showModal({
      title: '提示',
      content: '您确定要删除该条反馈吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')

          // 调用云函数
          wx.cloud.callFunction({
            name: 'remove_feedback',
            data: {
              feedback_id:id
            },
            success: res => {
              console.log(res);
              if (res.result.errCode == 0) {
                var tmp = that.data.feedbacks
                tmp.splice(idx, 1)
                console.log(tmp)

                that.setData({
                  feedbacks: tmp
                })

                wx.showModal({
                  title: '提示',
                  content: '删除成功',
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
              console.error('[云函数] [remove_feedback] 调用失败', err)
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
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
      
    })
  },
  reply: function(e) {
    var that = this

    console.log(e)
    var id = e.target.id
    var idx = e.target.dataset.idx
    var openid = e.target.dataset.openid
    console.log("id:" + id + ",idx:" + idx + ",openid:" + openid)
    wx.navigateTo({
      url: "../reply/reply?id="+ id + "&openid=" + openid
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu()
    
    var that = this
    // 调用云函数
    wx.cloud.callFunction({
      name: 'get_feedbacks',
      data: {},
      success: res => {
        console.log(res);
        if (res.result.errCode == 0) {
          that.setData({
            feedbacks: res.result.data.feedbacks
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
        console.error('[云函数] [get_feedbacks] 调用失败', err)
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
        selected: 2
      })
    this.getTabBar().changeFormat()
    }
    
    var that = this
    // 调用云函数对反馈结果刷新
    wx.cloud.callFunction({
      name: 'get_feedbacks',
      data: {},
      success: res => {
        console.log(res);
        if (res.result.errCode == 0) {
          that.setData({
            feedbacks: res.result.data.feedbacks
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
        console.error('[云函数] [get_feedbacks] 调用失败', err)
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
  onShareAppMessage: function() {

  }
})