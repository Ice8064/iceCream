// const sensors = require("../vendor/sensorsdata.min.js");
// const LOGIN_USER_INFO_KEY = "hermes_userInfo";

// const getPageURL = function() {
//   const pages = getCurrentPages();
//   if (pages.length <= 0) {
//     return "";
//   }
//   const cPage = pages[pages.length - 1];
//   return cPage.route;
// };

// /**
//  * 封装神策小程序埋点 SDK
//  */
// class Analytics {
//   constructor() {
//     this.openId = "";
//     this.userId = "";
//   }

//   /**
//    * init SDK with wechat open ID
//    * @param {string} openId wechat open ID
//    */
//   init(openId) {
//     this.openId = openId;
//     sensors.registerApp({
//       wxappNew: true
//     });

//     sensors.registerApp({
//       userOpenId: openId
//     });

//     sensors.setOpenid(this.openId);
//     setTimeout(() => {
//       sensors.init();
//     }, 3000);
//   }

//   /**
//    * SDK login with user id
//    * @param {string} userId xiangwushuo user's userId
//    */
//   login(userId) {
//     try {
//       sensors.login(userId);
//       sensors.registerApp({
//         userId: userId
//       });
//     } catch (err) {
//       // ignore sa login error
//     }
//   }

//   /**
//    * set user profile being tracked.
//    * @param {Object} params user profile parameters
//    * @param {string} params.userRealName user real name
//    * @param {string} params.userName user name
//    * @param {string} params.userId user ID
//    * @param {string} params.scene scene
//    * @param {string} params.visitSource user source
//    */
//   setProfile(params) {
//     sensors.setProfile(...params);
//   }

//   /**
//    * tracking mini program view screen event.
//    * @param {Object} params MP view screen parameters
//    * @param {string} title current page title
//    */
//   mpViewScreen(params) {
//     const { title } = params;
//     const url = getPageURL();
//     this.trackWithSuffix("mpViewScreen", {
//       userIdNew: this.getUserId(),
//       userOpenIdNew: this.openId,
//       $url: url,
//       $title: title
//     });
//   }

//   /**
//    * reporting app start event
//    * @param {Object} params tracking app start parameters
//    * @param {string} params.startSource source of user
//    * @param {string} params.query params of user source
//    * @param {boolean} params.wxIsFirstDay first time visit?
//    * @param {boolean} params.wxIsFirstTime first start?
//    */
//   wxAppStart(params) {
//     const { startSource, wxIsFirstDay, wxIsFirstTime, query } = params;
//     this.trackWithSuffix("wxAppStart", {
//       userId: this.getUserId(),
//       wxIsFirstDay,
//       wxIsFirstTime,
//       startSource,
//       query
//     });
//   }

//   /**
//    * report user share event
//    * @param {Object} params object of params
//    * @param {string} params.path URL of shared page
//    * @param {string} title title of shared page
//    */
//   share(params) {
//     const { title, path } = params;
//     this.trackWithSuffix("share", {
//       userId: this.getUserId(),
//       sharePageURLNew: path,
//       sharePageNameNew: title
//     });
//   }

//   /**
//    * reporting commodity info
//    * @param {Object} params report params object
//    * @param {string} params.id commodity ID
//    * @param {string} params.name commodity name
//    * @param {string} params.price commodity price
//    * @param {string} params.storeId
//    */
//   commodityDetail(params) {
//     const { id, name, price, storeId } = params;
//     this.trackWithSuffix("commodityDetail", {
//       userId: this.getUserId(),
//       commodityIdNew: id ? id + "" : "无",
//       commodityNameNew: name,
//       pricePerCommodityNew: price,
//       userStoreId: storeId
//     });
//   }

//   /**
//    * reporting click event
//    * @param {Object} params click event params to report
//    * @param {string} params.type banner，页卡，索引词，个性化推荐
//    * @param {string} params.currentURL current URL 首页/签到页等url
//    * @param {string} params.currentPage which module was clicked on the page, 如：首页/签到页
//    * @param {string} params.targetURL 跳转 URL 地址
//    * @param {string} params.ranking 运营位序号
//    * @param {string} params.content 运营位内容： 活动名称，索引词，个性化，页卡，金刚位名称推荐商品等, 暂定和 type 相同
//    */
//   clickOperationPositions(params) {
//     this.trackWithSuffix("clickDetail", {
//       userId: this.getUserId(),
//       ...params
//     });
//   }

//   /**
//    * reporting click event
//    * @param {Object} params click event params to report
//    * @param {string} params.eventName 事件名称
//    */
//   customEvent(params) {
//     const eventName = params.eventName;
//     delete params.eventName;
//     this.trackWithSuffix(eventName, {
//       userId: this.getUserId(),
//       ...params
//     });
//   }

//   /**
//    *
//    * @param {Object} params search parameters
//    * @param {string} params.keyword search keyword
//    * @param {boolean} params.hasResult search result is empty or not
//    * @param {boolean} params.isHistory search keyword in search history already
//    * @param {boolean} params.isRecommend search keyword was recommend by system or not
//    */
//   search(params) {
//     const { keyword, hasResult, isHistory, isRecommend, keyWordType, hashtagName, hashtagId } = params;
//     this.trackWithSuffix("search", {
//       userId: this.getUserId(),
//       keyWord: keyword,
//       hasResult,
//       isHistory,
//       isRecommend,
//       key_word_type: keyWordType,
//       hashtag_name: hashtagName,
//       hashtag_id: hashtagId
//     });
//   }

//   /**
//    * reporting authorization event
//    * @param {Object} params mini program authorization with wechat
//    * @param {string} params.page page that require authorization
//    * @param {string} params.timestamp time that require authorization
//    */
//   authorized(params) {
//     const { page, timestamp } = params;
//     this.trackWithSuffix("authorized", {
//       authorizedPageNew: page,
//       authorizedTimeNew: timestamp
//     });
//   }

//   /**
//    * Retrieve user ID
//    * @return {string} user ID
//    */
//   getUserId() {
//     if (!this.userInfo) {
//       try {
//         this.userInfo = wx.getStorageSync(LOGIN_USER_INFO_KEY);
//       } catch (err) {
//         // ignore error
//       }
//     }

//     if (this.userInfo && this.userInfo.userId) {
//       return `${this.userInfo.userId}`;
//     }
//     return "-1";
//   }

//   /**
//    * wrap event name with suffix.
//    *
//    * @param {string} evt  event name to track
//    * @param {Object} params params to report
//    * @param {string suffix event suffix, 'New' by default}
//    */
//   trackWithSuffix(evt, params, suffix = "New") {
//     let newEvent;
//     if (suffix) {
//       newEvent = evt + suffix;
//     } else {
//       newEvent = evt;
//     }
//     return sensors.track(newEvent, params);
//   }
// }

// export default new Analytics();
