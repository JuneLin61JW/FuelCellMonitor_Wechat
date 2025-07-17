export const formatTime = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

const formatNumber = (n: number) => {
  const s = n.toString()
  return s[1] ? s : '0' + s
}
/**
 * 为一个 async 函数添加单例保护功能功能
 * @param {*} asyncFunc
 */
export function singleInstancePromise(asyncFunc: any) {
  let promiseInstance: undefined = undefined;
  return function(this: any, ...args: any) {
    if (promiseInstance) {
      return promiseInstance;
    }
    promiseInstance = asyncFunc
      .bind(this)(...args)
      .then((resp: any) => {
        promiseInstance = undefined;
        return Promise.resolve(resp);
      })
      .catch((e: any) => {
        promiseInstance = undefined;
        return Promise.reject(e);
      });
    return promiseInstance;
  };
}



export function getRandomId() {
  // 时间戳（9位） + 随机串（10位）
  return (
    Date.now().toString(32) +
    Math.random()
      .toString(32)
      .substring(2)
  );
}

/**
 * 深拷贝
 * @param {object} obj 需要copy的对象
 */
export function objectCopy(obj: any) {
  if (typeof obj == "undefined") {
    return obj;
  }
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 给URL添加参数
 * @param {object} obj 需要copy的对象
 */
export function addUrlParams(url: string = "", params: any) {
  url += url.indexOf("?") >= 0 ? "&" : "?";
  url += Object.keys(params)
    .map(key => {
      return `${key}=${params[key]}`;
    })
    .join("&");
  return url;
}
