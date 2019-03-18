var conf = {
  // 神策分析注册在APP全局函数中的变量名，在非app.js中可以通过getApp().sensors(你这里定义的名字来使用)
  name: "sa",
  appid: "wx4673f3cf876ff250",
  // 神策分析数据接收地址
  server_url: "https://sensors.xiangwushuo.com/sa?project=duoxiangtao",
  // 传入的字符串最大长度限制
  max_string_length: 300,
  // 发送事件的时间使用客户端时间还是服务端时间
  use_client_time: false,
  // 是否在模拟器控制台打 log，显示发送的数据,
  show_log: false,
  // 是否自动采集如下事件
  autoTrack: {
    // $MPLaunch
    appLaunch: true,
    // $MPShow
    appShow: true,
    //$MPShare
    pageShare: true,
    // $MPHide
    appHide: true,
    // $MPViewScreen
    pageShow: true
  },
  register: {
    mini_app_name: "duoxiangtao"
  }
};

module.exports = conf;
