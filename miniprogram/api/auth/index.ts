import { httpRequest } from '../../utils/request'
const baseUrl = require('../base').allBaseUrl.Envs.host
import { CaptchaResult, LoginData, LoginResult } from "./types";

/**
 * @description: 登录API
 * @return {*}
 */
export function loginApi(data: LoginData) {
  return httpRequest.post<LoginResult>(
    baseUrl + '/auth/login',
    data,
    {
      header:{
      'Content-Type':'application/x-www-form-urlencoded'
      }
    }
  )
}

/**
 * 注销API
 */
export function logoutApi() {
  return httpRequest.delete(
    baseUrl + "/auth/logout"
  )
}

/**
 * @description: 获取验证码
 * @return {*}
 */
export function getCaptchaApi() {
  return httpRequest.get<CaptchaResult>(
    baseUrl + "/auth/captcha",
  )
}
    
