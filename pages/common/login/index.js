import commonAPI from "../../../server/API/commonAPI";
import { saveUserData } from "../../../utils/index";
import { getCode, showToast } from "../../../utils/wxApi";

Page({
  data: {},
  onLoad(option) {
    console.log("onLoad");
  },
  onShow() {
    console.log("onShow");
  },
  getUserInfo(event) {
    const detail = event.detail;
    if (detail.errMsg.indexOf("getUserInfo:fail") > -1) {
      showToast("授权失败，请重新授权");
    } else {
      //授权点击确定
      getCode().then(code => {
        const params = {
          type: "miniprogram",
          encrypted: detail.encryptedData,
          iv: detail.iv,
          code: code
        };
        commonAPI.queryLogin(params).then(res => {
          saveUserData(res);
          setTimeout(() => {
            wx.navigateBack();
          }, 100);
        });
      });
    }
  }
});
