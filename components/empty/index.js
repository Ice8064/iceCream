Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    imgUrl: {
      type: String,
      value: "https://imgs-1253854453.image.myqcloud.com/51860068562922e2611e85d4c77ce61a.png"
    },
    title: {
      type: String,
      value: "还没有数据~"
    },
    button: {
      type: String,
      value: "随便逛逛"
    }
  },
  methods: {
    handleCallBack() {
      this.triggerEvent("callback");
    }
  }
});
