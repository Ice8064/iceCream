import { validators, validatorAll } from "../../../../utils/validators";
import mineAPI from "../../../../server/API/mineAPI";
import commonAPI from "../../../../server/API/commonAPI";
import { showToast } from "../../../../utils/wxApi";

Page({
  data: {
    options: {},
    address: "",
    telNumber: "",
    userName: "",
    id: 0,
    provinceArray: [],
    cityArray: [],
    countyArray: [],
    provinceInfo: {
      name: "",
      id: "",
      index: 0
    },
    cityInfo: {
      name: "",
      id: "",
      index: 0
    },
    countyInfo: {
      name: "",
      id: "",
      index: 0
    }
  },
  onLoad(option) {
    this.options = option;
    if (this.options.id) {
      this.setData({
        userName: this.options.userName,
        telNumber: this.options.telNumber,
        address: this.options.address
      });
    }

    //获取省
    this.getProvinceArrayData().then(() => {
      //获取市
      this.getCityArrayData().then(() => {
        //获取区
        this.getCountyArrayData().then(() => {});
      });
    });
  },
  //获取formid
  getReportSubmit(e) {
    commonAPI.queryReportSubmit({
      actionname: "hermes.address.index",
      form_id: e.detail.formId
    });
  },
  //输入框改变
  handleInput(e) {
    const type = e.target.dataset.type;
    const value = e.detail.value;
    this.setData({
      [type]: value
    });
  },
  //提交
  handleSubmit(event) {
    if (
      !(
        this.data.userName &&
        this.data.telNumber &&
        this.data.address &&
        this.data.provinceInfo.id &&
        this.data.cityInfo.id &&
        this.data.countyInfo.id
      )
    ) {
      showToast("请填写完整数据");
      return false;
    }

    let validatorArray = [
      {
        checkName: "checkMobile",
        value: this.telNumber,
        error: "亲,手机号码不能填错噢～"
      }
    ];
    validatorAll(validatorArray).then(() => {
      const params = {
        id: this.options.id,
        tel: this.data.telNumber,
        name: this.data.userName,
        address: this.data.address,
        provinceId: this.data.provinceInfo.id,
        cityId: this.data.cityInfo.id,
        districtId: this.data.countyInfo.id
      };
      wx.showLoading({
        title: "保存中.."
      });
      mineAPI.postUpdateUserAddress(params).then(res => {
        showToast("设置成功");
        wx.navigateBack();
      });
    });
  },
  //切换省市区
  onHandleColumnchange(event) {
    const column = event.detail.column;
    const index = event.detail.value;
    let provinceInfo = {},
      cityInfo = {},
      countyInfo = {};
    if (column === 0) {
      provinceInfo = this.setDataInfo(this.data.provinceArray[index].areaName, this.data.provinceArray[index].id, index);
      this.data.provinceInfo = provinceInfo;
      this.setData({
        provinceInfo
      });
      this.getCityArrayData(true).then(() => {
        this.getCountyArrayData(true);
      });
    } else if (column === 1) {
      cityInfo = this.setDataInfo(this.data.cityArray[index].areaName, this.data.cityArray[index].id, index);
      this.setData({
        cityInfo
      });
      this.getCountyArrayData(true);
    } else {
      countyInfo = this.setDataInfo(this.data.countyArray[index].areaName, this.data.countyArray[index].id, index);
      this.setData({
        countyInfo
      });
    }
  },

  //获取每个地址的id
  getAddressParentId(array, index) {
    return array[index].id;
  },

  //获取省地址
  getProvinceArrayData() {
    return mineAPI
      .postFindAreas()
      .then(res => {
        const provinceArray = res.list;
        let provinceInfo = {};
        if (this.options.id && this.options.provinceId) {
          //获取的具体某一个省
          provinceInfo = this.setDataInfo(
            this.options.provinceName,
            this.options.provinceId,
            this.querySelectIndex(provinceArray, this.options.provinceId)
          );
        } else {
          provinceInfo = this.setDataInfo(
            provinceArray[this.data.provinceInfo.index].areaName,
            provinceArray[this.data.provinceInfo.index].id,
            this.data.provinceInfo.index
          );
        }
        this.setData({
          provinceArray,
          provinceInfo
        });
      })
      .catch(() => {
        wx.showModal({
          title: "提示",
          content: "省数据跑掉了,请重新进入此页～",
          confirmText: "返回前页",
          showCancel: false,
          success(res) {
            if (res.confirm) {
              wx.navigateBack();
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          }
        });
      });
  },

  //获取市地址
  getCityArrayData(reset) {
    const id = this.getAddressParentId(this.data.provinceArray, this.data.provinceInfo.index);
    return mineAPI
      .postFindAreas({ parentId: id })
      .then(res => {
        const cityArray = res.list;
        let cityInfo = {};
        if (this.options.id && this.options.cityId && !reset) {
          //获取的具体某一个市
          cityInfo = this.setDataInfo(
            this.options.cityName,
            this.options.cityId,
            this.querySelectIndex(cityArray, this.options.cityId)
          );
        } else {
          cityInfo = this.setDataInfo(cityArray[0].areaName, cityArray[0].id, 0);
        }
        this.setData({
          cityArray,
          cityInfo
        });
      })
      .catch(() => {
        showToast("市逃跑了,请重新滑动省");
      });
  },

  //获取区地址
  getCountyArrayData(reset) {
    const id = this.getAddressParentId(this.data.cityArray, this.data.cityInfo.index);
    return mineAPI
      .postFindAreas({ parentId: id })
      .then(res => {
        const countyArray = res.list;
        let countyInfo = {};
        if (this.options.id && this.options.districtId && !reset) {
          //获取的具体某一个区
          countyInfo = this.setDataInfo(
            this.options.districtName,
            this.options.districtId,
            this.querySelectIndex(countyArray, this.options.districtId)
          );
        } else {
          countyInfo = this.setDataInfo(countyArray[0].areaName, countyArray[0].id, 0);
        }
        this.setData({
          countyArray,
          countyInfo
        });
      })
      .catch(() => {
        showToast("区逃跑了,请重新滑动市");
      });
  },

  //设置获取选择的省市区信息
  setDataInfo(name, id, index) {
    return { name, id, index };
  },

  //获取省市区index
  querySelectIndex(arr, id) {
    for (let key in arr) {
      if (arr[key].id == id) {
        return parseInt(key);
      }
    }
    return 0;
  }
});
