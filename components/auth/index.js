import commonAPI from "../../server/API/commonAPI";
import { saveUserData, xwsStorage } from "../../utils/index";
import { getCode } from "../../utils/wxApi";
import { getHermesUserLogin } from "../../utils/api";

Component({
  properties: {
    needLogin: {
      type: Boolean,
      value: false
    }
  },
  data: {
    showConfirmDialog: false,
    show: false
  },
  created() {
    console.log("组件created");
  },
  attached() {
    console.log("组件attached");
    this.checkLogin();
  },
  ready() {
    console.log("组件ready");
  },

  methods: {
    checkLogin() {
      const token = xwsStorage.get("hermes_token");
      if (token) {
        wx.hideLoading();
        this.triggerEvent("loginCall", true);
      } else {
        if (this.data.needLogin) {
          getCode().then(code => {
            let params = {
              type: "miniprogram",
              code: code
            };
            commonAPI
              .queryLogin(params)
              .then(res => {
                if (res.needUserInfo) {
                  this.setData({
                    show: true
                  });
                  this.triggerEvent("notLoginCall");
                } else {
                  saveUserData(res);
                  this.triggerEvent("loginCall", true);
                }
              })
              .catch(() => {
                this.setData({
                  show: true
                });
                this.triggerEvent("notLoginCall");
              });
          });
        } else {
          this.triggerEvent("notLoginCall");
          this.setData({
            show: true
          });
        }
      }
    },
    getUserInfo(event) {
      const detail = event.detail;
      if (detail.errMsg.indexOf("getUserInfo:fail") > -1) {
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
            //冰淇淋登陆
            getHermesUserLogin().then(res => {
              this.setData({
                show: false
              });
              this.triggerEvent("loginCall", false);
            });
          });
        });
      }
    }
  }
});
