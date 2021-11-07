const app = getApp()

Component({
  data: {
    selected: 0,
    "color": "#a9b7b7",
    "selectedColor": "#1296db",
    list_general:[
      {
        selectedIconPath: "../images/host_on.png",
        iconPath: "../images/host.png",
        pagePath: "/pages/index/index",
        text: "首页"
      },
      {
        selectedIconPath: "../images/feedback_on.png",
        iconPath: "../images/feedback.png",
        pagePath: "/pages/feedback/feedback",
        text: "反馈"
      }
    ],
    list_admin: [
      {
        selectedIconPath: "../images/host_on.png",
        iconPath: "../images/host.png",
        pagePath: "/pages/index/index",
        text: "首页"
      },
      {
        selectedIconPath: "../images/feedback_on.png",
        iconPath: "../images/feedback.png",
        pagePath: "/pages/feedback/feedback",
        text: "反馈"
      },
      {
        selectedIconPath: "../images/manage_on.png",
        iconPath: "../images/manage.png",
        pagePath: "/pages/management/management",
        text: "反馈处理"
      },
      {
        selectedIconPath: "../images/addword_on.png",
        iconPath: "../images/addword.png",
        pagePath: "/pages/addword/addword",
        text: "词库管理"
      }],
      list:[{
        selectedIconPath: "../images/host_on.png",
        iconPath: "../images/host.png",
        pagePath: "/pages/index/index",
        text: "首页"
      },
      {
        selectedIconPath: "../images/feedback_on.png",
        iconPath: "../images/feedback.png",
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