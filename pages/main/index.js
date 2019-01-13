Page({
  /**
   * 页面的初始数据
   */
  data: {
    storeConfig: {
      storeAvator:
        "https://tva2.sinaimg.cn/crop.0.0.180.180.180/6694d955jw1e8qgp5bmzyj2050050aa8.jpg",
      storeName: "永辉超市",
      storePhone: "17701328063",
      storeAddress: "南京市江宁区秣周东路88号"
    },
    goodList: [
      {
        avator:
          "https://img11.360buyimg.com/n7/jfs/t1/9369/38/4022/64510/5bd975b7Eddcf021d/ebd6d12cb8dfc4d1.jpg",
        title: "40包小零食撸猫专用",
        price: 9.9,
        buyNum: 999
      },
      {
        avator:
          "https://img11.360buyimg.com/n7/jfs/t20365/316/1216991915/173915/859d65d4/5b221170Nfc40038d.jpg",
        title: "40包小零食撸猫专用大局为重是吧",
        price: 9.9,
        buyNum: 999
      },
      {
        avator:
          "https://img11.360buyimg.com/n7/jfs/t1/9369/38/4022/64510/5bd975b7Eddcf021d/ebd6d12cb8dfc4d1.jpg",
        title: "40包小零食撸猫专用",
        price: 9.9,
        buyNum: 999
      },
      {
        avator:
          "https://img14.360buyimg.com/n7/jfs/t23581/217/2084329715/99851/f73e08d5/5b74fa10N4750a569.jpg",
        title: "40包小零食撸猫专用",
        price: 9.9,
        buyNum: 999
      }
    ],
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    loginUserInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getUserInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  bindGoToSearch() {
    wx.navigateTo({
      url: "../search/index"
    });
  },
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo);
  },
  getUserInfo() {
    var that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting["scope.userInfo"]) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              that.setData({
                loginUserInfo: res.userInfo
              });
            }
          });
        }
      }
    });
  }
});
