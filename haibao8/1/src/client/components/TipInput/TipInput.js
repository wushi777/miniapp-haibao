Component({
  /**
   * 组件的初始数据
   */
  data: {
    // 弹窗显示控制
    isShow: false,
    Id: '',
    contentText: '',
    textMaxLength: 0,
    maxLengthTip: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //隐藏弹框
    hideTipInput() {
      this.showInput(false, 0, '', '');
    },
    //展示弹框
    showTipInput(Id,textMaxLength,contentText) {
      this.showInput(true, Id, textMaxLength, contentText);
    },

    showInput: function (isShow, Id, textMaxLength, contentText) {
      const maxLengthTip = '(' + contentText.length + '/' + textMaxLength + ')';
      this.setData({
        isShow: isShow,
        Id: Id,
        textMaxLength: textMaxLength,
        maxLengthTip: maxLengthTip,
        contentText: contentText,
      });
    },

    onClose: function() {
      this.hideTipInput();
    },

    onClear: function() {
      this.setData({
        contentText: '',
      })
    },

    onOK: function() {
      var eventDetail = { // detail对象，提供给事件监听函数
        Id: this.data.Id,
        contentText: this.data.contentText,
      }
      //触发取消回调
      this.triggerEvent("btnOKClickEvent", eventDetail);
    },

    onContentInput: function(event) {
      const maxLengthTip = '(' + event.detail.value.length + '/' + this.data.textMaxLength + ')';
      this.setData({
        contentText: event.detail.value,
        maxLengthTip: maxLengthTip,
      })
    }
  }
})