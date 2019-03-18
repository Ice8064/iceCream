/*
 * @name get storage data
 * @name set storage data
 * @name $on set Func
 * @name $em get Func
 */
function xwsStorage() {
  this.invokeObj = {};
  this.dataObj = {};
}

//获取数据
xwsStorage.prototype.get = function(key) {
  let value = "";
  try {
    value = wx.getStorageSync(key);
  } catch (e) {
    console.log(e);
  }

  //判断本地是否有数据 有就取 没有就取缓存 兼容storage报错情况
  value = this.dataObj[key] ? this.dataObj[key] : value;
  return value;
};

//存储数据
xwsStorage.prototype.set = function(key, value, notStorage = false) {
  //临时缓存 不记录在Storage里面
  if (!notStorage) {
    try {
      wx.setStorageSync(key, value);
    } catch (e) {
      console.log(e);
    }
  }
  this.dataObj[key] = value;
};

//存储函数回调
xwsStorage.prototype.$on = function(key, func) {
  if (key && typeof func == "function") {
    this.invokeObj[key] = func;
  }
};

//存储函数回调
xwsStorage.prototype.$emit = function(key) {
  const func = this.invokeObj[key];
  if (key && typeof func == "function") {
    func();
  }
};

//清除数据
xwsStorage.prototype.clear = function(key) {
  try {
    wx.removeStorageSync(key);
    delete this.dataObj[key];
  } catch (e) {}
};

const storageFunc = new xwsStorage();

export default storageFunc;
