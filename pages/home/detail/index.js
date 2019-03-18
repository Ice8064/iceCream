// import { xwsStorage } from "../../../utils/index";
import { shareAppMessage } from "../../../utils/wxApi";
import homeAPI from "../../../server/API/homeAPI";

Page({
  data: {
    //轮播参数
    bannersOption: {
      showDot: false,
      swiperCurrent: 0,
      autoplay: false,
      interval: 5000,
      circular: true
    },
    showServiceDialog: false, //显示服务
    showDanmuku: false, //显示弹幕
    redpacketDetail: {},
    showPacketDialog: false,
    packetType: 2,
    pageNum: 1, //推荐商品分页
    hasMore: false,
    isLoading: false, //加载更多
    //商品信息
    productData: {},
    recommendList: []
  },

  onLoad(options) {
    this.data.options = options;
    wx.showShareMenu({
      withShareTicket: true
    });

    this.getData();
    this.getNewRedpacket();
    this.getRecommendList();
  },

  onShow() {
    this.setData({
      showDanmuku: true
    });
  },

  //获取数据
  getData() {
    homeAPI.getProductDetail({ itemId: this.data.options.itemId }).then(res => {
      let autoplay = false;
      if (res.carouselImgList.length) {
        autoplay = true;
      }
      this.setData({
        productData: res,
        "bannersOption.autoplay": autoplay
      });
    });
  },

  //获取推荐商品
  getRecommendList() {
    const params = {
      pageNum: this.data.pageNum
    };
    homeAPI.getRecommend(params).then(res => {
      const recommendList = this.data.pageNum == 1 ? res.list : this.data.recommendList.concat(res.list);
      this.data.pageNum++;
      this.setData({
        recommendList,
        hasMore: res.hasMore,
        isLoading: false
      });
    });
  },

  //自定义轮播的当前点
  swiperChange: function(e) {
    this.setData({
      "bannersOption.swiperCurrent": e.detail.current
    });
  },

  //查询是否有新人红包
  getNewRedpacket() {
    homeAPI.getBoostIsnew().then(res => {
      //判断红包有没有开启过
      if (!res.open) {
        const redpacketDetail = {
          boostRedPacketResponeVo: {
            amount: res.newUserBoostAmount
          },
          headUrl: "https://imgs-1253854453.image.myqcloud.com/58248c7a8d395d44809ac9b389317a7f.png"
        };
        this.setData({
          redpacketDetail,
          showPacketDialog: true
        });
      }
    });
  },

  //显示服务说明
  handleShowServiceDialog() {
    this.setData({
      showServiceDialog: true
    });
  },

  //隐藏服务说明
  handleHideServiceDialog() {
    this.setData({
      showServiceDialog: false
    });
  },

  //关闭红包弹窗
  handleCloseRedpacketDialog() {
    this.setData({
      showPacketDialog: false
    });
  },

  //下拉到一定高度刷新数据
  onReachBottom() {
    if (!this.data.hasMore || this.data.isLoading) return;
    this.setData({
      isLoading: true
    });
    this.getRecommendList();
  },

  onPullDownRefresh() {
    this.data.pageNum = 1;
    this.getRecommendList();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 500);
  },

  //分享
  onShareAppMessage() {
    const params = {
      title: this.data.productData.title,
      path: `/pages/home/index?activePage=/pages/home/detail/index&itemId=${this.data.productData.itemSkuList[0].itemId}`
    };

    return shareAppMessage(params);
  },
  onUnload() {
    this.setData({
      "bannersOption.autoplay": false,
      showDanmuku: false
    });
  }
});
