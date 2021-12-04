// pages/search/search.js
//参考https://www.cnblogs.com/gygg/p/12703646.html
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
  search: function () {
    var searchtext = this.data.searchtext; //搜索框的值
    if (searchtext != "") {
      //将搜索框的值赋给历史数组
      this.data.historyArray.push(searchtext);
      var that = this
      if (that.data.TabCur == 0) {
        wx.request({
          url: 'http://127.0.0.1:5000/canteen/search',
          data: {
            text: that.data.searchtext
          },
          method: 'GET',
          success: (res) => {
            //console.log("get dishes success")
            console.log(res.data)
            that.setData({
              canteens: res.data,
            })
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
          url: 'http://127.0.0.1:5000/dish/search',
          data: {
            text: that.data.searchtext
          },
          method: 'GET',
          success: (res) => {
            //console.log("get dishes success")
            console.log(res.data)
            that.setData({
              dishes: res.data,
            })
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