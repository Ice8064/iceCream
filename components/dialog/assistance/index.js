import { queryReportSubmit } from "../../../utils/api";
Component({
  properties: {
    pageData: {
      type: Object,
      value: {},
      observer(newVal, oldVal, changedPath) {
        if (newVal.amount) {
          let percent = (parseFloat(newVal.reduceAmount) / parseFloat(newVal.amount)) * 100;
          percent = percent > 100 ? 100 : percent;
          const marginLeft = percent < 8 ? 8 : percent;
          this.setData({
            percent: percent + "%",
            marginLeft: marginLeft
          });
        }
      }
    },
    show: {
      type: Boolean,
      value: false
    },
    type: {
      type: String,
      value: 1 //1助力 2已助力 3助力次数没了
    }
  },
  data: {
    percent: "0%",
    marginLeft: "-18rpx"
  },

  methods: {
    //帮助助力
    handleHelpCash() {
      this.triggerEvent("ok");
    },
    //关闭弹窗
    handleCloseDialog() {
      this.triggerEvent("close");
    },
    handleCatch() {
      console.log("冒泡");
    },
    getSubmit(e) {
      queryReportSubmit(e);
    }
  }
});
