const validators = {
  checkEmpty: (value, callback) => {
    if (value == null || value == "") {
      callback(new Error("不能为空噢"));
    } else {
      callback();
    }
  },

  checkNumber: (value, callback) => {
    if (value != null && value != "" && !/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value)) {
      callback(new Error("请输入数字"));
    } else {
      callback();
    }
  },

  checkInteger: (value, callback) => {
    if (value != null && value != "" && !/^-?\d+$/.test(value)) {
      callback(new Error("请输入整数"));
    } else {
      callback();
    }
  },

  checkMobile: (value, callback) => {
    if (value != null && value != "" && !(value.length == 11 && /^(1[0-9][0-9]\d{8})$/.test(value))) {
      callback(new Error("请输入正确的手机号码"));
    } else {
      callback();
    }
  },

  checkEmail: (value, callback) => {
    if (
      value != null &&
      value != "" &&
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
        value
      )
    ) {
      callback(new Error("请输入正确的邮箱地址"));
    } else {
      callback();
    }
  },

  checkSpace: (value, callback) => {
    if (value != null && value != "" && !/^\S+$/.test(value)) {
      callback(new Error("不能带有空格"));
    } else {
      callback();
    }
  }
};
/* 多个验证
 * valueArray = [{
 *  checkName: "checkMobile",
 *  value: "18000000000",
 *  error: "手机号码错啦啊"
 * }]
 */
const validatorAll = function(valueArray) {
  return new Promise((resolve, reject) => {
    for (let obj of valueArray) {
      validators[obj.checkName](obj.value, err => {
        if (err) {
          let error = obj.error ? obj.error : err.message;
          reject(error);
        }
      });
    }
    resolve();
  });
};

export { validators, validatorAll };
