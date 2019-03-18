import homeAPI from "../../../server/API/homeAPI";
Page({
  data: {
    list: [
      {
        topic_id: 302711,
        btn_str: "\u67e5\u770b",
        url: "/pages/topic/view?topicid=302711",
        index: 0,
        img: "http://imgs-1253854453.image.myqcloud.com/35b20c5a75f32706ec21c80f6591aabb.jpg?imageView2/2/w/100/h/100",
        desc:
          "\u4eab\u7269\u8bf4\u9650\u91cf\u5468\u8fb9\n\u7eff\u8272\u73af\u4fdd\uff0c\u65f6\u5c1a\u5927\u65b9\u7684\u8d2d\u7269\u888b\n\u9a91\u8f66\u90ca\u6e38\uff0c\u8d2d\u7269\u91ce\u9910\uff0c\u65e0\u6240\u4e0d\u80fd\n\n\u3010\u9886\u53d6\u89c4\u5219\u3011\n\u901a\u8fc7\u54c8\u7f57\u5355\u8f66\u201c\u9a91\u4eab\u7f8e\u597d\u751f\u6d3b\u201d\u6d3b\u52a8\u6388\u6743\u8fdb\u5165\u4eab\u7269\u8bf4\u5c0f\u7a0b\u5e8f\u7684\u65b0\u7528\u6237\uff0c\u5373\u53ef\u514d\u8d39\u83b7\u5f97\u3002\n\u65b0\u7528\u6237\u70b9\u51fb\u9886\u53d6\u53f3\u4e0b\u89d2\u201c\u8981\u4e86\u201d\uff0c\u652f\u4ed8\u4e00\u6735\u5c0f\u7ea2\u82b1\uff08\u4f60\u6709200\u6735\u54df\uff09\uff0c\u5e76\u4f7f\u7528\u65b0\u7528\u6237\u201c\u514d\u90ae\u5238\u201d\u62cd\u4e0b\u5b9d\u8d1d\u5373\u53ef",
        title: "\u3010\u9500\u91cf5000\u3011\u4eab\u7269\u8bf4\u73af\u4fdd\u8d2d\u7269\u888b",
        btn1_str: "\u53d6\u6d88",
        btn2_str: "\u7acb\u5373\u6388\u6743",
        alert_msg: "\u8bf7\u5148\u6388\u6743\u767b\u5f55",
        amount: 4986,
        have_buy: false
      },
      {
        topic_id: 263448,
        btn_str: "\u5df2\u9886\u53d6",
        url: "",
        index: 1,
        img: "http://imgs-1253854453.image.myqcloud.com/472153c7eff969007a89426894a7ef67.jpg?imageView2/2/w/100/h/100",
        desc:
          "\u4eab\u7269\u8bf4\u514d\u90ae\u52b5\uff0c\u4e00\u5355\u4e00\u52b5\u6700\u9ad8\u51cf\u514d18\u5143\uff1b\uff0c\u4e00\u5929\u4ec5\u9650\u4f7f\u7528\u4e00\u5f20\uff1b\uff0c\u4ece\u9886\u53d6\u65e5\u7b97\u8d777\u5929\u5185\u6709\u6548\uff1b\uff0c\u56e0\u4e2a\u4eba\u539f\u56e0\u53d6\u6d88\u8ba2\u5355\u9000\u5355\u4e0d\u9000\u52b5\u3002\u5173\u6ce8\u4eab\u7269\u8bf4\u516c\u4f17\u53f7\uff0c\u53d1\u9001\u3010\u514d\u90ae\u3011\u53e3\u4ee4\uff0c\u53ef\u5b9e\u65f6\u67e5\u8be2\u4f60\u7684\u514d\u90ae\u5238\u8d26\u6237\u3002",
        title: "\u4eab\u7269\u8bf4\u514d\u90ae\u5238\u4e00\u5f20",
        btn1_str: "\u53d6\u6d88",
        btn2_str: "\u7acb\u5373\u6388\u6743",
        alert_msg: "\u8bf7\u5148\u6388\u6743\u767b\u5f55",
        amount: 2064,
        have_buy: true,
        is_new: false
      },
      {
        topic_id: 302791,
        btn_str: "\u67e5\u770b",
        url: "/pages/topic/view?topicid=302791",
        index: 2,
        img: "http://imgs-1253854453.image.myqcloud.com/1a4449b54b79677c519509056de03ff7.jpeg?imageView2/2/w/100/h/100",
        desc:
          "\u4ec5\u9650\u6ca1\u6709\u9886\u53d6\u8fc7\u514d\u9a91\u5361\u7684\u65b0\u7528\u6237\u9886\u53d6\n\u6bcf\u4e2a\u7528\u6237\u9650\u98861\u5f20\n\u9886\u53d6\u540e30\u5929\u5185\u65e0\u9650\u6b21\u514d\u9a91\n\u70b9\u51fb\u53f3\u4e0b\u89d2\u201c\u8981\u4e86\u201d\uff0c\u5373\u53ef1\u82b1\u62cd\u4e0b\n\u70b9\u51fb\u201c\u9886\u53d6\u5b9d\u8d1d\u201d\uff0c\u540e\u53f0\u56de\u590d\u201c\u54c8\u7f57\u201d\uff0c\u5373\u53ef\u6210\u529f\u9886\u53d6",
        title: "\u3010\u54c8\u7f57\u5355\u8f6630\u5929\u65e0\u9650\u6b21\u514d\u9a91\u5361\u3011",
        btn1_str: "\u53d6\u6d88",
        btn2_str: "\u7acb\u5373\u6388\u6743",
        alert_msg: "\u8bf7\u5148\u6388\u6743\u767b\u5f55",
        amount: 0,
        have_buy: false
      }
    ],
    user: {},
    showFeedback: "",
    feedbackMsg: "",
    showConfirm: "",
    confirmMsg: "",
    pageData: {
      prizeList: []
    },
    currentLevel: null,
    currentFlowerNum: 3,
    selectedLevel: 0,
    infoListStore: []
  },
  onShow() {},
  onHandleClick() {
    wx.showModal({
      title: "今日商品已全部兑换完，下一轮兑换将于明日10点开启",
      showCancel: false
    });
  }
});
