//app.js

App({
  onLaunch: function() {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'cloud1-2g5zuxobb38cbb3e',
        traceUser: true,
      })
    }

    this.globalData = {
      showbar:true,
      logged: false,
      is_admin: false,
      userInfo: {},
      user: {},
      //IpAddress:'119.29.108.250:5000'
      IpAddress:'127.0.0.1:5000'
    }
  }
})
