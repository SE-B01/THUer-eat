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
    canteens: [],//食堂列表
    dishes:[],//菜品列表
  },

    //清除历史记录
    cleanhistory: function(e) {
      this.setData({
        history: false, //隐藏历史记录
        historyArray: [], //清空历史记录数组
        newArray: [],
        searchtext: "" //清空搜索框
      })
    },
    //搜索
    search: function(e) {
      var searchtext = this.data.searchtext; //搜索框的值
      var sss = true;
      if (searchtext != "") {
        //将搜索框的值赋给历史数组
        this.data.historyArray.push(searchtext);
        //模糊查询 循环查询数组中的title字段
        for (var index in this.data.canteen) {
          var num = this.data.canteen[index].title.indexOf(searchtext);
          let temp = 'canteen[' + index + '].status';
          if (num != -1) { //不匹配的不显示
            this.setData({
              [temp]: 1,
            })
            sss = false //隐藏未找到提示
          }
        }
        this.setData({
          history: false, //隐藏历史记录
          noneview: sss, //隐藏未找到提示
          find_relevant: true, //显示商品列表
          newArray: this.data.historyArray //给新历史记录数组赋值
        })
      } else {
        this.setData({
          noneview: true, //显示未找到提示
          find_relevant: false, //隐藏商品列表
          history: false, //隐藏历史记录
        })
      }
    },  //清除历史记录
  cleanhistory: function(e) {
    this.setData({
      history: false, //隐藏历史记录
      historyArray: [], //清空历史记录数组
      newArray: [],
      searchtext: "" //清空搜索框
    })
  },
  //搜索
  search: function(e) {
    var searchtext = this.data.searchtext; //搜索框的值
    var sss = true;
    if (searchtext != "") {
      //将搜索框的值赋给历史数组
      this.data.historyArray.push(searchtext);
      //模糊查询 循环查询数组中的title字段
      // for (var index in this.data.canteen) {
      //   var num = this.data.canteen[index].title.indexOf(searchtext);
      //   let temp = 'canteen[' + index + '].status';
      var that = this
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
          if (that.data.canteens.length==0) { //没有查询到餐厅
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
    },
  searchinput: function(e) {
    //当删除input的值为空时
    if (e.detail.value == "") {
      this.setData({
        history: true, //显示历史记录
        find_relevant: false //隐藏商品列表
      });
      //所有商品列表的状态改为0
      for (var index in this.data.canteen) {
        let temp = 'canteen[' + index + '].status';
        this.setData({
          [temp]: 0,
        })
      }
    }
    this.setData({
      searchtext: e.detail.value
    })
  },
  //点击历史记录赋值给搜索框
  textfz: function(e) {
    this.setData({
      searchtext: e.target.dataset.text
    })
  },

  //搜索页点击食堂|菜品选项栏
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
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