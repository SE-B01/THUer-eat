const db = wx.cloud.database({});
Page({
  data: {
    TabCur: 0,
    scrollLeft:0,
    TabName: ["评价","菜品","问大家"],
    TabNumber: [32, 20, 15],
    cardCur: 0,
    buttonColor: {
      title: '木槿',
       name: 'mauve',
      color: '#9c26b0'
    },
    canteenInfo: [],
    comments: [],
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
  onLoad() {
    var that = this;
    db.collection('canteen').get({
      success: res =>{
          this.setData({
            canteenInfo: res.data
          })
          //console.log(res.data);
          //console.log(this);
      }
    });
    db.collection('appraise_canteen').where({
      "canteen_id": '859059a561909a1505ad6b675e098532'
    })
    .get({
      success: function(res) {
        console.log(res.data)
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
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
  }
})