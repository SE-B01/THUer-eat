var app = getApp()
Page({
  data: {
    awardsList: {},
    animationData: {},
    btnDisabled: '',
    lotteryList: [],
    canteen: '',
    recommend: [],
    showRecommend: true
  },
  gotoList: function() {
    wx.redirectTo({
      url: '../list/list'
    })
  },
  getLottery: function () {
    var that = this


    // 获取奖品配置
    var awardsConfig = app.awardsConfig,
        runNum = 5
    var awardsNumber = awardsConfig.awards.length
    var awardIndex = Math.floor(Math.random() * awardsNumber);
    if (awardIndex < 2) awardsConfig.chance = false
    //console.log(awardIndex)

    // 初始化 rotate
  /*  var animationInit = wx.createAnimation({
      duration: 10
    })
    this.animationInit = animationInit;
    animationInit.rotate(0).step()
    this.setData({
      animationData: animationInit.export(),
      btnDisabled: 'disabled'
    })*/

    // 旋转抽奖
    app.runDegs = app.runDegs || 0
    console.log('deg', app.runDegs)
    app.runDegs = app.runDegs + (360 - app.runDegs % 360) + (360 * runNum - awardIndex * (360 / awardsNumber))
    //console.log('deg', app.runDegs)

    var animationRun = wx.createAnimation({
      duration: 4000,
      timingFunction: 'ease'
    })
    that.animationRun = animationRun
    animationRun.rotate(app.runDegs).step()
    that.setData({
      animationData: animationRun.export(),
      //btnDisabled: 'disabled'
    })

     // 记录奖品
    var winAwards = wx.getStorageSync('winAwards') || {data:[]}
    //console.log(winAwards)
    that.data.lotteryList.push(awardsConfig.awards[awardIndex].name)
    if(that.data.lotteryList.length > 5) {
      that.data.lotteryList.shift();
    };
    //console.log(that.data.lotteryList)
    winAwards.data.push(awardsConfig.awards[awardIndex].name)
    wx.setStorageSync('winAwards', winAwards)

    // 中奖提示
    setTimeout(function() {
      //console.log(app.globalData.userInfo
      wx.showModal({
        title: '决定了！',
        content: '今天吃' + (awardsConfig.awards[awardIndex].name),
        showCancel: false
      })
      if (awardsConfig.chance) {
        that.setData({
          canteen: (awardsConfig.awards[awardIndex].name),
          btnDisabled: '',
          showRecommend: false
        },
          wx.request({
            url: 'https://'+app.globalData.IpAddress + '/recommend_dish',
            data: {
              user_id: app.globalData.userInfo.id,
              canteen_name: (awardsConfig.awards[awardIndex].name)
            },
            method: 'GET',
            success: (res) => {
             console.log(res.data),
             that.setData({
               recommend: res.data.split(',')
             })
            }
          })
        )
      }
    }, 4000);

    

    /*wx.request({
      url: '../../data/getLottery.json',
      data: {},
      header: {
          'Content-Type': 'application/json'
      },
      success: function(data) {
        console.log(data)
      },
      fail: function(error) {
        console.log(error)
        wx.showModal({
          title: '抱歉',
          content: '网络异常，请重试',
          showCancel: false
        })
      }
    })*/
  },
  onReady: function (e) {

    var that = this;

    // getAwardsConfig
    app.awardsConfig = {
      chance: true,
      awards:[
        {'index': 0, 'name': '观畴园'},
        {'index': 1, 'name': '紫荆园'},
        {'index': 2, 'name': '桃李园'},
        {'index': 3, 'name': '听涛园'},
        {'index': 4, 'name': '清芬园'},
        {'index': 5, 'name': '荷园'},
        {'index': 6, 'name': '芝兰园'},
        {'index': 7, 'name': '玉树园'},
        {'index': 8, 'name': '澜园'},
        {'index': 9, 'name': '寓园'},
      ]
    }
    
    // wx.setStorageSync('awardsConfig', JSON.stringify(awardsConfig))
    

    // 绘制转盘
    var awardsConfig = app.awardsConfig.awards,
        len = awardsConfig.length,
        rotateDeg = 360 / len / 2 + 90,
        html = [],
        turnNum = 1 / len  // 文字旋转 turn 值
    that.setData({
      btnDisabled: app.awardsConfig.chance ? '' : 'disabled'  
    })
    var ctx = wx.createContext()
    for (var i = 0; i < len; i++) {
      // 保存当前状态
      ctx.save();
      // 开始一条新路径
      ctx.beginPath();
      // 位移到圆心，下面需要围绕圆心旋转
      ctx.translate(150, 150);
      // 从(0, 0)坐标开始定义一条新的子路径
      ctx.moveTo(0, 0);
      // 旋转弧度,需将角度转换为弧度,使用 degrees * Math.PI/180 公式进行计算。
      ctx.rotate((360 / len * i - rotateDeg) * Math.PI/180);
      // 绘制圆弧
      ctx.arc(0, 0, 150, 0,  2 * Math.PI / len, false);

      // 颜色间隔
      if (i % 2 == 0) {
          ctx.setFillStyle('rgba(255,184,32,.1)');
      }else{
          ctx.setFillStyle('rgba(255,203,63,.1)');
      }

      // 填充扇形
      ctx.fill();
      // 绘制边框
      ctx.setLineWidth(0.5);
      ctx.setStrokeStyle('rgba(228,55,14,.1)');
      ctx.stroke();

      // 恢复前一个状态
      ctx.restore();

      // 奖项列表
      html.push({turn: i * turnNum + 'turn', lineTurn: i * turnNum + turnNum / 2 + 'turn', award: awardsConfig[i].name});    
    }
    that.setData({
        awardsList: html
      });

    // 对 canvas 支持度太差，换种方式实现
    /*wx.drawCanvas({
      canvasId: 'lotteryCanvas',
      actions: ctx.getActions()
    })*/

  }

})