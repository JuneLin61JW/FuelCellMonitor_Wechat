/**
 * @description: HTTP请求方法枚举
 */
export enum HttpMethod {
	GET = 'GET',
	POST = 'POST',
	OPTIONS = 'OPTIONS',
	PUT = 'PUT',
  DELETE = 'DELETE',
}

/**
 * @description: HTTP请求配置
*/
interface RequestConfig {
	/** API路径 */
	url?: string
	/** Method类型 */
	method?: HttpMethod
	/** 接口返回数据 */
	data?: any
	/** 无TOKEN触发异常捕获时，是否执行异常逻辑 */
	needToken?: boolean
	/** Header头部 */
	header?: object
	/** 返回的数据格式 */
	dataType?: string
}

/**
 * @description: 声明业务数据类型
*/



export interface MyAwesomeData<T> {
	code: number
	msg: string
	data: T
}

class HttpRequest {
	private static instance: HttpRequest
	private constructor() { }
	/** 请求函数(单例模式)
	*
	* **注意：**
	* `method`需使用`HttpMethod`枚举类，切勿自行定义
	*
	* **示例代码**
	* ```js
	 HttpRequest.getInstance().request({
		 url: '/Api',
		 method: HttpMethod.GET
	 })
	* ```
	*/
	public static getInstance(): HttpRequest {
		if (!this.instance) {
			this.instance = new HttpRequest()
		}
		return this.instance
	}

	// 处理请求异常状态码
	private handerErrorStatus(statusCode: number, msg: string) {
		if (statusCode === 502 || statusCode === 503) {
			msg = '服务器开小差了~'
		}
		wx.showToast({
			title: `${msg}`,
      icon: 'none',
      duration: 2000
		})
		return msg
	}

	// 处理请求异常
	private handerError(err: { errMsg: string }) {
		let msg = `请求异常`
		if (/timeout/.test(err.errMsg)) {
			msg = '请求超时'
		}
		wx.showToast({
			title: msg,
      icon: 'none',
      duration: 2000
		});
		return msg
	}


  
	// 服务器接口请求
	public request<T>(requestConfig: RequestConfig): Promise<MyAwesomeData<T>> {
		let _this = this
		return new Promise((resolve, reject) => {
			// 默认header
      const contentType = requestConfig.method === 'GET' ? 'application/json':'application/x-www-form-urlencoded';
      const token = wx.getStorageSync('accessToken')
      //console.log("header",contentType)
			const header = {
        'Content-Type': contentType,
        'Authorization': token
      }
      let errMsg = '';
			wx.request({
				method: requestConfig.method,
        url: `${requestConfig.url}`,
				data: requestConfig.data,
				header: Object.assign(header, requestConfig?.header),
				dataType: !requestConfig.dataType ? 'json' : '其他',
				success: function ( res: any ) {
					// console.log('发送返回:', res) //res:{cookies, data, header, statusCode}
          const { code, msg } = res.data
					/** 接口请求成功*/
					if (code == '00000') {
            console.log("res.data",res.data)
						resolve(res.data)
					} else if (code === 'A0230') {
						// 未授权
						wx.showModal({
							title: '登录失效',
							content: '登录失效，请重新登录',
						}).then(resModa => {
							if (resModa.confirm) {
                //清除store变量，返回登录页
                wx.clearStorage()
                wx.reLaunch({
                  url:"/pages/login/login"
                })
               }
						})
						reject({ msg })
					} else {
						//非200及401状态码-数据处理
            errMsg = _this.handerErrorStatus(res.statusCode, msg)
						reject({  msg: errMsg,  })
          }
          
				},
				fail: err => {
					errMsg = _this.handerError(err)
          reject({ msg: errMsg })
        },
			})
		})
	}

	/**
	 * @description: get请求函数
	 * @param {string} url 请求地址
	 * @param {Object} data 请求参数
	 * @param {RequestConfig} OtherConfig request其他配置
	 * @return {*}
	 */
	public get<T>(url: string, data?: Object, OtherConfig?: RequestConfig) {
		return this.request<T>({ method: HttpMethod.GET, url, data, ...OtherConfig })
	}

	/**
	 * @description: post请求函数
	 * @param {string} url 请求地址
	 * @param {Object} data 请求参数
	 * @param {RequestConfig} OtherConfig request其他配置
	 * @return {*}
	 */
	public post<T>(url: string, data?: Object, OtherConfig?: RequestConfig) {
		return this.request<T>({ method: HttpMethod.POST, url, data, ...OtherConfig })
	}

	/**
	 * @description: delete请求函数
	 * @param {string} url 请求地址
	 * @param {Object} data 请求参数
	 * @param {RequestConfig} OtherConfig request其他配置
	 * @return {*}
	 */
	public delete<T>(url: string, data?: Object, OtherConfig?: RequestConfig) {
		return this.request<T>({ method: HttpMethod.DELETE, url, data, ...OtherConfig })
	}

	/**
	 * @description: put请求函数
	 * @param {string} url 请求地址
	 * @param {Object} data 请求参数
	 * @param {RequestConfig} OtherConfig request其他配置
	 * @return {*}
	 */
	public put<T>(url: string, data?: Object, OtherConfig?: RequestConfig) {
		return this.request<T>({ method: HttpMethod.PUT, url, data, ...OtherConfig })
	}

}

export const httpRequest = HttpRequest.getInstance()