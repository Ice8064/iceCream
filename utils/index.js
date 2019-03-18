import xwsStorage from "./storage";
// import sa from "./analytics";

let formatNumber = n => {
  const str = n.toString();
  return str[1] ? str : `0${str}`;
};

let formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const t1 = [year, month, day].map(formatNumber).join("/");
  const t2 = [hour, minute, second].map(formatNumber).join(":");

  return `${t1} ${t2}`;
};

//24小时 倒计时
let formatSeconds = endTime => {
  const nowTime = new Date().getTime();
  let surplus = endTime - nowTime;
  let hour = "00",
    minute = "00",
    second = "00",
    ms = "0",
    secondTime = "";
  if (surplus > 0) {
    ms = parseInt((surplus % 1000) / 100);
    surplus = surplus / 1000;
    second = formatNumber(parseInt(surplus % 60));
    secondTime = parseInt(surplus / 60);
    if (secondTime < 60) {
      minute = formatNumber(secondTime);
    } else {
      minute = formatNumber(parseInt(secondTime % 60));
      hour = formatNumber(parseInt(secondTime / 60));
    }
    return {
      hour: hour,
      minute: minute,
      second: second,
      ms: ms
    };
  } else {
    return false;
  }
};

const getUUID = function() {
  let id =
    Math.random()
      .toString(36)
      .substring(5) +
    Date.now() +
    Math.floor(1000000 * Math.random()).toString();

  return id;
};

const getPageURL = function() {
  const pages = getCurrentPages();
  if (pages.length <= 0) {
    return "";
  }
  const cPage = pages[pages.length - 1];
  return cPage.route;
};

const makeURLQueryString = function(params) {
  const result = [];
  for (const k in params) {
    result.push(k + "=" + params[k]);
  }
  return result.join("&");
};

const getQueryParams = function(url) {
  var params = {};
  url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
    params[key] = value;
  });

  return params;
};

const getURLBase = function(url) {
  if (!url) {
    return "";
  }
  const index = url.indexOf("?");
  if (index <= 0) {
    return url;
  }
  return url.substring(0, index);
};

const getQuerySearch = function(params) {
  let pathSearch = "?";
  const cloneParams = JSON.parse(JSON.stringify(params));
  if (cloneParams.activePage) {
    delete cloneParams.activePage;
  }
  for (var key in cloneParams) {
    const search = key + "=" + cloneParams[key];
    pathSearch += "&" + search;
  }
  return pathSearch;
};

const saveUserData = param => {
  if (!param) {
    return;
  }

  //注册神策
  setTimeout(() => {
    // initSensor(param);
  }, 0);

  xwsStorage.set("hermes_token_time", new Date().getTime());

  if (param.userInfo) {
    xwsStorage.set("hermes_userInfo", param.userInfo);
  }

  if (param.token) {
    xwsStorage.set("hermes_token", param.token);
  }

  if (param.openId) {
    xwsStorage.set("hermes_openId", param.openId);
  }
};

const initSensor = userData => {
  // 注册公共属性，后续上报请求将会携带此属性
  if (!(userData && userData.userInfo)) {
    return;
  }
  try {
    if (userData.userInfo.user_id) {
      //sa.login(String(userData.userInfo.user_id));
      console.log(
        "userData.userInfo.user_id is===>>>",
        userData.userInfo.user_id
      );
    }
    if (userData.openId) {
      // sa.init(userData.openId);
      console.log("userData.openId is===>>>", userData.openId);
    }
  } catch (e) {
    console.log(e);
  }
};

export {
  formatSeconds,
  formatTime,
  formatNumber,
  getUUID,
  getQueryParams,
  getQuerySearch,
  getPageURL,
  makeURLQueryString,
  getURLBase,
  saveUserData,
  xwsStorage,
  initSensor
};
