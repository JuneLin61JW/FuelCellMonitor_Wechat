// pages/userInfo/userInfo.ts
import userStore from "../../store/userStore"
import { changeUserPassword } from "../../api/user/index"
import WxValidate from "../../utils/WxValidate"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    password: 
    {
      oldPwd:"",
      newPwd:"",
      confirmPwd:"",
    },
    validate: WxValidate.prototype,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    userStore.bind(this, '$user'),
    this.initValidate()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (typeof this.getTabBar === 'function') {
      this.getTabBar().setData({
        selected: 2
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  showDialog() {
    this.setData({ showWithInput: true });
  },

  cancelDialog() {
    this.setData({ showWithInput: false });
    console.log("已取消");
  },

  confirmDialog() {
    if (!this.data.validate.checkForm(this.data.password)) {
      const error = this.data.validate.errorList![0]
      console.log("error_+_+_+_+"+JSON.stringify(error))
      wx.showToast({
        title: error.msg,
        icon: "none",
        duration: 800
      })
      return;
    }
    this.setData({ 
      showWithInput: false 
    });
    console.log("已确认");
    console.log(this.data.password.oldPwd)
    console.log(this.data.password.newPwd)
    console.log(this.data.password.confirmPwd)
    changeUserPassword(this.data.password.oldPwd,this.data.password.newPwd).then(() => {
      wx.showToast({
        title: '成功',
        icon: 'success'
      })
    }).finally(() => {
      this.setData({
        password: {
          oldPwd: '',
          newPwd: '',
          confirmPwd: ''
        }
      })
    })
    
    
    
  },

  setPwd(e) {
    const pwd = this.data.password
    const type = e.detail.value
    switch (e.currentTarget.id) {
      case "old":
        {
          pwd.oldPwd = type;
          break;
        }
      case "new":
        {
          pwd.newPwd = type;
          break;
        }
      case "confirm":
        {
          pwd.confirmPwd = type;
          break;
        }    
      default:
        break;
    }
    this.setData({
      password: pwd
    })
  },

  clearPwd(e) {
    const pwd = this.data.password
    switch (e.currentTarget.id) {
      case "old":
        {
          pwd.oldPwd = ''
          break;
        }
      case "new":
        {
          pwd.newPwd = ''
          break;
        }
      case "confirm":
        {
          pwd.confirmPwd = ''
          break;
        }    
      default:
        break;
    }
    this.setData({
      password: pwd
    })
  },

  //表单参数验证
  initValidate(){
    const rules = {
      oldPwd: {
        required: true,
        rangelength: [6,16]
      },
      newPwd: {
        required: true,
        rangelength: [6,16]
      },
      confirmPwd: {
        required: true,
        rangelength: [6,16],
        equalTo: "newPwd"
      },
    }
    const messages = {
      oldPwd:{
        required: '请输入原密码',
        rangelength: '密码只能输入6~16位',
      },
      newPwd:{
        required: '请输入新密码',
        rangelength: '密码只能输入6~16位',
      },
      confirmPwd:{
        required: '请再次输入新密码',
        rangelength: '密码只能输入6~16位',
        equalTo: '两次密码输入不一致'
      },
    }
    // 创建实例对象
    this.data.validate = new WxValidate(rules, messages)
  },

  logout() {
    userStore.logout().then(() => {
      wx.clearStorageSync();
      wx.reLaunch({
        url: "/pages/login/login"
      })
    });
    
  },

})