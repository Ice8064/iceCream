import commonAPI from "../server/API/commonAPI";
import homeAPI from "../server/API/homeAPI";
import { getCode, showToast, xwsNavigateToPage } from "./wxApi";
import { saveUserData, xwsStorage, initSensor, getUUID, getQueryParams } from "./index";

/* 授权登陆 */
export function getLogin() {
  return new Promise((resolve, reject) => {
    getCode().then(code => {
      let params = {
        type: "miniprogram",
        code: code
      };

      commonAPI.queryLogin(params).then(res => {
        if (!res.needUserInfo) {
          saveUserData(res);
        }
        return resolve(res);
      });
    });
  });
}

//hermes login
export function getHermesUserLogin() {
  const globalOptions = xwsStorage.get("globalOptions");
  const params = {
    boostId: globalOptions.query.boostId,
    boostCode: globalOptions.query.boostCode
  };
  return commonAPI.hermesUserLogin(params);
}

/* check login */
export function checkLogin() {
  return new Promise((resolve, reject) => {
    const token = xwsStorage.get("hermes_token");

    const tokenTime = xwsStorage.get("hermes_token_time") || 0;
    const nowTime = new Date().getTime();
    const needLogin = nowTime - tokenTime > 24 * 60 * 60 * 1000;

    if (token && !needLogin) {
      const userData = {
        userInfo: xwsStorage.get("hermes_userInfo"),
        openId: xwsStorage.get("hermes_openId")
      };
      initSensor(userData);

      return resolve(true);
    } else {
      getLogin().then(res => {
        if (res.needUserInfo) {
          return resolve(false);
        } else {
          return resolve(true);
        }
      });
    }
  });
}

/*
 *支付
 * @params changeAjaxStatus 改变ajaxStatus
 * @params fail 任何接口失败都回调
 * @params paySuccess 支付成功回调
 */
export function orderPay(params = {}) {
  const queryParams = {
    tradeIds: params.tradeIds
  };
  homeAPI
    .getPayCreate(queryParams)
    .then(res => {
      typeof params.changeAjaxStatus == "function" && params.changeAjaxStatus();
      requestPayment(params, res);
    })
    .catch(d => {
      typeof params.changeAjaxStatus == "function" && params.changeAjaxStatus();
      typeof params.fail == "function" && params.fail();
    });
}

/*
 *唤起微信支付
 */
function requestPayment(params, data) {
  wx.requestPayment({
    timeStamp: data.timeStamp,
    nonceStr: data.nonceStr,
    package: data.packageValue,
    signType: "MD5",
    paySign: data.paySign,
    success(res) {
      wx.showLoading();
      //查询是否支付
      const queryParams = {
        tradeId: params.tradeIds
      };
      homeAPI
        .getPayQuery(queryParams)
        .then(res => {
          typeof params.paySuccess == "function" && params.paySuccess(res);
        })
        .catch(d => {
          typeof params.fail == "function" && params.fail();
        });
    },
    fail(res) {
      typeof params.fail == "function" && params.fail();
    }
  });
}

//获取form id
export function queryReportSubmit(e) {
  commonAPI.queryReportSubmit({
    actionname: "form id",
    form_id: e.detail.formId,
    noLoading: true
  });
}

export function readqrcode(q, isMinprogram) {
  if (!q) {
    return false;
  }
  let getQrCodeChannel = null;
  if (!isMinprogram) {
    getQrCodeChannel = commonAPI.queryQrCodeChannel({
      qrcode: q
    });
  } else {
    getQrCodeChannel = commonAPI.queryQrCodeChannel({
      scene: q
    });
  }

  getQrCodeChannel.then(response => {
    if (response.url) {
      if (response.url.indexof("pages/home/index") > -1) {
        xwsStorage.set("hermes_readQrCode_option", getQueryParams(response.url));
        wx.reLaunch({ url: "/pages/home/index" });
      } else {
        xwsNavigateToPage(response.url);
      }
    }
  });
}

/* 获取cos sign*/
export function uploadCosSignature() {
  let uploadCosRes = "";
  uploadCosRes = xwsStorage.get("hermas_cosRes");
  if (uploadCosRes) {
    const expired = parseInt(uploadCosRes.expired) * 1000;
    const nowTime = new Date().getTime();
    // 超过半小时就默认过期
    if (expired - nowTime > 30 * 60 * 1000) {
      uploadCosRes = {
        data: uploadCosRes
      };
    } else {
      uploadCosRes = "";
    }
  }

  if (uploadCosRes) {
    return new Promise((resolve, reject) => {
      return resolve(uploadCosRes);
    });
  } else {
    return commonAPI.queryCosSign();
  }
}

// updateFile
export function uploadImageFile(filePath) {
  return new Promise((resolve, reject) => {
    uploadCosSignature()
      .then(cosRes => {
        // 缓存signature
        const cosResData = cosRes.data;
        xwsStorage.set("hermas_cosRes", cosResData);

        const Region = "sh";
        const APPID = "1255606258";
        const BUCKET_NAME = "static";
        const fileName = getUUID();
        const cosUrl = "https://" + Region + ".file.myqcloud.com/files/v2/" + APPID + "/" + BUCKET_NAME + "/publish/";

        wx.uploadFile({
          url: cosUrl + fileName,
          filePath: filePath,
          name: "filecontent",
          header: { Authorization: cosRes.data.signature },
          formData: {
            op: "upload"
          },
          success: res => {
            if (res.statusCode != 200) {
              return resolve("");
            }
            const data = JSON.parse(res.data);
            let url = "";
            if (data.code === 0) {
              if (data && data.data.source_url) {
                url = data.data.source_url.replace(
                  "http://static-1255606258.cossh.myqcloud.com",
                  "https://static-cdn.xiangwushuo.com"
                );
              }
            }
            return resolve(url);
          },
          fail: error => {
            reject(error);
          }
        });
      })
      .catch(res => {
        return resolve("");
      });
  });
}

//上传视频
export function uploadVideoFile(filePaths) {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: "https://api.xiangwushuo.com/aa039/upload/video",
      filePath: filePaths,
      name: "file",
      formData: {
        action: "upload"
      },
      success: res => {
        const data = JSON.parse(res.data);
        if (data.code === 404) {
          data.url = "";
          return resolve(data.url || "");
        } else {
          const url = data.cos_data.data.source_url;
          return resolve(url || "");
        }
      },
      fail: error => {
        reject(error);
      }
    });
  });
}
