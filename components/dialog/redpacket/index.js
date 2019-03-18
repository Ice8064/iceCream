import { queryReportSubmit } from "../../../utils/api";
import homeAPI from "../../../server/API/homeAPI";
Component({
  properties: {
    pageData: {
      type: Object,
      value: {}
    },
    show: {
      type: Boolean,
      value: false
    },
    type: {
      type: String,
      value: 1 // 1助力红包 2新人红包
    }
  },
  data: {
    firstDialog: true //标识显示提现中 还是红包信息
  },
  ready: function() {},

  methods: {
    getSubmit(e) {
      queryReportSubmit(e);
    },
    handleCatch() {
      console.log("冒泡");
    },
    //新用户领取
    handleShowNewRedpackInfo() {
      wx.showLoading();
      homeAPI
        .getBoostGenerate({
          boostType: 1
        })
        .then(res => {
          const pageData = JSON.parse(JSON.stringify(this.data.pageData));
          pageData.boostRedPacketResponeVo = res;
          this.setData({
            firstDialog: false,
            pageData
          });
        });
    },
    //助力提现
    handleShowRedpackInfo() {
      this.setData({
        firstDialog: false
      });
    },
    handleCloseDialog() {
      this.triggerEvent("close");
    },
    //跳转到红包分享页面
    handleToShare() {
      this.triggerEvent("close");
      const boostId = this.data.pageData.boostRedPacketResponeVo.boostId;
      const boostCode = this.data.pageData.boostRedPacketResponeVo.boostCode;
      wx.navigateTo({
        url: `/pages/home/cash/index?boostId=${boostId}&boostCode=${boostCode}`
      });
    }
  }
});
