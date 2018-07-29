import colors from 'colors/safe';

const index = {
  log(msg, title, showTime = true) {

    let dateTime = showTime ? colors.gray(`[${this.datetime()}] `) : '';

    if (this.isObject(msg) || this.isArray(msg)) {
      msg = JSON.stringify(msg);
    }

    console.log(dateTime + title + ' ' + msg);
  },
  error(msg, title, showTime = true) {
    let t = title ? colors.red(`[${title}]`) : '';
    this.log(msg, t, showTime);
  },
  success(msg, title, showTime = true) {
    let t = title ? colors.green(`[${title}]`) : '';
    this.log(msg, t, showTime);
  },
  warn(msg, title, showTime = true) {
    let t = title ? colors.yellow(`[${title}]`) : '';
    this.log(msg, t, showTime);
  },
  datetime(date = new Date(), format = 'HH:mm:ss') {
    let fn = (d) => {
      return ('0' + d).slice(-2);
    };
    if (date && this.isString(date)) {
      date = new Date(Date.parse(date));
    }
    const formats = {
      YYYY: date.getFullYear(),
      MM: fn(date.getMonth() + 1),
      DD: fn(date.getDate()),
      HH: fn(date.getHours()),
      mm: fn(date.getMinutes()),
      ss: fn(date.getSeconds())
    };
    return format.replace(/([a-z])\1+/ig, function (a) {
      return formats[a] || a;
    });
  },
  isString(obj) {
    return toString.call(obj) === '[object String]';
  },
  isObject(obj) {
    return toString.call(obj) === '[object Object]';
  },
  isArray(obj) {
    return Array.isArray(obj);
  },
  responeCdn(url,original){
    return {
      url,
      original
    }
  }
};

export default index
