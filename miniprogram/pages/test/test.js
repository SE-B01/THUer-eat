// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    base64imgList: [],
  },
  save(e) {
    var len = this.data.imgList.length
    for (var i = 0; i < len; i++) {
        wx.request({
            url: this.data.imgList[i],
            responseType: 'arraybuffer', //最关键的参数，设置返回的数据格式为arraybuffer
            success: res => {
                //把arraybuffer转成base64
                let base64 = wx.arrayBufferToBase64(res.data);
                //不加上这串字符，在页面无法显示的哦
                base64 = 'data:image/jpeg;base64,' + base64
                //打印出base64字符串，可复制到网页校验一下是否是你选择的原图片呢
                this.data.base64imgList.push(base64)
                console.log(base64)
            }
        })
    }
    console.log(this.data.base64imgList)
  },
  ChooseImage() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      content: '确定要删除这张图片吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 前端 -> 后端
    wx.request({
      url: 'http://127.0.0.1:5000/appraise_test',
      data: {
        test: [1, 2, 3]
      },
      method: 'GET',
      success: (res) => {

      }
    }),
      // 后端 -> 前端
      wx.request({
        url: 'http://127.0.0.1:5000/appraise_test',
        data: {
        },
        method: 'GET',
        success: (res) => {
          console.log(res.data)
          this.setData({
            msg: res.data
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