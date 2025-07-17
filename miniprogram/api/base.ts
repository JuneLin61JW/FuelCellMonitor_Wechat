/**
 * 获取小程序版本信息
 * 值有：develop(开发版)、trial(体验版)、release(正式版)
*/
const accountInfo = wx.getAccountInfoSync()
const envVersion = accountInfo.miniProgram.envVersion || 'release'
console.log("小程序版本:",envVersion)

/**
   * 服务器
  */
const Envs = {
  develop: {
    host: 'http://192.168.0.175:1111',
    mqtt: 'wxs://192.168.0.175:2222/mqtt'
  },
  trial: {
    host: 'https://xxx.com/',
    mqtt: 'wxs://xxx.com/mqtt'
  },
  release: {
    host: 'https://xxx.com/prod-api',
    mqtt: 'wxs://xxx.com/mqtt'
  },
}

export class allBaseUrl {
  /**
   * 服务器
  */
  static Envs = Envs[envVersion]
}

export interface PageResult<T> {
  /**
   * 数据列表
   */
  list: T;
  /**
   * 数据总数
   */
  total: number;
}

/**
 * 分页查询参数
 */
export interface PageQuery {
  pageNum: number;
  pageSize: number;
}