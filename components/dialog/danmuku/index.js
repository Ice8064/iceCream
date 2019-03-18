import homeAPI from "../../../server/API/homeAPI";
let timer = null;
Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer(newVal, oldVal, changedPath) {
        if (!newVal) {
          clearInterval(timer);
          timer = null;
        } else {
          this.getData();
        }
      }
    }
  },
  data: {
    isAnimation: false,
    quee: {},
    queeIndex: 0,
    marqueeList: []
  },
  methods: {
    getData() {
      homeAPI.getDanmakuList().then(res => {
        this.data.marqueeList = res;
        if (res.length) {
          this.animation();
          this.setTimeoutFunc();
        }
      });
    },
    animation() {
      if (this.data.marqueeList.length > 0) {
        const quee = this.data.marqueeList[this.data.queeIndex];
        this.setData({
          isAnimation: false,
          quee: quee
        });
        setTimeout(() => {
          this.setData({
            isAnimation: true
          });
        }, 10);
      }
    },
    setTimeoutFunc() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      timer = setTimeout(() => {
        if (this.data.queeIndex < this.data.marqueeList.length - 1) {
          this.data.queeIndex++;
        } else {
          this.data.queeIndex = 0;
        }
        this.animation();
        this.setTimeoutFunc();
      }, 4000);
    }
  }
});
