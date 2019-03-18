import { queryReportSubmit } from "../../../utils/api";
import { formatSeconds } from "../../../utils/index";
import homeAPI from "../../../server/API/homeAPI";
import { shareAppMessage } from "../../../utils/wxApi";
let timer = null;

Page({
  data: {
    isLoaded: false,
    percent: "0%",
    marginLeft: "-18rpx",
    detail: {},
    countDownTime: {},
    friends: []
  },
  onLoad(options) {
    this.options = options;
    this.getData();
  },
  getData() {
    wx.showLoading();
    homeAPI
      .getBoostDetails({
        boostCode: this.options.boostCode,
        boostId: this.options.boostId
      })
      .then(res => {
        if (res.boostType != 1) {
          this.countDown();
          timer = setInterval(() => {
            this.countDown();
          }, 100);
        }
        let percent = (parseFloat(res.reduceAmount) / parseFloat(res.amount)) * 100;
        percent = percent > 100 ? 100 : percent;
        const marginLeft = percent < 18 ? 18 : percent;
        this.setData({
          detail: res,
          isLoaded: true,
          percent: percent + "%",
          marginLeft: "-" + marginLeft + "rpx"
        });
      });
  },
  //倒计时
  countDown() {
    const countDownTime = formatSeconds(this.data.detail.restTime);
    if (!countDownTime) {
      clearInterval(timer);
      timer = null;
    }
    this.setData({
      countDownTime
    });
  },
  //form id
  getSubmit(e) {
    queryReportSubmit(e);
  },
  //回到首页
  handleToHome() {
    wx.switchTab({ url: "/pages/home/index" });
  },
  //跳转到规则
  handleToRule() {
    wx.navigateTo({
      url: "/pages/common/image/index?imgUrl=https://imgs-1253854453.image.myqcloud.com/463645fb579d6eec95711b9d4e5590d4.png"
    });
  },
  onShareAppMessage() {
    const shareParams = {
      title: "刚抢到的红包分你一个，帮我提现就能拿钱哦",
      path: `/pages/home/index?boostCode=${this.data.detail.boostCode}&boostId=${this.data.detail.boostId}`,
      imageUrl: "https://imgs-1253854453.image.myqcloud.com/0dd22ece8827e18a702252dd43e1271c.jpg"
    };
    return shareAppMessage(shareParams);
  },
  onUnload() {
    clearInterval(timer);
    timer = null;
  }
});
