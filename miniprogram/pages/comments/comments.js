// pages/comments/comments.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        canteenName: "",
        canteen: { name: "", id: '1', dish: [["辣子鸡", false, "gray"], ["咕佬肉", false, "gray"], ["荷塘小炒", false, "gray"], ["香辣豆皮", false, "gray"], ["水煮肉", false, "gray"], ["地三鲜", false, "gray"], ["叉烧鸡腿", false, "gray"]] },
        starlist: ['gray', 'gray', 'gray', 'gray', 'gray'],
        index: null,
        imgList: [],
        // paymethod: ['仅校园卡', '校园卡及其它方式', '仅其他方式'],
        appraise: { canteen_id: '', star: 0, anonymous: false, comment: '', dish: [], cost: 0, time: null, user_id: 0, is_publish: false }
    },
    publish(e) {
        this.data.appraise.canteen_id = this.data.canteen.id
        this.data.appraise.is_publish = true
        // console.log(this.data.appraise)
        wx.request({
            url: 'http://127.0.0.1:5000/appraise/publish',
            data: {
                canteen_id: this.data.appraise.canteen_id,
                star: this.data.appraise.star,
                anonymous: this.data.appraise.anonymous,
                comment: this.data.appraise.comment,
                dish: JSON.stringify(this.data.appraise.dish),
                cost: this.data.appraise.cost,
                user_id: this.data.appraise.user_id,
                imgList: JSON.stringify(this.data.imgList),
                is_publish: this.data.appraise.is_publish
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
    save(e) {
        this.data.appraise.canteen_id = this.data.canteen.id
        this.data.appraise.is_publish = false
        // console.log(this.data.appraise)
        wx.request({
            url: 'http://127.0.0.1:5000/appraise/publish',
            data: {
                canteen_id: this.data.appraise.canteen_id,
                star: this.data.appraise.star,
                anonymous: this.data.appraise.anonymous,
                comment: this.data.appraise.comment,
                dish: JSON.stringify(this.data.appraise.dish),
                cost: this.data.appraise.cost,
                user_id: this.data.appraise.user_id,
                imgList: JSON.stringify(this.data.imgList),
                is_publish: this.data.appraise.is_publish
            },
            method: 'POST',
            success: (res) => {
                console.log(res.data)
                wx.showToast({
                    title: '保存成功',
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
    solve(e) {
        this.data.appraise.time = new Date()
        this.data.appraise.imgList = this.data.imgList
        this.data.appraise.is_publish = false
        console.log(this.data.appraise)
    },
    commentInput(e) {
        console.log(e.detail.value)
        this.setData({
            ['appraise.comment']: e.detail.value
        })
    },
    switchChange(e) {
        console.log(e.detail.value)
        this.setData({
            ['appraise.anonymous']: e.detail.value
        })
    },
    ChooseImage() {
        wx.chooseImage({
            count: 4, //默认9
            sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album'], //从相册选择
            success: (res) => {
                if (this.data.imgList.length != 0) {
                    this.setData({
                        imgList: this.data.imgList.concat(res.tempFilePaths)
                    })
                } else {
                    this.setData({
                        imgList: res.tempFilePaths
                    })
                }
            }
        });
    },
    ViewImage(e) {
        wx.previewImage({
            urls: this.data.imgList,
            current: e.currentTarget.dataset.url
        });
    },
    DelImg(e) {
        wx.showModal({
            content: '确定要删除这张图片吗？',
            cancelText: '取消',
            confirmText: '确定',
            success: res => {
                if (res.confirm) {
                    this.data.imgList.splice(e.currentTarget.dataset.index, 1);
                    this.setData({
                        imgList: this.data.imgList
                    })
                }
            }
        })
    },
    costInput(e) {
        console.log(Number(e.detail.value))
        this.setData({
            ['appraise.cost']: Number(e.detail.value)
        })
    },
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

        console.log(this.data.appraise.dish)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        that.setData({
            ['canteen.name']: options.canteen
        })
        wx.request({
            url: 'http://127.0.0.1:5000/appraise/get',
            data: {
                canteen_name: this.data.canteen.name
            },
            method: 'GET',
            success: (res) => {
                console.log(res.data)
                this.data.canteen.dish = res.data.dish
                this.data.canteen.id = res.data.id
                this.setData({
                    canteen: this.data.canteen
                })
            }
        })
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