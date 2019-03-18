import commonAPI from "../server/API/commonAPI";
import { getUUID, getQueryParams, getQuerySearch, xwsStorage } from "./index";

/**
 * @params title
 * @params path
 * @params imageUrl
 * @params callBack
 */
export function shareAppMessage(shareData = {}) {
  let userInfo = xwsStorage.get("hermes_userInfo") || {};
  let shareId = getUUID();

  let path = shareData.path || "";
  let title = shareData.title || "";
  let imageUrl = shareData.imageUrl || "";

  path = /\?/g.test(path)
    ? path + "&shareId=" + shareId + "&inviteUserId=" + userInfo.userId
    : path + "?shareId=" + shareId + "&inviteUserId=" + userInfo.userId;

  const params = getQueryParams(path);
  let sharePath = "";
  if (params.activePage) {
    sharePath = params.activePage + getQuerySearch(params);
  } else {
    sharePath = path;
  }

  return {
    title,
    path,
    imageUrl,
    success: res => {
      commonAPI.channelSharelog({
        shareresponse: "",
        title: title,
        path: sharePath,
        shareId: shareId
      });
      if (typeof callBack === "function") {
        callBack(res);
      }
    }
  };
}

export function getSystemInfo() {
  return new Promise((resolve, reject) => {
    wx.getSystemInfo({
      success: res => {
        return resolve(res);
      }
    });
  });
}

/*
 * @params title 标题
 * @params duration 时间
 * @params mask 遮罩
 */
export function showToast(title, duration = 2000, mask = true) {
  wx.showToast({
    title: title,
    icon: "none",
    duration: duration,
    mask: mask
  });
}

/*确认框*/
export function showModal(data = {}) {
  const defaultData = {
    title: "提示",
    content: "这是个错误",
    showCancel: true,
    cancelText: "取消",
    cancelColor: "#000",
    confirmText: "确定",
    confirmColor: "#3CC51F",
    confirm: () => {},
    cancel: () => {}
  };
  const newData = Object.assign(defaultData, data);
  wx.showModal({
    title: newData.title,
    content: newData.content,
    showCancel: newData.showCancel,
    cancelText: newData.cancelText,
    cancelColor: newData.cancelColor,
    confirmText: newData.confirmText,
    confirmColor: newData.confirmColor,
    success: res => {
      if (res.confirm) {
        typeof newData.confirm == "function" && newData.confirm();
      } else if (res.cancel) {
        typeof newData.cancel == "function" && newData.cancel();
      }
    }
  });
}

/* 获取code */
export function getCode() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: res => {
        if (res.code) {
          return resolve(res.code);
        } else {
          return reject(res);
        }
      }
    });
  });
}

//统一跳转
export function xwsNavigateToPage(path) {
  let isSwitchTab = false;
  const paths = ["pages/home/index", "pages/mine/index"];
  for (var i = 0, len = paths.length; i < len; i++) {
    if (path.indexOf(paths[i]) > -1 && path.indexOf(paths[i]) < 3) {
      isSwitchTab = true;
    }
  }
  if (isSwitchTab) {
    wx.switchTab({ url: path });
  } else {
    wx.navigateTo({ url: path });
  }
}

//页卡跳转
export const intercepting = query => {
  if (query.activePage) {
    let pagePath = query.activePage + "?";
    delete query.activePage;
    for (var key in query) {
      const search = key + "=" + query[key];
      pagePath += "&" + search;
    }

    //setTimeout为了首页login调用完成
    setTimeout(() => {
      xwsNavigateToPage(pagePath);
    }, 200);
  }
};

export function getLoadFile(res) {
  return new Promise((resolve, reject) => {
    wx.downloadFile({
      url: res,
      success: res => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: res => {
            showToast("海报保存成功");
            return resolve();
          },
          fail: error => {
            getSetting();
          }
        });
      },
      fail: function() {
        showToast("海报保存失败");
        return reject();
      }
    });
  });
}

export function getSetting() {
  wx.getSetting({
    success(res) {
      if (!res.authSetting["scope.writePhotosAlbum"]) {
        wx.showModal({
          title: "提示",
          content: "保存图片需要打开手机图库授权，是否继续授权？",
          success: function(res) {
            if (res.confirm) {
              wx.openSetting();
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          }
        });
      }
    }
  });
}
