const app = getApp()

Component({
  data: {
    selected: 0,
    "color": "#a9b7b7",
    "selectedColor": "#1296db",
    list_general:[
      {
        selectedIconPath: "../images/icons/host_on.png",
        iconPath: "../images/icons/host.png",
        pagePath: "/pages/home/home",
        text: "首页"
      },
      {
        selectedIconPath: "../images/icons/feedback_on.png",
        iconPath: "../images/icons/feedback.png",
        pagePath: "/pages/map/map",
        text: "地图"
      },

      {
        selectedIconPath: "../images/icons/feedback_on.png",
        iconPath: "../images/icons/feedback.png",
        pagePath: "/pages/newmine/newmine",
        text: "我的"
      }
    ],
    list_admin: [
      {
        selectedIconPath: "../images/icons/host_on.png",
        iconPath: "../images/icons/host.png",
        pagePath: "/pages/home/home",
        text: "首页"
      },
      {
        selectedIconPath: "../images/icons/feedback_on.png",
        iconPath: "../images/icons/feedback.png",
        pagePath: "/pages/map/map",
        text: "地图"
      },

      {
        selectedIconPath: "../images/icons/feedback_on.png",
        iconPath: "../images/icons/feedback.png",
        pagePath: "/pages/newmine/newmine",
        text: "我的"
      }],
      list:[
      {
        selectedIconPath: "../images/icons/host_on.png",
        iconPath: "../images/icons/host.png",
        pagePath: "/pages/home/home",
        text: "首页"
      },
      {
        selectedIconPath: "../images/icons/feedback_on.png",
        iconPath: "../images/icons/feedback.png",
        pagePath: "/pages/map/map",
        text: "地图"
      },

      {
        selectedIconPath: "../images/icons/feedback_on.png",
        iconPath: "../images/icons/feedback.png",
        pagePath: "/pages/newmine/newmine",
        text: "我的"
      }
    ]
  },
  attached() {
  },

  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    },

    changeFormat(e) {
      if (app.globalData.is_admin){
        this.setData({
          list: this.data.list_admin
        })
      }
    }
  }
})