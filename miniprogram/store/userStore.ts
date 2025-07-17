const create = require('mini-stores')
import {loginApi,logoutApi} from "../api/auth/index"
import {getUserInfo} from "../api/user/index"
import {LoginData} from "../api/auth/types"
import {UserInfo} from "../api/user/types"

class Store extends create.Store {

  data = {
    userId: 0,
    token: '',
    nickname: '',
    avatar: '',
    roles: [''],
    perms: [''],
    mobile: '',
  }

  login(loginData:LoginData) {
    return new Promise<void>((resolve, reject) => {
      loginApi(loginData).then((response) => {
        const { tokenType, accessToken } = response.data;
        this.data.token = tokenType + " " + accessToken; // Bearer eyJhbGciOiJIUzI1NiJ9.xxx.xxx
        //console.log("token",this.token);
        wx.setStorageSync('accessToken', this.data.token);
        this.update();
        resolve(); 
      }).catch((error) => {
        reject(error);
      });
    });
  }

  // 获取信息(用户昵称、头像、角色集合、权限集合)
  getInfo() {
    return new Promise<UserInfo>((resolve,reject) => {
      getUserInfo().then(({ data }) => {
        if (!data) {
          return reject("确认失败，请重新登录！")
        }
        if (!data.roles || data.roles.length <= 0) {
          reject("getUserInfo: roles must be a non-null array!")
        }
        this.data.userId = data.userId
        this.data.nickname = data.nickname
        this.data.avatar = data.avatar
        this.data.roles = data.roles
        this.data.perms = data.perms
        this.data.mobile = data.mobile
        //console.log('perms:',this.data.perms)
        //console.log('roles:',this.data.roles)
        resolve(data)
      }).catch((error) => {
        reject(error);
      })
    })
  }

  logout() {
    return new Promise<void>((resolve,reject) => {
      logoutApi().then(() => {
        wx.reLaunch({
          url: "/pages/login/login"
        })
        this.resetToken()
        resolve();
      }).catch((error) => {
        reject(error);
      })
    })
  }

  resetToken() {
    this.data.token = "";
    this.data.nickname = "";
    this.data.avatar = "";
    this.data.roles = [];
    this.data.perms = [];
  }
  
}

const userStore = new Store();
export default userStore;