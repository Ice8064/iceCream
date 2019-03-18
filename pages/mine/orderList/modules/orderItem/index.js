import { formatSeconds, xwsStorage } from "../../../../../utils/index";
import { showToast, showModal } from "../../../../../utils/wxApi";
import { queryReportSubmit, orderPay } from "../../../../../utils/api";
import mineAPI from "../../../../../server/API/mineAPI";
//注：第一版UI没有设计为不同商户 同一个订单 后端接口设计了 所以前端取值没有做遍历直接取得数组第一个
let timer = null;
Component({
  properties: {
    pageData: {
      type: Object,
      value: {},
      observer(newVal, oldVal, changedPath) {
        if (newVal.boostOverTime) {
          this.countDown();
          timer = setInterval(() => {
            this.countDown();
          }, 1000);
        }
      }
    },
    index: {
      type: String,
      value: 0
    }
  },
  data: {
    ajaxStatus: false,
    userInfo: {},
    time: false,
    orderStatus: {
      1: "待支付",
      2: "待发货",
      3: "待收货",
      4: "已完成",
      5: "已完成",
      6: "已取消",
      8: "已取消",
      9: "已关闭",
      11: "助力中"
    }
  },
  ready() {
    const userInfo = xwsStorage.get("hermes_userInfo");
    this.setData({
      userInfo
    });
  },
  detached() {
    clearInterval(timer);
    timer = null;
  },
  methods: {
    getSubmit(e) {
      queryReportSubmit(e);
    },
    countDown() {
      const time = formatSeconds(this.data.pageData.boostOverTime);
      if (time) {
        this.setData({
          time: time.hour + ":" + time.minute + ":" + time.second
        });
      } else {
        clearInterval(timer);
        timer = null;
        this.setData({
          time: false
        });
      }
    },
    //详情
    goToDetail() {
      wx.navigateTo({ url: `/pages/mine/orderDetail/index?tradeId=${this.data.pageData.tradeId}` });
    },
    //助力
    handleAssistance() {
      wx.navigateTo({
        url: `/pages/home/cash/index?boostId=${this.data.pageData.boostId}&boostCode=${this.data.pageData.boostCode}`
      });
    },
    //确定支付
    handleOrderPay() {
      if (this.data.ajaxStatus) {
        return;
      }
      wx.showLoading();
      this.data.ajaxStatus = true;
      orderPay({
        tradeIds: this.data.pageData.tradeId,
        changeAjaxStatus: () => {
          this.data.ajaxStatus = false;
        },
        paySuccess: res => {
          this.data.pageData.orderInfoVoList[0].status = 2;
          this.setData({
            pageData: this.data.pageData
          });
          wx.navigateTo({ url: `/pages/home/cash/order?detail=${JSON.stringify(res)}` });
        }
      });
    },
    //退款
    handleRefund(e) {
      const orderId = this.data.pageData.orderInfoVoList[0].orderId;
      wx.navigateTo({ url: `/pages/mine/orderRefund/index?orderId=${orderId}&applyAmount=${this.data.pageData.payableFee}` });
    },
    //确认收货
    handleOrderConfirm() {
      const that = this;
      showModal({
        content: "您确定订单到货了吗？",
        confirm() {
          const params = {
            orderId: that.data.pageData.orderInfoVoList[0].orderId
          };
          wx.showLoading();
          mineAPI.getOrderConfirm(params).then(res => {
            showToast("收货成功");
            that.data.pageData.orderInfoVoList[0].status = 5;
            that.setData({
              pageData: that.data.pageData
            });
          });
        }
      });
    },
    //取消订单
    handleCancel() {
      const that = this;
      const params = {
        tradeId: this.data.pageData.tradeId
      };
      showModal({
        content: "您确定取消此订单吗？",
        confirm() {
          mineAPI.getTradeCancel(params).then(res => {
            showToast("取消成功");
            that.data.pageData.orderInfoVoList[0].status = 6;
            that.setData({
              pageData: that.data.pageData
            });
          });
        }
      });
    }
  }
});
