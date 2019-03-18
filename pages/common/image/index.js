import { xwsNavigateToPage, getLoadFile } from "../../../utils/wxApi";

Page({
  data: {
    imgUrl: "",
    showButton: false,
    showShareButton: false
  },
  onLoad(options) {
    this.data.options = options;
    if (options.title) {
      wx.setNavigationBarTitle({
        title: options.title
      });
    }
  },
  onShow() {
    this.setData({
      imgUrl: this.data.options.imgUrl,
      showButton: this.data.options.hasButton,
      showShareButton: this.data.options.share
    });
  },
  previewImages() {
    if (this.data.options.redictUrl) {
      xwsNavigateToPage(this.data.options.redictUrl);
    } else {
      const url = this.data.options.imgUrl;
      wx.previewImage({
        current: url,
        urls: [url]
      });
    }
  },
  handleToSavePoster() {
    getLoadFile(this.data.options.imgUrl).then(res => {
      setTimeout(() => {
        wx.navigateBack();
      }, 1000);
    });
  },
  handleToHome() {
    wx.switchTab({ url: "/pages/home/index" });
  }
});
