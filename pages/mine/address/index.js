import { showModal, showToast } from "../../../utils/wxApi";
import { xwsStorage } from "../../../utils/index";
import mineAPI from "../../../server/API/mineAPI";
import { queryReportSubmit } from "../../../utils/api";

Page({
  data: {
    options: {},
    address: [],
    ajaxSuccess: false
  },
  onLoad(option) {
    this.options = option;
  },
  onShow() {
    this.getData();
  },

  getData() {
    wx.showLoading();
    mineAPI.postUserAddress().then(res => {
      this.setData({
        address: res.list,
        ajaxSuccess: true
      });
    });
  },

  //获取formid
  getReportSubmit(e) {
    queryReportSubmit(e);
  },

  //选择地址
  handleChoose(e) {
    //别的页面过来的
    if (this.options.choose) {
      const item = e.currentTarget.dataset.item;
      xwsStorage.set("hermes_address", item);
      wx.navigateBack();
    }
  },

  //设置为默认
  handleSetDefault(e) {
    const data = e.currentTarget.dataset.item;
    //判断是否已经是默认的
    if (data.default == 1) {
      return false;
    }
    wx.showLoading();
    mineAPI
      .postResetDefaultAddress({
        id: data.id
      })
      .then(res => {
        if (this.options.choose) {
          xwsStorage.set("hermes_address", data);
          wx.navigateBack();
        } else {
          const newAddress = JSON.parse(JSON.stringify(this.data.address));
          newAddress.forEach(d => {
            if (d.id == data.id) {
              d.default = 1;
            } else {
              d.default = -1;
            }
          });
          this.setData({
            address: newAddress
          });
        }
      });
  },

  //新增
  handleAddAddress() {
    wx.navigateTo({
      url: `/pages/mine/address/edit/index`
    });
  },

  //编辑
  handleEdit(e) {
    const data = e.target.dataset.item;
    wx.navigateTo({
      url: `/pages/mine/address/edit/index?default=${data.default}&id=${data.id}&address=${data.addressDetail}&telNumber=${
        data.tel
      }&userName=${data.name}&provinceName=${data.provinceName}&cityName=${data.cityName}&districtName=${
        data.districtName
      }&provinceId=${data.provinceId}&cityId=${data.cityId}&districtId=${data.districtId}`
    });
  },

  //删除
  handleDel(e) {
    const that = this;
    const index = e.target.dataset.index;
    const list = JSON.parse(JSON.stringify(this.data.address));
    showModal({
      content: "您确定删除此地址吗？",
      confirm() {
        mineAPI
          .postDelAddress({
            id: [that.data.address[index].id]
          })
          .then(res => {
            showToast("删除成功");
            list.splice(index, 1);
            that.setData({
              address: list
            });
          });
      }
    });
  }
});
