import { httpRequest } from '../../utils/request'
const baseUrl = require('../base').allBaseUrl.Envs.host
import { UserInfo } from "./types"

/**
 * 登录成功后获取用户信息（昵称、头像、权限集合和角色集合）
 */
export function getUserInfo() {
  return httpRequest.get<UserInfo>(
    baseUrl + '/users/me',
  );
}

/**
 * 修改用户密码
 *
 * @param oldPwd
 * @param newPwd
 */
export function changeUserPassword(oldPwd: string, newPwd: string) {
  return httpRequest.put(
    baseUrl + '/users/changePwd',
    {
      oldPwd: oldPwd,
      newPwd: newPwd
    },
    {
      header:{

        'Content-Type':'application/x-www-form-urlencoded'
      },
    }
  );
}