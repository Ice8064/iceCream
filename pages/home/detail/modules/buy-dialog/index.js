import commonAPI from "../../../../../server/API/commonAPI";
import { showToast } from "../../../../../utils/wxApi";
import { xwsStorage } from "../../../../../utils/index";
import homeAPI from "../../../../../server/API/homeAPI";

Component({
  properties: {
    pageData: {
      type: Object,
      value: {}
    }
  },
  ready() {
    const userInfo = xwsStorage.get("hermes_userInfo");
    this.setData({
      isAdmin: userInfo.isAdmin
    });
  },
  data: {
    showDialog: false,
    quantity: 1,
    showShare: false,
    isAdmin: false
  },

  methods: {
    //获取formid
    getReportSubmit(e) {
      commonAPI.queryReportSubmit({
        actionname: "hermes.detail.index",
        form_id: e.detail.formId
      });
    },
    //加库存
    handleAdd() {
      this.setData({
        quantity: this.data.quantity + 1
      });
    },
    //减库存
    handleMinus() {
      if (this.data.quantity > 1) {
        this.setData({
          quantity: this.data.quantity - 1
        });
      } else {
        showToast("一件起售");
      }
    },
    //显示弹窗
    handleShowDialog() {
      this.setData({
        showDialog: true
      });
    },
    handleContent() {
      console.log("防止冒泡");
    },
    //关闭弹窗
    handleClose() {
      this.setData({
        showDialog: false,
        quantity: 1
      });
    },
    //提交
    handleSubmit() {
      //构建data
      const data = {};
      data.title = this.data.pageData.title;
      data.img = this.data.pageData.carouselImgList[0].url.split("?")[0];
      data.quantity = this.data.quantity;
      data.salePrice = this.data.pageData.itemSkuList[0].salePrice;
      data.earnAmount = this.data.pageData.itemSkuList[0].earnAmount;
      data.id = this.data.pageData.itemSkuList[0].id;
      this.setData({
        showDialog: false
      });
      wx.navigateTo({
        url: `/pages/home/checkout/index?data=${JSON.stringify(data)}`
      });
    },
    goToHome() {
      wx.switchTab({ url: "/pages/home/index" });
    },
    handleSharePoster() {
      const params = {
        itemId: this.data.pageData.id
      };
      wx.showLoading();
      homeAPI.getProductPoster(params).then(res => {
        this.handleShareHide();
        wx.navigateTo({ url: `/pages/common/image/index?imgUrl=${res.posterUrl}&title=长按保存图片&share=true` });
      });
    },
    handleShowShare() {
      this.setData({
        showShare: true
      });
    },
    handleShareHide() {
      this.setData({
        showShare: false
      });
    }
  }
});
