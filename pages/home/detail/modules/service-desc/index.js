Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    //获取formid
    handleClose(e) {
      this.triggerEvent("close");
    },
    handleContainer() {
      console.log("为了防止冒泡");
    }
  }
});
