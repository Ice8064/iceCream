Page({
  data: {
    asset: {}
  },
  onLoad(options) {
    if (options.data) {
      this.setData({
        asset: JSON.parse(options.data)
      });
    }
  },
  handleToCashIn() {
    wx.navigateTo({ url: "/pages/mine/myAsset/cashIn/index" });
  },
  handleToCashOut() {
    wx.navigateTo({ url: "/pages/mine/myAsset/cashOut/index" });
  }
});
