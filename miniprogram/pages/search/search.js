// pages/search/search.js
//参考https://www.cnblogs.com/gygg/p/12703646.html
const app = getApp()
Page({
  data: {
    TabCur: 0, //当前选择食堂|菜品
    scrollLeft: 0,
    
    searchtext: "", //搜索框的值
    history: false, //显示历史记录
    noneview: false, //显示未找到提示
    find_relevant: false, //显示商品列表
    historyArray: [], //历史记录数组,
    newArray: [], //添加历史记录数组
    canteens: [], //食堂列表
    dishes: [], //菜品列表
  },
  cleanhistory: function (e) {
    this.setData({
      history: false, //隐藏历史记录
      historyArray: [], //清空历史记录数组
      newArray: [],
      searchtext: "" //清空搜索框
    })
  },
  //搜索
  search: function (get_new_lines) {
    var get_new_lines = get_new_lines||false;    
    var searchtext = this.data.searchtext; //搜索框的值
    var that = this
    if (searchtext != "") {
      //将搜索框的值赋给历史数组
      this.data.historyArray.push(searchtext);
      wx.showLoading({
        title: "加载中",
        mask: true
      })
      if (that.data.TabCur == 0) {
        wx.request({
          url: 'http://'+app.globalData.IpAddress + '/canteen/search',
          data: {
            get_new_lines: get_new_lines,
            now_lines: that.data.canteens.length,
            text: that.data.searchtext
          },
          method: 'GET',
          success: (res) => {
            wx.hideLoading()
            if (get_new_lines){
              if (res.data.length == 0){
                wx.showToast({
                  title: '没有更多餐厅啦',
                  icon: 'success',
                  duration: 1000
                 })
              }
              else{
                this.setData({
                  canteens: this.data.canteens.concat(res.data),
                })
              }
            }
            else{
              that.setData({
                canteens: res.data,
              })
            }
            if (that.data.canteens.length == 0) { //没有查询到餐厅
              this.setData({
                noneview: true, //显示未找到提示
                find_relevant: false, //隐藏商品列表
                history: false, //隐藏历史记录
              })
            } else {
              this.setData({
                history: false, //隐藏历史记录
                noneview: false, //隐藏未找到提示
                find_relevant: true, //显示商品列表
                newArray: this.data.historyArray //给新历史记录数组赋值
              })
            }
          }
        })
      } else {
        wx.request({
          url: 'http://'+app.globalData.IpAddress + '/dish/search',
          data: {
            get_new_lines: get_new_lines,
            now_lines: that.data.dishes.length,
            text: that.data.searchtext
          },
          method: 'GET',
          success: (res) => {
            wx.hideLoading()
            if (get_new_lines){
              if (res.data.length == 0){
                wx.showToast({
                  title: '没有更多菜品啦',
                  icon: 'success',
                  duration: 1000
                 })
              }
              else{
                that.setData({
                  dishes: this.data.dishes.concat(res.data),
                })
              }
            }
            else{
              that.setData({
                dishes: res.data,
              })
            }
            if (that.data.dishes.length == 0) { //没有查询到餐厅
              this.setData({
                noneview: true, //显示未找到提示
                find_relevant: false, //隐藏商品列表
                history: false, //隐藏历史记录
              })
            } else {
              this.setData({
                history: false, //隐藏历史记录
                noneview: false, //隐藏未找到提示
                find_relevant: true, //显示商品列表
                newArray: this.data.historyArray //给新历史记录数组赋值
              })
            }
          }
        })
      }
    }
  },
  searchinput: function (e) {
    //当删除input的值为空时
    if (e.detail.value == "") {
      this.setData({
        history: true, //显示历史记录
        find_relevant: false //隐藏商品列表
      });
      //所有商品列表的状态改为0
    }
    this.setData({
      searchtext: e.detail.value
    })
  },
  //点击历史记录赋值给搜索框
  textfz: function (e) {
    this.setData({
      searchtext: e.target.dataset.text
    })
  },

  //搜索页点击食堂|菜品选项栏
  tabSelect(e) {
    if (this.data.TabCur != e.currentTarget.dataset.id){
      this.setData({
        TabCur: e.currentTarget.dataset.id,
        scrollLeft: (e.currentTarget.dataset.id - 1) * 60
      })
      this.search()
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.searchtext.length != 0){
      that.setData({
        searchtext: options.searchtext
      })
      that.search()
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
    this.search(true)

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})