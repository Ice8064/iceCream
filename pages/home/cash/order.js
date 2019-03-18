import { queryReportSubmit } from "../../../utils/api";
import { formatSeconds, xwsStorage } from "../../../utils/index";
import { shareAppMessage } from "../../../utils/wxApi";

let timer = null;

Page({
  data: {
    show: true,
    countDownTime: {},
    detail: {},
    headUrl: ""
  },
  onLoad(options) {
    const detail = JSON.parse(options.detail);
    const headUrl = xwsStorage.get("hermes_userInfo").userAvatar;
    this.setData({
      detail: detail,
      headUrl
    });
    this.countDown(detail.boostOverTime);
    timer = setInterval(() => {
      this.countDown(detail.boostOverTime);
    }, 100);
  },
  getSubmit(e) {
    queryReportSubmit(e);
  },
  countDown(restTime) {
    const countDownTime = formatSeconds(restTime);
    this.setData({
      countDownTime
    });
  },
  handleCloseDialog() {
    this.setData({
      show: false
    });
  },
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
