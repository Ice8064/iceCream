import env from "../baseUrl";
import fetch from "../request";

//弹幕数据
function getDanmakuList(params) {
  return fetch(`${env.baseUrl}/lh067/danmaku/list`, params);
}

//banner
function getBannerList(params) {
  return fetch(`${env.baseUrl}/lh067/banner/list`, params);
}

//活动商品list
function getRecommend(params) {
  return fetch(`${env.baseUrl}/lc056/items/recommend`, params);
}

/*******************商品&订单*****************************/

//商品详情
function getProductDetail(params) {
  return fetch(`${env.baseUrl}/lc056/items/detail`, params);
}

//商品详情海报
function getProductPoster(params) {
  return fetch(`${env.baseUrl}/lc056/items/poster/fetch`, params);
}

//提交订单
function getTradeCreate(params) {
  return fetch(`${env.baseUrl}/la040/trade/create`, params);
}

//获取优惠
function getTradePre(params) {
  return fetch(`${env.baseUrl}/la040/trade/pre`, params);
}

//支付
function getPayCreate(params) {
  return fetch(`${env.baseUrl}/la040/pay/create`, params);
}

//支付查询
function getPayQuery(params) {
  return fetch(`${env.baseUrl}/la040/pay/query`, params);
}

/*******************红包相关*****************************/

//下单使用的资产预估
function getBoostAssetBudget(params) {
  return fetch(`${env.baseUrl}/lb026/boost/asset/budget`, params);
}

//获取用户资产流水
function getBoostAssetFlows(params) {
  return fetch(`${env.baseUrl}/lb026/boost/asset/flows`, params);
}

//TA们刚刚提现了，接口数据
function getBoostAssetWithdrawflows(params) {
  return fetch(`${env.baseUrl}/lb026/boost/asset/withdrawflows`, params);
}

//助力好友,同时生成自己的助力
function postBoostFriends(params) {
  return fetch(`${env.baseUrl}/lb026/boost/boost`, params);
}

//助力详情
function getBoostDetails(params) {
  return fetch(`${env.baseUrl}/lb026/boost/details`, params);
}

//生成新的红包,包括新人红包、下单红包、助力红包
function getBoostGenerate(params) {
  return fetch(`${env.baseUrl}/lb026/boost/generate`, params);
}

//红包详情
function getRedpacketDetail(params) {
  return fetch(`${env.baseUrl}/lb026/boost/get`, params);
}

//判断是否有新人红包
function getBoostIsnew(params) {
  return fetch(`${env.baseUrl}/lb026/boost/isnew`, params);
}

//我的资产
function getBoostList(params) {
  return fetch(`${env.baseUrl}/lb026/boost/list`, params);
}

//获取红包海报
function getBoostPoster(params) {
  return fetch(`${env.baseUrl}/lb026/boost/poster/fetch`, params);
}

export default {
  getDanmakuList,
  getBannerList,
  getRecommend,
  getProductDetail,
  getTradeCreate,
  getPayCreate,
  getBoostGenerate,
  getBoostAssetFlows,
  getBoostAssetBudget,
  getBoostAssetWithdrawflows,
  postBoostFriends,
  getBoostDetails,
  getBoostGenerate,
  getRedpacketDetail,
  getBoostIsnew,
  getBoostList,
  getPayQuery,
  getTradePre,
  getProductPoster,
  getBoostPoster
};
