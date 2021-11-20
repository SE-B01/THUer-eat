const db = wx.cloud.database({});
Page({
  data: {
    //canteen接受其它页面传参，显示当前的餐厅
    canteen: "",
    apprise: [],
    starlist: ['gray', 'gray', 'gray', 'gray', 'gray'],
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
    canteenInfo: [],
    location: "",
    comments: [],
    cost: 0,
    apprise_list: [],
    dish_list: [],
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
    }, {
      id: 1,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84001.jpg',
    }, {
      id: 2,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
    }, {
      id: 3,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
    }, {
      id: 4,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big25011.jpg'
    }, {
      id: 5,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21016.jpg'
    }, {
      id: 6,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg'
    }],
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
    that.setData({
      canteen: options.canteen
      // canteen: "桃李园-一层"
    })
    wx.request({
      url: 'http://127.0.0.1:5000/canteen/get',
      data: {
        name: this.data.canteen
        // name: "桃李园-一层"
      },
      method: 'GET',
      success: (res) => {
        this.setData({
          location: res.data.location,
          business_hours: res.data.business_hours,
          starlist: res.data.starlist,
          cost: res.data.cost,
          apprise_list: res.data.ap_list,
          dish_list: res.data.dish_list
        })
        //console.log(res.data)
        console.log(res.data.ap_list)
        console.log(res.data.dish_list)
      }
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
  }
})