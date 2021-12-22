const app = getApp()
const fileManager = wx.getFileSystemManager();
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

     //模态框信息
     modalName: null,

     //修改菜品信息
     is_admin:false,
     imgList: [],
     base64imgList: [],
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  showModalClear(e) {
    this.setData({
      modalName: null
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  // 管理员：修改菜品
  editDish(e) {
    console.log(e.detail.value)
    console.log(this.data.dish_id)
    wx.request({
      url: 'http://'+app.globalData.IpAddress + '/dish/edit',
      data: {
        id: this.data.dish_id,
        name: e.detail.value.name,
        price: e.detail.value.price,
        img: this.data.base64imgList
      },
      method: 'POST',
      success: (res) => {
        this.setData({
          modalName: null,
          imgList: [],
          base64imgList: [],
        })
      }
    })
    wx.reLaunch({
      url: "dish?dish=" + this.data.dish + '&canteen=' + this.data.canteen,
    })
  },
  //管理员：上传图片
  // 上传图片
  ChooseImage() {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        console.log(res.tempFilePaths);
        let len = res.tempFilePaths.length
        var i;
        let base64 = []
        for (i = 0; i < len; i++) {
          base64.push(fileManager.readFileSync(res.tempFilePaths[i], 'base64'));
          console.log(base64[i]);
        }

        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths),
            base64imgList: this.data.base64imgList.concat(base64)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths,
            base64imgList: base64
          })
        }
      }
    });
  },
  // 浏览缩略图
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  // 删除图片
  DelImg(e) {
    wx.showModal({
      content: '确定要删除这张图片吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.data.base64imgList.splice(e.currentTarget.dataset.index, 1)
          this.setData({
            imgList: this.data.imgList,
            base64imgList: this.data.base64imgList
          })
        }
      }
    })
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      canteen: options.canteen,
      dish: options.dish,
      is_admin: app.globalData.userInfo.is_admin,
    }),
    //console.log(app.globalData.userInfo);
    wx.request({
      url: 'http://'+app.globalData.IpAddress + '/add_recent_view',

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
      url: 'http://'+app.globalData.IpAddress + '/dish/get',
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
          appraise_list: res.data.appraise_list,
          dish_id: res.data.id
        })
      }
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  collect(){
    console.log(app.globalData.userInfo.id)
    console.log(this.data.canteen_name)
    console.log(this.data.dish_name)
    wx.showToast({
      title: '收藏成功',
      icon: 'success',
      duration: 1500,
      success: (res) => {
      }
    })
    wx.request({
      url: 'http://'+app.globalData.IpAddress + '/add_collection',
      data: {
        user_id: app.globalData.userInfo.id,
        canteen_name: this.data.canteen_name,
        dish_name: this.data.dish_name
      },
      method: 'GET',
      success: (res) => {
       
      }
    })
  }
})