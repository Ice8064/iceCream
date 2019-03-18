import { xwsNavigateToPage } from "../../../utils/wxApi";
import mineAPI from "../../../server/API/mineAPI";
Page({
  data: {
    tabIndex: 0,
    tabScrollLeft: 0,
    isLoaded: false,
    isLoading: false,
    pageNum: 1,
    pageSize: 10,
    hasMore: false,
    tabs: [
      { name: "全部", key: [] },
      { name: "待支付", key: ["WAIT_PAY"] },
      { name: "待助力", key: ["BOOST"] },
      { name: "待发货", key: ["WAIT_SEND"] },
      { name: "待收货", key: ["WAIT_CONFIRM"] },
      { name: "退款中", key: ["REFUNDING"] },
      { name: "已完成", key: ["SUCCESS"] },
      { name: "已取消", key: ["CANCEL", "TIMEOUT_CANCEL", "CLOSE"] }
    ],
    orders: []
  },
  onLoad(option) {
    this.data.options = option;
  },
  onShow() {
    this.data.pageNum = 1;
    const index = this.data.tabIndex || this.data.options.index || 0;
    this.handleTabIndex(index, true);
  },
  getData(index) {
    const orderStatus = index ? this.data.tabs[index].key : this.data.tabs[this.data.tabIndex].key;
    const params = {
      orderStatusList: orderStatus,
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize
    };
    if (this.data.pageNum == 1) {
      wx.showLoading();
    }
    mineAPI.getTradeQuery(params).then(res => {
      wx.stopPullDownRefresh();
      const orders = this.data.pageNum == 1 ? res.list : this.data.orders.concat(res.list);
      this.data.pageNum++;
      this.setData({
        orders,
        hasMore: res.hasMore,
        isLoaded: true,
        isLoading: false
      });
    });
  },
  handleChangeTab(e) {
    const index = e.target.dataset.index;
    this.handleTabIndex(index);
  },
  handleTabIndex(index, isLoad) {
    if (this.tabIndex == index && !isLoad) {
      return false;
    }
    const tabScrollLeft = this.getOffsetLeft(index);
    this.setData({
      tabIndex: index,
      tabScrollLeft: tabScrollLeft,
      isLoaded: false,
      pageNum: 1
    });
    this.getData(index);
  },
  handleToHome() {
    wx.switchTab({ url: "/pages/home/index" });
  },
  getOffsetLeft(index) {
    //判断是向左还是向右
    if (index > this.data.tabIndex > 0) {
      if (index > 1) {
        index = index >= 5 ? 5 : index;
        //判断是1个还是多个
        const len = index - 1;
        const offsetWidth = (len - 1) * 82 + 72;
        return offsetWidth;
      } else {
        return 0;
      }
    } else {
      if (index > 2) {
        index = index >= 6 ? 6 : index;
        //判断是1个还是多个
        const len = index - 2;
        const offsetWidth = (len - 1) * 82 + 72;
        return offsetWidth;
      } else {
        return 0;
      }
    }
  },
  //下拉到一定高度刷新数据
  onReachBottom() {
    if (!this.data.hasMore || this.data.isLoading) return;
    this.setData({
      isLoading: true
    });
    this.getData();
  },
  onPullDownRefresh() {
    this.data.pageNum = 1;
    this.getData();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 500);
  }
});
