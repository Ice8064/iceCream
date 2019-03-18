Page({
  data: {},
  handleToServer() {
    wx.navigateTo({
      url: `/pages/common/webview/index?url=https://mokolo.share1diantong.com/moungo/agreement-h5/hermes-server-agreement.html`
    });
  },
  handleToPrivacy() {
    wx.navigateTo({
      url: `/pages/common/webview/index?url=https://mokolo.share1diantong.com/moungo/agreement-h5/hermes-privacy-agreement.html`
    });
  }
});
