Component({
    /**
     * 组件的属性列表
     */
    properties: {
        btnOneCaption: {
            type: String,
            value: '',
        },

        btnOneImageUrl: {
            type: String,
            value: '',
        },

        btnOneOpenType: {
            type: String,
            value: '',
        },

        btnTwoCaption: {
            type: String,
            value: '',
        },

        btnTwoImageUrl: {
            type: String,
            value: '',
        },

        btnTwoOpenType: {
            type: String,
            value: '',
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        // 弹窗显示控制
        isShow: false,
        animationData: {}
    },

    /**
     * 组件的方法列表
     */
    methods: {
        //隐藏弹框
        hideTipDialog() {
            this.showAnimationData(false);
        },
        //展示弹框
        showTipDialog() {
            this.showAnimationData(true);
        },

        showAnimationData: function(isShow) {

            if (!this.animation) {
                var animation = wx.createAnimation({
                    duration: 200,
                    timingFunction: "linear",
                })
                this.animation = animation
            }

            this.animation.translateY(300).step()
            this.setData({
                animationData: this.animation.export(),
                isShow: isShow,
            });

            var that = this;
            setTimeout(function() {
                that.animation.translateY(0).step()
                that.setData({
                    animationData: that.animation.export()
                })
            }, 200)
        },

        onBtnOneClick: function() {
            var eventDetail = { // detail对象，提供给事件监听函数
                    isShow: this.data.isShow,
                }
                //触发成功回调
            this.triggerEvent("btnOneClickEvent", eventDetail);
        },
        onBtnTwoClick: function() {
            var eventDetail = { // detail对象，提供给事件监听函数
                    isShow: this.data.isShow,
                }
                //触发取消回调
            this.triggerEvent("btnTwoClickEvent", eventDetail);
        },
    }
})