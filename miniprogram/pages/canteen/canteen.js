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
    canteenInfo: {
      name: "荷园",
      price: 25,
      grade: 3,
      address: "清华大学内荷花池畔",
      time: "11:00-19:00"
    },
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