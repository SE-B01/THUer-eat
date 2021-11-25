//Component() 来注册组件，并提供组件的属性定义、内部数据和自定义方法
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    dropDownMenuTitle: {
      type: Array,
      value: ['1', '2', '3','4'],
    },
    dropDownMenuFirstData: {
      type:Array,
      value:[]
    },
   
    dropDownMenuSecondData: {
      type: Array,
      value: []
    },
    dropDownMenuThirdData: {
      type: Array,
      value: []
    },
    dropDownMenuFourthData: {
      type: Array,
      value: []
    },
  },
  data: {
    // 这里是一些组件内部数据
    firstopen: false,
    secondopen: false,
    thirdopen: false,
    fourthopen: false,
    shownavindex: '',
    dropDownMenuDataFirstRight: {},
    selectedFirst: 0,
    selectedSecond: 0,
    selectedThird: 0,
    selectedFourth: 0,
  },
  methods: {
    // 这里是自定义方法
    listfirst: function (e) {
      if (this.data.firstopen) {
        this.setData({
          firstopen: false,
          secondopen: false,
          thirdopen: false,
          fourthopen: false,
          shownavindex: 0
        })
      } else {
        this.setData({
          firstopen: true,
          thirdopen: false,
          secondopen: false,
          fourthopen: false,
          shownavindex: e.currentTarget.dataset.nav
        })
      }

    },
    listsecond: function (e) {
      if (this.data.secondopen) {
        this.setData({
          secondopen: false,
          thirdopen: false,
          firstopen: false,
          fourthopen: false,
          shownavindex: 0
        })
      } else {
        this.setData({
          secondopen: true,
          thirdopen: false,
          firstopen: false,
          fourthopen: false,
          shownavindex: e.currentTarget.dataset.nav
        })
      }
    },
    listthird: function (e) {
      if (this.data.thirdopen) {
        this.setData({
          secondopen: false,
          thirdopen: false,
          firstopen: false,
          fourthopen: false,
          shownavindex: 0
        })
      } else {
        this.setData({
          secondopen: false,
          thirdopen: true,
          fourthopen: false,
          firstopen: false,
          shownavindex: e.currentTarget.dataset.nav
        })
      }
      console.log(e.target)
    },
    listfourth: function (e) {
      if (this.data.fourthopen) {
        this.setData({
          secondopen: false,
          thirdopen: false,
          firstopen: false,
          fourthopen: false,
          shownavindex: 0
        })
      } else {
        this.setData({
          secondopen: false,
          thirdopen: false,
          firstopen: false,
          fourthopen: true,
          shownavindex: e.currentTarget.dataset.nav
        })
      }
    },
    selectFirstItem: function (e) {
      var selectedId = e.target.dataset.model.id
      var selectedTitle = e.target.dataset.model.title;
      this.closeHyFilter();
      this.setData({
        selectedFirst: selectedId
      })
      this.triggerEvent("selectedItem", { index: this.data.shownavindex, selectedId: selectedId, selectedTitle: selectedTitle })
    },
    selectSecondItem: function (e) {
      var selectedId = e.target.dataset.model.id
      var selectedTitle = e.target.dataset.model.title;
      this.closeHyFilter();
      this.setData({
        selectedSecond: selectedId
      })
      this.triggerEvent("selectedItem", { index: this.data.shownavindex, selectedId: selectedId, selectedTitle: selectedTitle })
    },
    selectThirdItem: function (e) {
      var selectedId = e.target.dataset.model.id
      var selectedTitle = e.target.dataset.model.title;
      this.closeHyFilter();
      this.setData({
        selectedThird: selectedId
      })
      this.triggerEvent("selectedItem", { index: this.data.shownavindex, selectedId: selectedId, selectedTitle: selectedTitle })
    },
    selectFourthItem: function (e) {
      var selectedId = e.target.dataset.model.id
      var selectedTitle = e.target.dataset.model.title;
      this.closeHyFilter();
      this.setData({
        selectedFourth: selectedId
      })
      this.triggerEvent("selectedItem", { index: this.data.shownavindex, selectedId: selectedId, selectedTitle: selectedTitle })
    },
    
    /**关闭筛选 */
    closeHyFilter: function () {
      if (this.data.firstopen) {
        this.setData({
          firstopen: false,
          secondopen: false,
          thirdopen: false,
          fourthopen: false,
        })
      } else if (this.data.secondopen) {
        this.setData({
          secondopen: false,
          thirdopen: false,
          firstopen: false,
          fourthopen: false,
        })
      }
      else if (this.data.thirdopen) {
        this.setData({
          secondopen: false,
          thirdopen: false,
          firstopen: false,
          fourthopen: false,
        })
      }
      else if (this.data.fourthopen) {
        this.setData({
          secondopen: false,
          thirdopen: false,
          firstopen: false,
          fourthopen: false,
        })
      }
    },
  },
  //组件生命周期函数，在组件实例进入页面节点树时执行
  attached: function () {
    // 可以在这里发起网络请求获取插件的数据
    
  },

})