// pages/search/search.js

//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    search_word: "",
    similar_words: [],
    isBlank: false
  },

  search: function(e) {
    var that = this
    // 调用云函数
    wx.cloud.callFunction({
      name: 'query_similar_words',
      data: {
        query_word: that.data.search_word,
        query_type: 1
      },
      success: res => {
        console.log(res);
        if (res.result.errCode == 0) {
          that.setData({
            isBlank: false,
            similar_words: res.result.data.word.similar_words
          })
        } else {
          if (res.result.errCode == 3) {
            that.setData({
              isBlank: true
            })
          }
          that.setData({
            similar_words: []
          })
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
        console.error('[云函数] [query_similar_words] 调用失败', err)
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

  loveClick: function(e) {
    var that = this
    console.log(e)
    var id = e.target.id
    var idx = e.target.dataset.idx
    console.log("id:" + id + ",idx:" + idx)
    if (this.data.similar_words[idx].isClick) {
      wx.showModal({
        title: '提示',
        content: '您已经点过赞辣，不能更赞~',
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
      // 调用云函数
      wx.cloud.callFunction({
        name: 'add_words_correlation',
        data: {
          relation_id: id
        },
        success: res => {
          console.log(res);
          if (res.result.errCode == 0) {
            var new_relation = res.result.data.relation
            new_relation.isClick = 1
            var tmp_similar_words = "similar_words[" + idx + "]"
            that.setData({
              [tmp_similar_words]: new_relation
            })

            wx.showModal({
              title: '恭喜',
              content: '点赞成功',
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
          console.error('[云函数] [add_words_correlation] 调用失败', err)
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
    }
  },

  feedback: function(e) {
    wx.navigateTo({
      url: '../feedback/feedback',
    })
  },

  bindKeyInput: function(e) {
    var input = e.detail.value
    console.log("检测输入：" + input)
    this.setData({
      search_word: input,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    console.log(options)
    // console.log(eventChannel)
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      console.log(data)
      that.setData({
        search_word: data.search_word
      })

      if (data.search_word != "" || data.search_word != undefined) {
        // 调用云函数
        wx.cloud.callFunction({
          name: 'query_similar_words',
          data: {
            query_word: data.search_word,
            query_type: 1
          },
          success: res => {
            console.log(res);
            if (res.result.errCode == 0) {
              that.setData({
                similar_words: res.result.data.word.similar_words
              })
            } else {
              if (res.result.errCode == 3) {
                that.setData({
                  isBlank: true
                })
              }
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
            console.error('[云函数] [query_similar_words] 调用失败', err)
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
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: app.globalData.userInfo.nickName + '向您推荐了词典',
      path: '/pages/index/index',
      success: function(res) {}
    }
  }
})