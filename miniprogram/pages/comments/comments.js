// pages/comments/comments.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        canteen: { name: "桃李园-二层", dish: ["辣子鸡", "咕佬肉", "荷塘小炒", "香辣豆皮", "水煮肉", "地三鲜", "叉烧鸡腿"] },
        starlist: ['gray', 'gray', 'gray', 'gray', 'gray'],
        index: null,
        imgList: [],
        // paymethod: ['仅校园卡', '校园卡及其它方式', '仅其他方式'],
        appraise: { star: 0, anonymous: true, comment: '', dish: [], cost: 0, time: '', user_id: 0 }
    },
    commentInput(e) {
        console.log(Number(e.detail.value))
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
        console.log(e.currentTarget.dataset.text)
        this.data.appraise.dish.push(e.currentTarget.dataset.text),
            this.setData({
                ['appraise.comment']: this.data.appraise.comment + "#" + e.currentTarget.dataset.text + "#",
            })
        console.log(this.data.appraise.dish)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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