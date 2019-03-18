import { getUUID, xwsStorage, saveUserData } from "../utils/index";
import env from "./baseUrl";

let xwsGlobalDistinctId = xwsStorage.get("hermes_distinctId");

if (!xwsGlobalDistinctId) {
  xwsGlobalDistinctId = getUUID();
  xwsStorage.set("hermes_distinctId", xwsGlobalDistinctId);
}

const fetch = (url, body, method = "POST") => {
  return new Promise((resolve, reject) => {
    let requestToken = "";
    body = body || {};

    try {
      requestToken = body.token || xwsStorage.get("hermes_token");
    } catch (error) {}

    wx.request({
      url: url,
      data: body,
      method: method,
      header: {
        "content-type": "application/json",
        "app-id": "wxc66c526ad8fa4175",
        "X-Token": requestToken,
        "X-Force-Object": 0,
        "X-Platform": "mini-program",
        "X-app-version": "0.5.13.8",
        "xws-distinct-id": xwsGlobalDistinctId
      },
      success: res => {
        if (!body.noLoading) {
          wx.hideLoading();
        }
        if (res.statusCode < 200 || res.statusCode > 300) {
          reject(res.data || {});
        } else {
          if (res.data && !res.data.success && res.data.err) {
            let err = res.data.err;
            if (err.ec == 4002 && !body.isLoginApi) {
              xwsStorage.clear("token");
              //login 2.0以下版本会出现轮询 采用其他方式调用
              wx.login({
                success: res => {
                  if (res.code) {
                    let params = {
                      type: "miniprogram",
                      code: res.code,
                      isLoginApi: true
                    };
                    fetch(`${env.baseUrl}/ba037/v1/users/login`, params).then(
                      loginRes => {
                        if (!loginRes.needUserInfo) {
                          saveUserData(loginRes);
                        }
                        fetch(url, body).then(resp => {
                          resolve(resp);
                        });
                      }
                    );
                  }
                }
              });
              return;
            } else if (err.ec == 5002 || err.ec == 4001) {
              // todo
              wx.navigateTo({
                url: "/pages/common/login/index"
              });
              return;
            } else if (err.ec == 7001) {
              wx.reLaunch({
                url: "/pages/index/index"
              });
              return;
            } else {
              if (err.em) {
                setTimeout(() => {
                  wx.showToast({
                    title: err.em,
                    icon: "none",
                    duration: 2000
                  });
                }, 10);
              }
              reject(err.em);
              return;
            }
          }
          resolve(res.data.data || res.data);
        }
      },
      fail: error => {
        if (!body.noLoading) {
          wx.hideLoading();
        }
        reject(error);
      }
    });
  });
};

// const fetch = {
//   get: (url, params) => {
//     return buildRequest(url, params, "GET");
//   },
//   post: (url, params) => {
//     return buildRequest(url, params, "POST");
//   },
//   put: (url, params) => {
//     return buildRequest(url, params, "PUT");
//   }
// };

export default fetch;
