import commonAPI from "../../../server/API/commonAPI";
import { saveUserData, xwsStorage } from "../../../utils/index";
import { getCode } from "../../../utils/wxApi";
import { queryReportSubmit, getHermesUserLogin } from "../../../utils/api";
/**
 * this.triggerEvent("loginCall") 授权成功的回调
 */
Component({
  data: {
    show: false
  },
  ready() {
    this.checkLogin();
  },

  methods: {
    checkLogin() {
      const token = xwsStorage.get("hermes_token");
      if (!token) {
        this.setData({
          show: true
        });
      }
    },
    getUserInfo(event) {
      const detail = event.detail;
      if (detail.errMsg.indexOf("getUserInfo:fail") > -1) {
      } else {
        //授权点击确定
        wx.showLoading();
        getCode().then(code => {
          const params = {
            type: "miniprogram",
            encrypted: detail.encryptedData,
            iv: detail.iv,
            code: code
          };
          commonAPI.queryLogin(params).then(res => {
            saveUserData(res);
            //冰淇淋登陆
            getHermesUserLogin().then(res => {
              this.setData({
                show: false
              });
              this.triggerEvent("loginCall");
            });
          });
        });
      }
    },
    getSubmit(e) {
      queryReportSubmit(e);
    },
    handleOk() {
      this.triggerEvent("loginCall");
    }
  }
});
