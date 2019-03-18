import { xwsNavigateToPage, showToast } from "../../../utils/wxApi";
import { uploadImageFile } from "../../../utils/api";
import mineAPI from "../../../server/API/mineAPI";

Page({
  data: {
    title: "",
    titles: {
      refundType: "请选择服务类型",
      receiveStatus: "请选择货物状态",
      reason: "请选择退货原因"
    },
    images: [],
    applyAmount: 0,
    reasonDesc: "",
    refundTypeCheckItem: {},
    receiveStatusCheckItem: {},
    reasonCheckItem: {},
    checkItem: {},
    pageData: {
      refundType: [],
      receiveStatus: [],
      refundNoReceivedReason: [],
      refundReceivedNoSendGoodsReason: [],
      refundReceivedSendGoodsReason: []
    },
    reasons: [],
    receiveStatusArr: [],
    showDialog: false
  },

  onLoad(option) {
    this.data.options = option;
    this.getData();
  },

  getData() {
    mineAPI.getRefundInit({ orderId: this.data.options.orderId }).then(res => {
      this.setData(
        {
          pageData: res,
          receiveStatusArr: res.receiveStatus,
          refundTypeCheckItem: res.refundType[0],
          receiveStatusCheckItem: res.receiveStatus[0],
          applyAmount: this.data.options.applyAmount
        },
        () => {
          this.getReasons();
        }
      );
    });
  },
  //获取不同理由
  getReasons() {
    //REFUND && RECEIVED 退款不退货
    //REFUND && UN_RECEIVED 退款
    //REFUND_WITH_GOODS 退货退款

    let reasons = [];
    if (this.data.refundTypeCheckItem.key == "REFUND_WITH_GOODS") {
      reasons = this.data.pageData.refundReceivedSendGoodsReason;
    }
    if (this.data.refundTypeCheckItem.key == "REFUND" && this.data.receiveStatusCheckItem.key == "RECEIVED") {
      reasons = this.data.pageData.refundReceivedNoSendGoodsReason;
    }
    if (this.data.refundTypeCheckItem.key == "REFUND" && this.data.receiveStatusCheckItem.key == "UN_RECEIVED") {
      reasons = this.data.pageData.refundNoReceivedReason;
    }
    this.data.reasons = reasons;
  },
  // 多选
  handleShowDialog(e) {
    const type = e.currentTarget.dataset.type;
    //判断是否要弹窗
    if (type == "refundType" && this.data.pageData.refundType.length <= 1) {
      return false;
    }
    if (type == "receiveStatus" && this.data.pageData.receiveStatus.length <= 1) {
      return false;
    }

    if (type == "reason" && !(this.data.refundTypeCheckItem.key && this.data.receiveStatusCheckItem.key)) {
      showToast("请先选择服务类型和货物状态");
      return;
    }

    this.data.type = type;

    const reasons = type != "reason" ? this.data.pageData[type] : this.data.reasons;

    this.setData({
      showDialog: true,
      title: this.data.titles[type],
      reasons: reasons,
      checkItem: this.data[type + "CheckItem"]
    });
  },
  //添加退款金额
  handleInput(e) {
    const value = e.detail.value;
    this.setData({
      applyAmount: value
    });
  },
  //填写退款理由
  handleReason(e) {
    const value = e.detail.value;
    this.setData({
      reasonDesc: value
    });
  },
  // 删除图片
  handleDel(e) {
    const index = e.target.dataset.index;
    this.data.images.splice(index, 1);
    this.setData({
      images: this.data.images
    });
  },
  //上传图片
  handleUploadImg() {
    const that = this;
    if (this.data.images.length >= 6) {
      showToast("最多只能传6张！");
      return;
    }
    wx.chooseImage({
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success(res) {
        const tempFilePaths = res.tempFilePaths;
        uploadImageFile(tempFilePaths[0]).then(url => {
          that.data.images.push(url);
          that.setData({
            images: that.data.images
          });
        });
      }
    });
  },
  //提交
  handleSubmit() {
    if (!this.data.reasonCheckItem.reasonDesc) {
      showToast("请选择退货原因");
      return;
    }
    const params = {
      orderId: this.options.orderId,
      orderRefundItemDtoList: [
        {
          applyAmount: this.data.applyAmount,
          rowNo: this.options.rowNo
        }
      ],
      reasonDesc: this.data.reasonDesc,
      reasonType: this.data.reasonCheckItem.reasonId,
      refundReceiveStatus: this.data.receiveStatusCheckItem.key,
      refundType: this.data.refundTypeCheckItem.key,
      vouchers: this.data.images
    };
    mineAPI.getOrderRefund(params).then(res => {
      showToast("申请成功");
      wx.navigateBack();
    });
  },
  //选择项
  handleCheckItem(e) {
    const item = e.currentTarget.dataset.item;
    const type = this.data.type;

    if (type == "refundType") {
      let arr = [];
      if (item.key == "REFUND_WITH_GOODS") {
        this.data.receiveStatusArr.forEach(d => {
          if (d.key == "RECEIVED") {
            arr.push(d);
          }
        });
      } else {
        arr = this.data.receiveStatusArr;
      }
      this.setData({
        "pageData.receiveStatus": arr,
        receiveStatusCheckItem: arr[0]
      });
    }
    this.setData(
      {
        checkItem: item,
        [this.data.type + "CheckItem"]: item,
        reasonCheckItem: this.data.type != "reason" ? {} : item
      },
      res => {
        if (this.data.type != "reason") {
          this.getReasons();
        }
      }
    );
  },

  handleClose() {
    this.setData({
      showDialog: false
    });
  }
});
