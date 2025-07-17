// app.ts
import userStore from "./store/userStore"
App<IAppOption>({
  globalData: {
    pixelRatio1:2,
    deviceId:''
  },
  onLaunch() {
    //初始化加载，先判断用户登录状态
    //小程序启动
    if (wx.getStorageSync('accessToken')) {
      userStore.getInfo().then(() => {
        wx.switchTab({
          url: '/pages/Info/Info'
        })
      })
    } else {
      wx.reLaunch({
          url: 'pages/login/login'
      })
    }
    //wx.getSystemInfoSync()得到的距离单位是为px
    const SystemInfo = wx.getSystemInfoSync()
    let pixelRatio1 = 750 / SystemInfo.windowWidth
    this.globalData.SystemInfo = SystemInfo
    this.globalData.pixelRatio1 = pixelRatio1

  },
  onShow() {
    
  },
})