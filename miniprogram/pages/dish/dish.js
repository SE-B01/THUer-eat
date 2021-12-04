const app = getApp()
Page({
  data: {
    canteen_name: '',
    selected_comment: '',
    sel_user_name: '',
    sel_user_avatar: '',
    dish_img: '',
    dish_name: '',
    dish_price: 0,
    appraise_list: [],
    appraise_list_length: 0,
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
    }),
    //console.log(app.globalData.userInfo);
    wx.request({
      url: 'http://127.0.0.1:5000/add_recent_view',

      data: {
        canteen_name: this.data.canteen,
        dish_name: this.data.dish,
        user_id: app.globalData.userInfo.id
      },
      method: 'GET',
      success: (res) => {

      }
    }),
    wx.request({
      url: 'http://127.0.0.1:5000/dish/get',
      data: {
        canteen_name: this.data.canteen,
        dish_name: this.data.dish
      },
      method: 'GET',
      success: (res) => {
        //console.log(res.data.appraise_list.length)
        this.setData({
          canteen_name: res.data.canteen_name,
          selected_comment: res.data.comment,
          dish_img: res.data.img,
          dish_name: res.data.name,
          price: res.data.price,
          canteen_addr: res.data.canteen_address,
          canteen_business_hours: res.data.canteen_business_hours,
          sel_user_name: res.data.user_nickname,
          sel_user_avatar: res.data.user_avatar,
          appraise_list_length: res.data.appraise_list.length,
          appraise_list: res.data.appraise_list
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