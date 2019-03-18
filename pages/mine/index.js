import { xwsNavigateToPage } from "../../utils/wxApi";
import { xwsStorage } from "../../utils/index";
import homeAPI from "../../server/API/homeAPI";
import mineAPI from "../../server/API/mineAPI";

Page({
  data: {
    showAuth: false, //是否要显示授权
    // flowers: 0,
    userInfo: {
      userAvatar:
        "https://imgs-1253854453.image.myqcloud.com/58248c7a8d395d44809ac9b389317a7f.png",
      userName: "登录/注册",
      credit: "-"
    },
    //我的资产
    asset: {
      curentBalance: "0",
      totalAmount: "0",
      withdrawTotalAmount: "0"
    },
    orderStatus: [
      {
        icon:
          "https://imgs-1253854453.image.myqcloud.com/523ea09239888dac0ab3bf2fe4dac3ea.png",
        name: "待支付",
        path: "/pages/mine/orderList/index?index=1"
      },
      {
        icon:
          "https://imgs-1253854453.image.myqcloud.com/543a3158591562d89f14c9cbc217a31e.png",
        name: "待助力",
        path: "/pages/mine/orderList/index?index=2"
      },
      {
        icon:
          "https://imgs-1253854453.image.myqcloud.com/ddfe6ea3108e9588e15bc3a716e36c22.png",
        name: "待发货",
        path: "/pages/mine/orderList/index?index=3"
      },
      {
        icon:
          "https://imgs-1253854453.image.myqcloud.com/1595088601b5cd80feae4dde03e26248.png",
        name: "待收货",
        path: "/pages/mine/orderList/index?index=4"
      },
      {
        icon:
          "https://imgs-1253854453.image.myqcloud.com/2c9b74f5b4417e185b0f546a54cf7d5c.png",
        name: "退款中",
        path: "/pages/mine/orderList/index?index=5"
      }
    ],
    tools: [
      {
        icon:
          "https://imgs-1253854453.image.myqcloud.com/c17b67efda7e6dda881bc374787a392a.png",
        name: "收货地址",
        path: "/pages/mine/address/index"
      },
      {
        icon:
          "https://imgs-1253854453.image.myqcloud.com/838715c431b144b81779a15f724064a4.png",
        name: "平台规则",
        path: "/pages/mine/agreement/index"
      }
    ]
  },

  onShow() {
    //判断是否授权 放在onShow是为了授权组件能重新渲染
    const token = xwsStorage.get("hermes_token");
    if (token) {
      this.loginCall();
    } else {
      this.setData({
        showAuth: true
      });
    }
  },

  //获取我的资产
  getBoostList() {
    homeAPI.getBoostList().then(res => {
      this.setData({
        asset: res
      });
    });
  },

  //授权登陆回调
  loginCall() {
    this.getUserInfo();
    this.getBoostList();
  },

  getUserInfo() {
    const userInfo = xwsStorage.get("hermes_userInfo");
    this.setData({
      userInfo: userInfo
    });
    mineAPI.getMine().then(res => {
      this.setData({
        // flowers: res.itemcount.flowers
      });
    });
  },

  //跳转订单状态
  handleGoPage(e) {
    const item = e.target.dataset.item;
    xwsNavigateToPage(item.path);
  },

  //订单列表
  handleGoList() {
    wx.navigateTo({ url: "/pages/mine/orderList/index" });
  },

  //我的资产
  handleToAsset() {
    const params = {
      curentBalance: this.data.asset.curentBalance,
      totalAmount: this.data.asset.totalAmount,
      withdrawTotalAmount: this.data.asset.withdrawTotalAmount
    };
    wx.navigateTo({
      url: `/pages/mine/myAsset/index?data=${JSON.stringify(params)}`
    });
  },

  onPullDownRefresh() {
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 500);
  },

  onHide() {
    this.setData({
      showAuth: false
    });
  }
});
