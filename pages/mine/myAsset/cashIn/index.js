import { shareAppMessage } from "../../../../utils/wxApi";
import { queryReportSubmit } from "../../../../utils/api";
import { xwsStorage } from "../../../../utils/index";
import homeAPI from "../../../../server/API/homeAPI";
import mineAPI from "../../../../server/API/mineAPI";

Page({
  data: {
    isLoaded: false,
    showShare: false,
    tabs: [
      {
        name: "正在进行",
        key: 2
      },
      {
        name: "已结束",
        key: 3
      }
    ],
    tabIndex: 0,
    currentItem: {},
    bootsType: ["", "新人红包", "下单红包", "助力红包"],
    list: [],
    isAdmin: false
  },

  onShow() {
    wx.hideShareMenu();
    this.getData(this.data.list);
    const userInfo = xwsStorage.get("hermes_userInfo");
    this.setData({
      isAdmin: userInfo.isAdmin
    });
  },

  getReportSubmit(e) {
    queryReportSubmit(e);
  },

  getData() {
    wx.showLoading();
    const status = this.data.tabs[this.data.tabIndex].key;
    homeAPI.getBoostList({ status: status }).then(res => {
      this.setData({
        list: res.redPacketList,
        isLoaded: true
      });
    });
  },

  //切换tab
  handleChangeTab(e) {
    const index = e.currentTarget.dataset.index;
    if (index != this.data.tabIndex) {
      this.data.tabIndex = index;
      this.setData({
        tabIndex: index,
        isLoaded: false
      });
      this.getData();
    }
  },

  //查看红包详情
  handleToDetail(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({ url: `/pages/home/cash/index?boostId=${item.boostId}&boostCode=${item.boostCode}` });
  },

  //逛一逛
  handleToHome() {
    wx.switchTab({ url: "/pages/home/index" });
  },

  handleSharePoster() {
    const params = {
      boostId: this.data.currentItem.boostId
    };
    wx.showLoading();
    homeAPI.getBoostPoster(params).then(res => {
      this.handleShareHide();
      wx.navigateTo({ url: `/pages/common/image/index?imgUrl=${res}&title=长按保存图片&share=true` });
    });
  },

  handleShareHide() {
    this.setData({
      showShare: false
    });
  },

  //分享事件 获取分享item
  handleTouchStart(e) {
    this.handleGetItemData(e);
    this.setData({
      showShare: true
    });
  },

  handleGetItemData(e) {
    const item = e.target.dataset.item;
    this.data.currentItem = item;
  },

  onPullDownRefresh() {
    this.getData();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 500);
  },

  onShareAppMessage() {
    const shareParams = {
      title: "刚抢到的红包分你一个，帮我提现就能拿钱哦",
      path: `/pages/home/index?boostCode=${this.data.currentItem.boostCode}&boostId=${this.data.currentItem.boostId}`,
      imageUrl: "https://imgs-1253854453.image.myqcloud.com/0dd22ece8827e18a702252dd43e1271c.jpg"
    };
    return shareAppMessage(shareParams);
  }
});
