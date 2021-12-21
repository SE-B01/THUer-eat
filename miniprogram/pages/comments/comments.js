// pages/comments/comments.js
var app = getApp();
const fileManager = wx.getFileSystemManager();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        id: null,
        canteenName: "",
        canteen: { name: "", id: '', dish: [] },
        starlist: ['gray', 'gray', 'gray', 'gray', 'gray'],
        index: null,
        imgList: [],
        base64imgList: [],
        // paymethod: ['仅校园卡', '校园卡及其它方式', '仅其他方式'],
        appraise: { star: 0, anonymous: false, comment: '', dish: [], cost: 0, time: null, user_id: 0 , cost: 0}
    },
    // 保存评论 
    save(e) {
        wx.request({
            url: 'http://127.0.0.1:5000/appraise/publish',
            data: {
                id: this.data.id,
                canteen_id: this.data.canteen.id,
                star: this.data.appraise.star,
                anonymous: this.data.appraise.anonymous,
                comment: this.data.appraise.comment,
                dish: this.data.appraise.dish,
                cost: this.data.appraise.cost,
                user_id: this.data.appraise.user_id,
                imgList: this.data.base64imgList,
                is_publish: false
            },
            method: 'POST',
            success: (res) => {
                console.log(res.data)
                wx.showToast({
                    title: '发表成功',
                    icon: 'success',
                    duration: 1500,
                    success: (res) => {
                        wx.navigateTo({
                            url: "../canteen/canteen?canteen=" + this.data.canteen.name
                        })
                    }
                })
            }
        })
    },
    // 发表评论
    publish(e) {
        wx.request({
            url: 'http://127.0.0.1:5000/appraise/publish',
            data: {
                id: this.data.id,
                canteen_id: this.data.canteen.id,
                star: this.data.appraise.star,
                anonymous: this.data.appraise.anonymous,
                comment: this.data.appraise.comment,
                dish: this.data.appraise.dish,
                cost: this.data.appraise.cost,
                user_id: this.data.appraise.user_id,
                imgList: this.data.base64imgList,
                is_publish: true
            },
            method: 'POST',
            success: (res) => {
                console.log(res.data)
                wx.showToast({
                    title: '发表成功',
                    icon: 'success',
                    duration: 1500,
                    success: (res) => {
                        wx.navigateTo({
                            url: "../canteen/canteen?canteen=" + this.data.canteen.name
                        })
                    }
                })
            }
        })
    },
    // 实时保存用户输入
    commentInput(e) {
        console.log(e.detail.value)
        this.setData({
            ['appraise.comment']: e.detail.value
        })
    },
    // 匿名选项
    switchChange(e) {
        console.log(e.detail.value)
        this.setData({
            ['appraise.anonymous']: e.detail.value
        })
    },
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
    // 输入人均消费
    costInput(e) {
        console.log(Number(e.detail.value))
        this.setData({
            ['appraise.cost']: Number(e.detail.value)
        })
    },
    // 选择星级
    changeStar1() {
        console.log(123)
        this.setData({
            ['appraise.star']: 1,
            starlist: ['yellow', 'gray', 'gray', 'gray', 'gray']
        })
    },
    changeStar2() {
        console.log(123)
        this.setData({
            ['appraise.star']: 2,
            starlist: ['yellow', 'yellow', 'gray', 'gray', 'gray']
        })
    },
    changeStar3() {
        console.log(123)
        this.setData({
            ['appraise.star']: 3,
            starlist: ['yellow', 'yellow', 'yellow', 'gray', 'gray']
        })
    },
    changeStar4() {
        console.log(123)
        this.setData({
            ['appraise.star']: 4,
            starlist: ['yellow', 'yellow', 'yellow', 'yellow', 'gray']
        })
    },
    changeStar5() {
        console.log(123)
        this.setData({
            ['appraise.star']: 5,
            starlist: ['yellow', 'yellow', 'yellow', 'yellow', 'yellow']
        })
    },
    // 增加推荐菜品
    addDish(e) {
        // console.log(e.currentTarget.dataset.index)
        let index = e.currentTarget.dataset.index
        if (!this.data.canteen.dish[index][1]) {
            this.data.canteen.dish[index][1] = true
            this.data.canteen.dish[index][2] = "purple"
            this.setData({
                ['canteen.dish']: this.data.canteen.dish
            })
            this.data.appraise.dish.push(e.currentTarget.dataset.text[0])
        } else {
            this.data.canteen.dish[index][1] = false
            this.data.canteen.dish[index][2] = "gray"
            this.setData({
                ['canteen.dish']: this.data.canteen.dish
            })
            this.data.appraise.dish.forEach(function (item, index, arr) {
                if (item === e.currentTarget.dataset.text[0]) {
                    arr.splice(index, 1);
                }
            })
        }
        // console.log(this.data.appraise.dish)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        if (options.canteen) {
            that.setData({
                ['canteen.name']: options.canteen,
                ['appraise.user_id']: app.globalData.userInfo.id
            })
            wx.request({
                url: 'http://127.0.0.1:5000/appraise/get',
                data: {
                    canteen_name: this.data.canteen.name
                },
                method: 'GET',
                success: (res) => {
                    this.data.canteen.dish = res.data.dish
                    this.data.canteen.id = res.data.id
                    this.setData({
                        canteen: this.data.canteen
                    })
                }
            })
        }
        else if(options.id){
            wx.request({
                url: 'http://127.0.0.1:5000/appraise/get_by_id',
                data: {
                    id: options.id
                },
                method: 'GET',
                success: (res) => {
                    this.data.canteen.dish = res.data.dish
                    this.data.canteen.id = res.data.id
                    this.data.canteen.name = res.data.name
                    this.data.appraise.comment  = res.data.comment
                    this.data.appraise.star = res.data.star
                    this.data.appraise.cost = res.data.cost
                    this.data.appraise.anonymous = res.data.anonymous
                    this.data.appraise.dish = res.data.chosen_dish
                    this.data.appraise.user_id= app.globalData.userInfo.id
                    console.log(res.data.anoymous)
                    for(let i = 0; i < res.data.star; i++) this.data.starlist[i] = 'yellow'
                    this.setData({
                        canteen: this.data.canteen,
                        appraise: this.data.appraise,
                        starlist: this.data.starlist,
                        id: options.id,
                        imgList: res.data.imgList,
                        base64imgList: res.data.base64imgList
                    })
                }
            })
        }

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})