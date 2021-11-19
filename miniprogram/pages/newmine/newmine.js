// pages/mine/mine.js
const app = getApp();
Page({
      data: {
        CustomBar: app.globalData.CustomBar,
        TabCur: 0,
        tabNav: ['最近浏览', '收藏', '消息'],
        feedbackFormShow: false,
        modalName: null,
        textareaAValue: ''
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
        this.setData({
          textareaAValue: '',
          modalName: null
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
          /**
           * 页面的初始数据
           */

          /**
           * 生命周期函数--监听页面加载
           */
          onLoad: function (options) {

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