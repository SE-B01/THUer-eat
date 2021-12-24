const db = wx.cloud.database({});
var app = getApp();
const fileManager = wx.getFileSystemManager();
Page({
  data: {
    //canteen接受其它页面传参，显示当前的餐厅
    canteen: "",
    canteen_id:"",
    apprise: [],
    starlist: ['gray', 'gray', 'gray', 'gray', 'gray'],
    latitude : 0.0, 
    longitude : 0.0,
    TabCur: 0,
    scrollLeft: 0,
    TabName: ["评价", "菜品"],
    TabNumber: [32, 20],
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
    new_canteen_payment: 0,
    payments: ["支付方式不限", "仅支持校园卡", "可以使用支付宝"],
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
    }],
    is_admin: false, 
    //模态框信息
    modalName: null,

    //新增菜品信息
    imgList: [],
    base64imgList: [],
  },

  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  showEdit(e) {
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
  // 管理员：增加菜品
  addDish(e) {
    console.log(e.detail.value)
    console.log(this.data.canteen_id)
    wx.request({
      url: 'https://'+app.globalData.IpAddress + '/dish/add',
      data: {
        name: e.detail.value.name,
        price: e.detail.value.price,
        canteen_id: this.data.canteen_id,
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
      url: "canteen?canteen=" + this.data.canteen,
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
        let len = res.tempFilePaths.length
        var i;
        let base64 = []
        for (i = 0; i < len; i++) {
          base64.push(fileManager.readFileSync(res.tempFilePaths[i], 'base64'));
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
    //console.log(app.globalData)
    that.setData({
      canteen: options.canteen
      // canteen: "听涛园"
    })
    wx.request({
      url: 'https://'+app.globalData.IpAddress + '/canteen/get',
      data: {
        name: this.data.canteen
        // name: "桃李园-一层"
      },
      method: 'GET',
      success: (res) => {
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
          canteen_id: res.data.id,
          location: res.data.location,
          business_hours: res.data.business_hours,
          starlist: res.data.starlist,
          cost: res.data.cost,
          apprise_list: res.data.ap_list,
          dish_list: res.data.dish_list,
          latitude:res.data.latitude,
          longitude:res.data.longitude,
          swiperList: image_list_,
          TabNumber: [res.data.ap_list.length, res.data.dish_list.length, 0],
          is_admin:app.globalData.userInfo.is_admin,
        })
      }
    })
  },
  onShow: function (options) {
    var that = this;
    //console.log(app.globalData)
    wx.request({
      url: 'https://'+app.globalData.IpAddress + '/canteen/get',
      data: {
        name: this.data.canteen
        // name: "桃李园-一层"
      },
      method: 'GET',
      success: (res) => {
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
          canteen_id: res.data.id,
          location: res.data.location,
          business_hours: res.data.business_hours,
          starlist: res.data.starlist,
          cost: res.data.cost,
          apprise_list: res.data.ap_list,
          dish_list: res.data.dish_list,
          latitude:res.data.latitude,
          longitude:res.data.longitude,
          swiperList: image_list_,
          TabNumber: [res.data.ap_list.length, res.data.dish_list.length, 0],
          is_admin:app.globalData.userInfo.is_admin,
        })
      }
    })
  },
  editCanteen(e){
    wx.request({
      url: 'https://'+app.globalData.IpAddress + '/canteen/edit',
      data: {
        canteen_id: this.data.canteen_id,
        name: e.detail.value.name,
        location: e.detail.value.location,
        business_hours: e.detail.value.time,
        payment: e.detail.value.payment,
        img: this.data.base64imgList
      },
      method: 'POST',
      success: (res) => {
        this.setData({
          modalName: null,
          imgList: [],
          base64imgList: [],
          new_canteen_payment: null
        })
      }
    })
    wx.reLaunch({
      url: "canteen?canteen=" + this.data.canteen,
    })
  },
  switchToComment: function(e) {
    //console.log(e.currentTarget.dataset.canteen)
    var canteen = e.currentTarget.dataset.canteen
    wx.navigateTo({
      url: "../comments/comments?canteen="+canteen
    })
  },
  switchToAppraiseDetail: function (e) {
    var appraise_id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: "../appraise/appraise?appraise_id=" + appraise_id
    })
  },
  switchToDish: function (e) {
    var dish = e.currentTarget.dataset.dish
    var canteen = e.currentTarget.dataset.canteen
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
  isCard(e) {
    this.setData({
      isCard: e.detail.value
    })
  },
  showPath(){
    // let plugin = requirePlugin('routePlan');
    // let key = 'ALFBZ-ZBXW3-F7M3H-YVUCC-SJBT3-2CBKW';  //使用在腾讯位置服务申请的key
    // let referer = 'THUer今天吃什么';   //调用插件的app的名称
    // let endPoint = JSON.stringify({  //终点
    //     'name': this.data.canteen,
    //     'latitude': this.data.latitude,
    //     'longitude': this.data.longitude
    // });
    // wx.navigateTo({
    //   url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
    // });
    wx.openLocation({
      latitude: this.data.latitude, // 纬度，范围为-90~90，负数表示南纬
      longitude: this.data.longitude, // 经度，范围为-180~180，负数表示西经
      scale: 28, // 缩放比例
      name:this.data.canteen,
      address:this.data.location
    })
  }
})