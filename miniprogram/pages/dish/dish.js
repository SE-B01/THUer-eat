Page({
  data: {
    canteen_name: '',
    selected_comment: '',
    dish_img: '',
    dish_name: '',
    dish_price: 0,
    canteen_addr: '',
    canteen_hours: '',
    cardCur: 0,
    buttonColor: {
      title: '木槿',
       name: 'mauve',
      color: '#9c26b0'
    },
    dishesInfo: {
      name: "榴莲酥",
      price: 10,
      address: "清华大学内荷花池畔荷园教职工餐厅（二层）",
      time: "11:00-19:00"
    },
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      canteen: options.canteen,
      dish: options.dish
    })
    wx.request({
      url: 'http://127.0.0.1:5000/dish/get',
      data: {
        canteen_name: this.data.canteen,
        dish_name: this.data.dish
      },
      method: 'GET',
      success: (res) => {
        console.log(res.data)
        
        this.setData({
          canteen_name: res.data.canteen_name,
          selected_comment: res.data.comment,
          dish_img: res.data.img,
          dish_name: res.data.name,
          price: res.data.price,
          canteen_addr: res.data.canteen_address,
          canteen_business_hours: res.data.canteen_business_hours
        })
      }
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  }
})