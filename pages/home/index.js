import {
  xwsNavigateToPage,
  intercepting,
  shareAppMessage
} from "../../utils/wxApi";
import {
  checkLogin,
  getHermesUserLogin,
  queryReportSubmit
} from "../../utils/api";
import homeAPI from "../../server/API/homeAPI";
import { xwsStorage } from "../../utils/index";
let scrollTimer = null;

Page({
  data: {
    //banner配置
    bannersOption: {
      showDot: false,
      swiperCurrent: 0,
      autoplay: false,
      interval: 5000,
      circular: true
    },
    //助力红包信息
    bootsDetail: {},
    //领取的红包信息
    redpacketDetail: {},
    showAssistanceDialog: false, //显示助力弹窗
    assistanceType: 1, //助力弹窗类型 1:待助力 2:已助力 3:次数没了
    showPacketDialog: false, //显示红包
    packetType: 1, //红包类型 新人2 助力1
    showDanmuku: false, //是否显示弹幕 为了清除定时器
    // withdrawTotalAmount: 0, //提现中的余额
    isLoaded: false, //是否加载过onSHow
    notShowTopIcon: true, //是否显示返回顶部按钮
    banners: [],
    feedList: [],
    recommendList: [],
    hasMore: false,
    pageNum: 1,
    isLoading: false
  },
  onLoad(option) {
    this.data.options =
      option || xwsStorage.get("hermes_readQrCode_option") || {};

    wx.showShareMenu({
      withShareTicket: true
    });

    this.getBanner();
    this.getRecommendList();

    //登录
    checkLogin().then(res => {
      //绑定用户关系
      if (res) {
        getHermesUserLogin();
      }

      //获取红包信息 判断没有跳转页面
      if (!option.activepage) {
        this.getRedpacketDetail();
        //登陆后获取资产
        if (res) {
          this.getBoostList();
        }
      }
    });
  },

  onShow() {
    const token = xwsStorage.get("hermes_token");
    if (this.data.isLoaded && token) {
      this.getBoostList();
    }
    this.data.isLoaded = true;

    intercepting(this.data.options);

    //页面hide 轮播清除了定时器 需要重新autopaly
    if (this.data.banners.length) {
      this.setData({
        "bannersOption.autoplay": true
      });
    }

    //显示弹幕
    this.setData({
      showDanmuku: true
    });
  },

  //获取banner
  getBanner() {
    homeAPI.getBannerList().then(res => {
      if (res.length) {
        this.setData({
          banners: res,
          "bannersOption.autoplay": true
        });
        console.log("getBanner res is ===>>>", res);
      }
    });
  },

  //获取活动商品
  getRecommendList() {
    const params = {
      pageNum: this.data.pageNum,
      pageSize: 10
    };
    homeAPI.getRecommend(params).then(res => {
      let feedList = [],
        recommendList = [];
      if (this.data.pageNum == 1) {
        feedList = res.list;
      } else {
        feedList = this.data.feedList;
        recommendList = this.data.recommendList.concat(res.list);
      }
      this.data.pageNum++;
      this.setData({
        feedList,
        recommendList: recommendList,
        hasMore: res.hasMore,
        isLoading: false
      });
    });
  },

  //获取资产
  getBoostList() {
    homeAPI.getBoostList().then(res => {
      this.setData({
        withdrawTotalAmount: res.withdrawTotalAmount
      });
    });
  },

  //获取红包
  getRedpacketDetail() {
    if (!this.data.options.boostCode) {
      this.getHasNewRedpacket();
    } else {
      this.getBoostDetails();
    }
  },

  //查询是否有新人红包
  getHasNewRedpacket() {
    homeAPI.getBoostIsnew().then(res => {
      //判断红包有没有开启过
      if (!res.open) {
        const redpacketDetail = {
          boostRedPacketResponeVo: {
            amount: res.newUserBoostAmount
          },
          headUrl:
            "https://imgs-1253854453.image.myqcloud.com/58248c7a8d395d44809ac9b389317a7f.png"
        };
        this.setData({
          redpacketDetail,
          showPacketDialog: true,
          packetType: 2
        });
      }
    });
  },

  //获取助力红包信息
  getBoostDetails() {
    homeAPI
      .getBoostDetails({
        boostCode: this.data.options.boostCode,
        boostId: this.data.options.boostId
      })
      .then(res => {
        //是不是我自己的助力
        if (res.isMyBoost) {
          wx.navigateTo({
            url: `/pages/home/cash/index?boostId=${res.boostId}&boostCode=${
              res.boostCode
            }`
          });
          return false;
        }
        //是否结束
        if (res.isFinish) {
          return false;
        }
        //是否助力过
        let type = 1;
        if (res.isBoost) {
          type = 2;
        }
        this.setData({
          bootsDetail: res,
          showAssistanceDialog: true,
          assistanceType: type
        });
      });
  },

  getSubmit(e) {
    queryReportSubmit(e);
  },

  //帮助助力
  handleAssistanceOk() {
    wx.showLoading();
    homeAPI
      .postBoostFriends({
        boostCode: this.data.options.boostCode,
        boostId: this.data.options.boostId
      })
      .then(res => {
        //判断有没有次数
        if (!res.hasBoostChance) {
          this.setData({
            showAssistanceDialog: true,
            assistanceType: 3
          });
        } else {
          this.setData({
            showAssistanceDialog: false,
            showPacketDialog: true,
            redpacketDetail: res,
            packetType: 1
          });
        }
      });
  },

  //自定义轮播的当前点
  swiperChange: function(e) {
    this.setData({
      "bannersOption.swiperCurrent": e.detail.current
    });
  },

  //banner点击
  handleClickBanner(e) {
    const index = e.currentTarget.dataset.index;
    const url = this.data.banners[index].url;
    if (url) {
      xwsNavigateToPage(url);
    }
  },

  //返回顶部
  handleReturnTop() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 100
    });
  },

  //提现中页面
  handleToCashIn() {
    wx.navigateTo({ url: "/pages/mine/myAsset/cashIn/index" });
  },

  //关闭助力弹窗
  handleCloseAssisDialog(data) {
    this.setData({
      showAssistanceDialog: false
    });
  },

  //关闭红包弹窗
  handleCloseRedpacketDialog() {
    this.setData({
      showPacketDialog: false
    });
  },

  onPageScroll(e) {
    if (scrollTimer) {
      clearTimeout(scrollTimer);
      scrollTimer = null;
    }
    scrollTimer = setTimeout(() => {
      this.setData({
        notShowTopIcon: e.scrollTop >= 200 ? false : true
      });
    }, 100);
  },

  //下拉到一定高度刷新数据
  onReachBottom() {
    if (!this.data.hasMore || this.data.isLoading) return;
    this.setData({
      isLoading: true
    });
    this.getRecommendList();
  },

  onPullDownRefresh() {
    this.data.pageNum = 1;
    this.getRecommendList();
    this.getBanner();
    const token = xwsStorage.get("hermes_token");
    if (token) {
      this.getBoostList();
    }
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 500);
  },

  //分享
  onShareAppMessage() {
    const params = {
      title: "边买边赚，购物不花钱",
      path: "/pages/home/index",
      imageUrl:
        "https://imgs-1253854453.image.myqcloud.com/087747d830b8472e7e07e9f052bfe1ed.jpg"
    };

    return shareAppMessage(params);
  },

  onHide() {
    this.setData({
      "bannersOption.autoplay": false,
      showDanmuku: false
    });
  },

  onUnload() {
    this.setData({
      "bannersOption.autoplay": false,
      showDanmuku: false
    });
  }
});
