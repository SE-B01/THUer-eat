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
        pagePath: "/pages/index/index",
        text: "首页"
      },
      {
        selectedIconPath: "../images/icons/feedback_on.png",
        iconPath: "../images/icons/feedback.png",
        pagePath: "/pages/feedback/feedback",
        text: "反馈"
      }
    ],
    list_admin: [
      {
        selectedIconPath: "../images/icons/host_on.png",
        iconPath: "../images/icons/host.png",
        pagePath: "/pages/index/index",
        text: "首页"
      },
      {
        selectedIconPath: "../images/icons/feedback_on.png",
        iconPath: "../images/icons/feedback.png",
        pagePath: "/pages/feedback/feedback",
        text: "反馈"
      },
      {
        selectedIconPath: "../images/icons/manage_on.png",
        iconPath: "../images/icons/manage.png",
        pagePath: "/pages/management/management",
        text: "反馈处理"
      },
      {
        selectedIconPath: "../images/icons/addword_on.png",
        iconPath: "../images/icons/addword.png",
        pagePath: "/pages/addword/addword",
        text: "词库管理"
      }],
      list:[{
        selectedIconPath: "../images/icons/host_on.png",
        iconPath: "../images/icons/host.png",
        pagePath: "/pages/index/index",
        text: "首页"
      },
      {
        selectedIconPath: "../images/icons/feedback_on.png",
        iconPath: "../images/icons/feedback.png",
        pagePath: "/pages/feedback/feedback",
        text: "反馈"
      }]
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