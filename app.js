import commonAPI from "./server/API/commonAPI";
import { getLogin, readqrcode } from "./utils/api";
import { xwsStorage, getQuerySearch } from "./utils/index";

App({
  globalData: {
    getSystemInfo: {}
  },

  onLaunch(options) {
    //获取版本号 需要走单车页面才需要
    // this.getVersion();

    //获取设备信息
    wx.getSystemInfo({
      success: res => {
        this.globalData.getSystemInfo = res;
        // 收集用户信息
        const params = { client_system_info: JSON.stringify(res) };
        // commonAPI.queryDailyCheckIn(params);
      }
    });
  },

  onShow(options) {
    // console.log("===============", options);

    //记录小程序唤起options 不存storage
    xwsStorage.set("globalOptions", options, true);

    //分享点击 关系
    this.getShareClickInfo(options);

    //小程序二维码
    if (
      options.scene == "1047" ||
      options.scene == "1048" ||
      options.scene == "1049"
    ) {
      try {
        const scene = decodeURIComponent(query.scene) || "";
        readqrcode(scene, true);
      } catch (e) {}
    }
  },

  //记录分享点击
  getShareClickInfo(options) {
    const query = options.query;
    if (query.shareId) {
      let path = "";
      if (query.activePage) {
        path = query.activePage + getQuerySearch(query);
      } else {
        path = options.path + getQuerySearch(query);
      }
      const params = {
        shareTicket: "",
        rawdata: "",
        ticket: "",
        code: "",
        encryptedData: "",
        iv: "",
        path: path,
        shareId: query.shareId,
        noLoading: true
      };
      commonAPI.queryShareclicklog(params);
    }
  },

  getVersion() {
    //不要删
    const time = new Date().getTime();
    console.log(time);

    const versionParams = {
      code: "fgvhDSAFnmsdDadeDScDacxcigySuvn"
    };
    commonAPI.queryVersion(versionParams).then(res => {
      if (res.version == "15451994143761") {
        wx.reLaunch({ url: "/pages/extra/hellobike/index" });
      }
    });
  },
  onHide() {}
});
