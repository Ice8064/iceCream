import env from "../baseUrl";
import fetch from "../request";

/**** 用户数据********/
function getMine(params) {
  return fetch(`${env.baseUrl}/aa039/v1/mine/index`, params);
}

/*********************订单接口******************/

//订单列表
function getTradeQuery(params) {
  return fetch(`${env.baseUrl}/la040/trade/query`, params);
}

//订单详情
function getTradeDetail(params) {
  return fetch(`${env.baseUrl}/la040/trade/detail`, params);
}

//取消订单
function getTradeCancel(params) {
  return fetch(`${env.baseUrl}/la040/trade/cancel`, params);
}

//确认收货
function getOrderConfirm(params) {
  return fetch(`${env.baseUrl}/la040/order/confirm`, params);
}

//订单退款
function getOrderFullRefund(params) {
  return fetch(`${env.baseUrl}/la040/order/order-full-refund`, params);
}

//物流信息
function getOrderShipping(params) {
  return fetch(`${env.baseUrl}/la040/order/shipping/query`, params);
}

//提交退货信息
function getOrderRefund(params) {
  return fetch(`${env.baseUrl}/la040/refund`, params);
}

//退货初始化接口
function getRefundInit(params) {
  return fetch(`${env.baseUrl}/la040/refund/init`, params);
}

//取消退款
function getOrderRefundCancel(params) {
  return fetch(`${env.baseUrl}/la040/refund/cancel`, params);
}
/******************地址接口******************/

// 根据省查询所有的市 或根据市查询所有的区
function postFindAreas(params) {
  return fetch(`${env.baseUrl}/ba037/address/findAreasByParentAreaId`, params);
}

// 根据省市区名称查询对应的省市区id
function postAreaByAreaNames(params) {
  return fetch(`${env.baseUrl}/ba037/address/queryAreaByAreaNames`, params);
}

// 获取收货地址列表
function postUserAddress(params) {
  return fetch(`${env.baseUrl}/ba037/v3/address/queryUserAddress`, params);
}

// 增加修改收货地址
function postUpdateUserAddress(params) {
  return fetch(`${env.baseUrl}/ba037/v3/address/addOrUpdateUserAddress`, params);
}

// 设置默认地址
function postResetDefaultAddress(params) {
  return fetch(`${env.baseUrl}/ba037/address/updateDefaultAddress`, params);
}

// 设置删除地址
function postDelAddress(params) {
  return fetch(`${env.baseUrl}/ba037/address/delAddress`, params);
}

export default {
  getMine,
  getTradeQuery,
  getTradeDetail,
  getTradeCancel,
  getOrderConfirm,
  getOrderFullRefund,
  getOrderShipping,
  postFindAreas,
  postAreaByAreaNames,
  postUserAddress,
  postUpdateUserAddress,
  postResetDefaultAddress,
  postDelAddress,
  getOrderRefund,
  getRefundInit,
  getOrderRefundCancel
};
