import { queryReportSubmit, orderPay } from "../../../utils/api";
import mineAPI from "../../../server/API/mineAPI";
import { showModal, showToast } from "../../../utils/wxApi";
import { formatSeconds, xwsStorage } from "../../../utils/index";
let timer = null;

Page({
  data: {
    ajaxStatus: false,
    showBoostDetail: false,
    orderStatus: {
      "1": { name: "待支付", icon: "https://imgs-1253854453.image.myqcloud.com/7aff9fb6b84ba1b01eee7a21e4254428.png" },
      "2": { name: "待发货", icon: "https://imgs-1253854453.image.myqcloud.com/6fd88ccad7c8449bc23c42690c36ceb7.png " },
      3: { name: "待收货", icon: "https://imgs-1253854453.image.myqcloud.com/5a22b44411686fc1bfc0852c57691ee2.png" },
      4: { name: "已完成", icon: "https://imgs-1253854453.image.myqcloud.com/86f7d59141fdafe7adadba2af909dfd9.png" },
      5: { name: "已完成", icon: "https://imgs-1253854453.image.myqcloud.com/86f7d59141fdafe7adadba2af909dfd9.png" },
      6: { name: "已取消", icon: "https://imgs-1253854453.image.myqcloud.com/630bd304de0d2432666d4bb87c9ced08.png " },
      8: { name: "已取消", icon: "https://imgs-1253854453.image.myqcloud.com/630bd304de0d2432666d4bb87c9ced08.png" },
      9: { name: "交易关闭", icon: "https://imgs-1253854453.image.myqcloud.com/630bd304de0d2432666d4bb87c9ced08.png" }
    },
    boostStatus: {
      2: "正在提现",
      3: "提现成功",
      4: "提现过期"
    },
    processDetail: {
      processDataList: []
    },
    detail: {},
    userInfo: {},
    overTime: false
  },

  onLoad(options) {
    this.data.options = options;
  },
  onShow() {
    if (this.data.options.tradeId) {
      this.getTradeDetail(this.data.options.tradeId);
    } else {
      showModal({
        content: "暂时没有找到您的订单，请重试",
        showCancel: false,
        confirm() {
          wx.navigateBack();
        }
      });
    }

    const userInfo = xwsStorage.get("hermes_userInfo");
    this.setData({
      userInfo
    });
  },
  //获取formid
  getSubmit(e) {
    queryReportSubmit(e);
  },

  //获取详情
  getTradeDetail(tradeId) {
    clearInterval(timer);
    timer = null;

    const params = {
      tradeId: tradeId
    };
    mineAPI.getTradeDetail(params).then(res => {
      this.setData({
        detail: res,
        showBoostDetail:
          res.tradeInfo.orderInfoVoList[0].status > 1 &&
          res.tradeInfo.orderInfoVoList[0].status < 6 &&
          (res.boostWithdrawVo && res.boostWithdrawVo.boostId)
      });
      if (res.tradeInfo.orderInfoVoList[0].status == 1) {
        this.countDown(res.tradeInfo.overTime);
        timer = setInterval(() => {
          this.countDown(res.tradeInfo.overTime);
        }, 1000);
      }
      if (res.tradeInfo.orderInfoVoList[0].logisticsCompanyId) {
        this.getOrderShipping(res.tradeInfo.orderInfoVoList[0].orderId);
      }
    });
  },

  //获取物流
  getOrderShipping(orderId) {
    const params = {
      orderId: orderId
    };
    mineAPI.getOrderShipping(params).then(res => {
      this.setData({
        processDetail: res
      });
    });
  },

  countDown(overTime) {
    const time = formatSeconds(overTime);
    if (time) {
      this.setData({
        overTime: time.hour + ":" + time.minute + ":" + time.second
      });
    } else {
      clearInterval(timer);
      timer = null;
      this.data.detail.tradeInfo.orderInfoVoList[0].status = 6;
      this.setData({
        detail: this.data.detail
      });
    }
  },

  //助力详情
  handleToAssistance() {
    wx.navigateTo({
      url: `/pages/home/cash/index?boostId=${this.data.detail.boostWithdrawVo.boostId}&boostCode=${
        this.data.detail.boostWithdrawVo.boostCode
      }`
    });
  },

  //退款
  handleRefund(e) {
    const item = e.target.dataset.item;
    wx.navigateTo({
      url: `/pages/mine/orderRefund/index?orderId=${item.orderId}&applyAmount=${this.data.detail.tradeInfo.payableFee}&rowNo=${
        item.rowNo
      }`
    });
  },

  //取消退款
  handleCancelRefund(e) {
    const that = this;
    const item = e.target.dataset.item;
    showModal({
      content: "您确定取消退款吗？",
      confirm() {
        mineAPI
          .getOrderRefundCancel({
            refundId: item.refundId
          })
          .then(res => {
            showToast("取消退款成功");
            that.getTradeDetail(that.data.detail.tradeInfo.tradeId);
          });
      }
    });
  },

  //去支付
  handleToPay() {
    if (this.data.ajaxStatus) {
      return;
    }
    wx.showLoading();
    this.data.ajaxStatus = true;
    orderPay({
      tradeIds: this.data.detail.tradeInfo.tradeId,
      changeAjaxStatus: () => {
        this.data.ajaxStatus = false;
      },
      paySuccess: res => {
        this.data.detail.tradeInfo.orderInfoVoList[0].status = 2;
        this.setData({
          detail: this.data.detail
        });
        wx.navigateTo({ url: `/pages/home/cash/order?detail=${JSON.stringify(res)}` });
      }
    });
  },

  //确认收货
  handleOrderConfirm() {
    const that = this;
    showModal({
      content: "您确定订单到货了吗？",
      confirm() {
        const params = {
          orderId: that.data.detail.tradeInfo.orderInfoVoList[0].orderId
        };
        mineAPI.getOrderConfirm(params).then(res => {
          showToast("收货成功");
          that.getTradeDetail(that.data.detail.tradeInfo.tradeId);
        });
      }
    });
  },

  //取消订单
  handleCancel() {
    const that = this;
    const params = {
      tradeId: this.data.detail.tradeInfo.tradeId
    };
    showModal({
      content: "您确定取消此订单吗？",
      confirm() {
        mineAPI.getTradeCancel(params).then(res => {
          showToast("取消成功");
          that.getTradeDetail(that.data.detail.tradeInfo.tradeId);
        });
      }
    });
  },

  //查看商品详情
  handleToProductDetail() {
    wx.navigateTo({
      url: `/pages/home/detail/index?itemId=${this.data.detail.tradeInfo.orderInfoVoList[0].orderItemList[0].itemId}`
    });
  },

  //查看其它宝贝
  handleToHome() {
    wx.switchTab({ url: "/pages/home/index" });
  },

  //复制
  handleSetClip() {
    wx.setClipboardData({
      data: this.data.detail.tradeInfo.tradeId + "",
      success(res) {
        showToast("复制成功", 1000);
      }
    });
  },
  onPullDownRefresh() {
    this.getTradeDetail(this.data.options.tradeId);
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 500);
  },
  onUnload() {
    clearInterval(timer);
    timer = null;
  }
});
