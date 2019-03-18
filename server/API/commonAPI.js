import env from "../baseUrl";
import fetch from "../request";

function queryLogin(params) {
  let path = "";
  let pages = getCurrentPages();

  if (
    pages[pages.length - 1] &&
    pages[pages.length - 1].route != "pages/common/login/index"
  ) {
    path = pages[0].route;
  } else if (pages[pages.length - 2]) {
    path = pages[pages.length - 2].route;
  } else if (getApp().globalData && getApp().globalData.appOptions) {
    path = getApp().globalData.appOptions.path;
  }

  params = {
    ...params,
    isLoginApi: true,
    referer: path
  };
  return fetch(`${env.baseUrl}/ba037/v1/users/login`, params);
}

//冰淇淋 绑定用户关系 非授权登陆接口
function hermesUserLogin(params) {
  return fetch(`${env.baseUrl}/lg069/user/login`, params);
}

function channelSharelog(params) {
  return fetch(`${env.baseUrl}/channel/sharelog`, params);
}

function queryShareclicklog(params) {
  return fetch(`${env.baseUrl}/v1/Channel/shareClickLog`, params);
}

// *********************全局收集用户设备信息***************************

function queryDailyCheckIn(params) {
  return fetch(`${env.baseUrl}/static/daily/checkIn`, params);
}

// *********************全局收集formId接口 ***************************

function queryReportSubmit(params) {
  return fetch(`${env.baseUrl}/user/report_submit`, params);
}

// *********************全局readQrcode ***************************

function queryQrCodeChannel(params) {
  return fetch(`${env.baseUrl}/v1/qrcodeChannel/readqrcode`, params);
}

// *********************获取cos sign ***************************

function queryCosSign(params) {
  return fetch("https://api.xiangwushuo.com/upload/cosSignature", params);
}

// *********************发布版本控制***************************

function queryVersion(params) {
  return fetch(`${env.baseUrl}/lh067/version/wx/lite/query`, params);
}

export default {
  hermesUserLogin,
  queryLogin,
  channelSharelog,
  queryShareclicklog,
  queryDailyCheckIn,
  queryReportSubmit,
  queryQrCodeChannel,
  queryCosSign,
  queryVersion
};
