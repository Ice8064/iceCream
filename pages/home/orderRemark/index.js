import { showToast } from "../../../utils/wxApi";
import { xwsStorage } from "../../../utils/index";
import { queryReportSubmit } from "../../../utils/api";

Page({
  data: {
    remark: ""
  },
  onLoad(option) {
    const remark = xwsStorage.get("hermes_remark");
    this.setData({
      remark
    });
  },
  onShow() {},
  //收集form id
  getSubmit(e) {
    queryReportSubmit(e);
    if (this.data.remark) {
      xwsStorage.set("hermes_remark", this.data.remark);
    } else {
      showToast("请先填写备注");
      return false;
    }
    showToast("填写成功");
    setTimeout(() => {
      wx.navigateBack();
    }, 1500);
  },
  //输入文字
  handleInput(e) {
    this.setData({
      remark: e.detail.value
    });
  }
});
