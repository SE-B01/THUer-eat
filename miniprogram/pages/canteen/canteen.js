const db = wx.cloud.database({});
var app = getApp();
Page({
  data: {
    //canteen接受其它页面传参，显示当前的餐厅
    canteen: "",
    apprise: [],
    starlist: ['gray', 'gray', 'gray', 'gray', 'gray'],
    latitude : 0.0, 
    longitude : 0.0,
    TabCur: 0,
    scrollLeft: 0,
    TabName: ["评价", "菜品", "问大家"],
    TabNumber: [32, 20, 15],
    cardCur: 0,
    buttonColor: {
      title: '木槿',
      name: 'mauve',
      color: '#9c26b0'
    },
    location: "",
    comments: [],
    cost: 0,
    apprise_list: [],
    dish_list: [],
    swiperList: [],
    ColorList: [{
      title: '人较少',
      name: 'red',
      color: '#e54d42'
    },
    {
      title: '口味不错',
      name: 'orange',
      color: '#f37b1d'
    },
    {
      title: '食材新鲜',
      name: 'yellow',
      color: '#fbbd08'
    },
    {
      title: '上菜快',
      name: 'olive',
      color: '#8dc63f'
    }]
  },
  onLoad: function (options) {
    var that = this;
    console.log(app.globalData)
    that.setData({
      canteen: options.canteen
      // canteen: "听涛园"
    })
    wx.request({
      url: 'http://127.0.0.1:5000/canteen/get',
      data: {
        name: this.data.canteen
        // name: "桃李园-一层"
      },
      method: 'GET',
      success: (res) => {
        console.log(res.data.dish_list)
        let url_list = res.data.image_list.split(',')
        let image_list_ = []
        for(var i = 0; i < url_list.length; i++)
        {
          image_list_.push({
            id: i,
            type: "image",
            url: url_list[i]
          })
        }
        this.setData({
          location: res.data.location,
          business_hours: res.data.business_hours,
          starlist: res.data.starlist,
          cost: res.data.cost,
          apprise_list: res.data.ap_list,
          dish_list: res.data.dish_list,
          latitude:res.data.latitude,
          longitude:res.data.longitude,
          swiperList: image_list_,
          TabNumber: [res.data.ap_list.length, res.data.dish_list.length, 0]
        })
      }
    })
  },
  switchToComment: function(e) {
    console.log(e.currentTarget.dataset.canteen)
    var canteen = e.currentTarget.dataset.canteen
    wx.navigateTo({
      url: "../comments/comments?canteen="+canteen
    })
  },
  switchToDish: function (e) {
    var dish = e.currentTarget.dataset.dish
    var canteen = e.currentTarget.dataset.canteen
    console.log(dish)
    console.log(canteen)
    wx.navigateTo({
      url: "../dish/dish?dish=" + dish + '&canteen=' + canteen
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  showPath(){
    let plugin = requirePlugin('routePlan');
    let key = 'ALFBZ-ZBXW3-F7M3H-YVUCC-SJBT3-2CBKW';  //使用在腾讯位置服务申请的key
    let referer = 'THUer今天吃什么';   //调用插件的app的名称
    let endPoint = JSON.stringify({  //终点
        'name': this.data.canteen,
        'latitude': this.data.latitude,
        'longitude': this.data.longitude
    });
    wx.navigateTo({
        url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
    });
  }
})