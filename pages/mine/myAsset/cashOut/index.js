import homeAPI from "../../../../server/API/homeAPI";

Page({
  data: {
    hasMore: false,
    isLoading: false,
    isLoaded: false,
    pageNum: 1,
    list: []
  },

  onShow() {
    this.getData();
  },

  getData() {
    homeAPI.getBoostAssetFlows({ pageNum: this.data.pageNum }).then(res => {
      wx.stopPullDownRefresh();
      const list =
        this.data.pageNum == 1 ? res.list : this.data.list.concat(res.list);
      this.data.pageNum++;
      this.setData({
        list,
        hasMore: res.hasMore,
        isLoading: false,
        isLoaded: true
      });
    });
  },

  handleToHome() {
    wx.switchTab({ url: "/pages/home/index" });
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
  }
});
