import { showToast } from "../../../utils/wxApi";
import { xwsStorage } from "../../../utils/index";
import { queryReportSubmit, orderPay } from "../../../utils/api";
import homeAPI from "../../../server/API/homeAPI";
import mineAPI from "../../../server/API/mineAPI";

Page({
  data: {
    detail: {},
    remark: "",
    switchChecked: true,
    address: {},
    balance: 0,
    orderBudgetMount: 0,
    amount: 0,
    totalPrice: 0,
    earnAmount: 0,
    tradeIds: "",
    ajaxStatus: false
  },

  onLoad(option) {
    this.data.options = option;
    const pageData = JSON.parse(option.data);
    this.getTradePre(pageData);
    this.setData({
      detail: pageData
    });
  },

  onShow() {
    this.getAddress();

    const remark = xwsStorage.get("hermes_remark");

    this.setData({
      remark
    });
  },

  getReportSubmit(e) {
    queryReportSubmit(e);
  },

  //获取优惠
  getTradePre(pageData, quantity) {
    const data = pageData;
    const params = {
      orderItemList: [
        {
          skuId: data.id,
          quantity: quantity || data.quantity
        }
      ]
    };
    homeAPI.getTradePre(params).then(res => {
      this.setData({
        orderBudgetMount: res.budget,
        balance: res.balance,
        amount: res.payableFee,
        orderTotalAmount: res.payableFee,
        earnAmount: res.earn
      });
    });
  },

  //获取地址
  getAddress() {
    let address = xwsStorage.get("hermes_address");
    if (!address) {
      mineAPI.postUserAddress().then(res => {
        if (res.list && res.list[0].default == 1) {
          address = res.list[0];
          xwsStorage.set("hermes_address", address);
          this.setData({
            address
          });
        }
      });
    } else {
      this.setData({
        address
      });
    }
  },

  //切换使用抵现
  handleSwitch(e) {
    if (!e.detail.value) {
      this.setData({
        amount: this.data.orderTotalAmount.toFixed(2),
        switchChecked: e.detail.value
      });
    } else {
      const amount = parseFloat(this.data.orderTotalAmount) - parseFloat(this.data.orderBudgetMount);
      this.setData({
        amount: amount.toFixed(2),
        switchChecked: e.detail.value
      });
    }
  },

  getTotalPrice(price, quantity) {
    const totalPrice = price * quantity;
    this.getBudget(totalPrice);
  },

  //加
  handleAdd() {
    const quantity = this.data.detail.quantity + 1;
    this.getTradePre(this.data.detail, quantity);
    this.setData({
      "detail.quantity": quantity
    });
  },

  //减
  handleMinus() {
    if (this.data.detail.quantity > 1) {
      const quantity = this.data.detail.quantity - 1;
      this.getTradePre(this.data.detail, quantity);
      this.setData({
        "detail.quantity": quantity
      });
    } else {
      showToast("一件起售");
    }
  },

  //跳转到地址页面
  handleToChangeAddress() {
    wx.navigateTo({ url: "/pages/mine/address/index?choose=1" });
  },

  //提交订单
  handleSubmit() {
    if (!(this.data.address && this.data.address.provinceName)) {
      showToast("请先填写地址");
      return;
    }
    if (this.data.ajaxStatus) {
      return;
    }
    this.data.ajaxStatus = true;

    if (this.data.tradeIds) {
      //判断是否生成了订单
      this.pay(this.data.tradeIds);
      return false;
    }
    const params = {
      address: this.data.address.addressDetail,
      cityId: this.data.address.cityId,
      cityName: this.data.address.cityName,
      districtId: this.data.address.districtId,
      districtName: this.data.address.districtName,
      provinceId: this.data.address.provinceId,
      provinceName: this.data.address.provinceName,
      orderItemList: [
        {
          quantity: this.data.detail.quantity,
          skuId: this.data.detail.id
        }
      ],
      memo: this.data.remark,
      mobile: this.data.address.tel,
      receiver: this.data.address.name
    };
    wx.showLoading();
    homeAPI
      .getTradeCreate(params)
      .then(res => {
        this.data.tradeIds = res.tradeId;
        this.pay(res.tradeId);
      })
      .catch(d => {
        this.data.ajaxStatus = false;
      });
  },

  //支付
  pay(tradeIds) {
    orderPay({
      tradeIds: tradeIds,
      changeAjaxStatus: () => {
        this.data.ajaxStatus = false;
      },
      paySuccess: res => {
        wx.redirectTo({ url: `/pages/home/cash/order?detail=${JSON.stringify(res)}` });
      },
      fail: () => {
        wx.redirectTo({ url: "/pages/mine/orderList/index" });
      }
    });
  },

  //跳转到备注页面
  handleToRemark() {
    wx.navigateTo({ url: "/pages/home/orderRemark/index" });
  },

  //跳转规则
  handleToRule() {
    wx.navigateTo({
      url: "/pages/common/image/index?imgUrl=https://imgs-1253854453.image.myqcloud.com/463645fb579d6eec95711b9d4e5590d4.png"
    });
  },

  //页面销毁
  onUnload() {
    xwsStorage.clear("hermes_remark");
  }
});
