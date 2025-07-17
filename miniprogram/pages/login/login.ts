// login.ts
import { getCaptchaApi } from "../../api/auth/index"
import userStore from "../../store/userStore"
import WxValidate from "../../utils/WxValidate"

Page({
  data: {
    loginData: {
      username:"",
      password:"",
      verifyCodeKey: "",
      verifyCode:"",
    },
    captchaBase64: '../../images/加载失败.png',
    validate: WxValidate.prototype,
  },

  onLoad() {
    userStore.bind(this, '$user'),
    this.initValidate()
    
  },

  onReady() {
    this.getCaptcha();
  },
  

    
  getCaptcha() {
    getCaptchaApi().then(({ data }) => {
      const { verifyCodeBase64, verifyCodeKey } = data;     
      this.setData({
        captchaBase64:verifyCodeBase64,
        ['loginData.verifyCodeKey']:verifyCodeKey,
      })
      console.log(data);

    }).catch(() => { 
      this.setData({
        captchaBase64: '../../images/加载失败.png'
      })
      //console.log("captcha error:",this.data.captchaBase64)
    });
  },

  formSubmit: function (e: any) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    this.setData({
      ['loginData.username']:e.detail.value.username,
      ['loginData.password']:e.detail.value.password,
      ['loginData.verifyCode']:e.detail.value.verifyCode,
    })
    
    //console.log("loginData:",this.data.loginData);
    if (!this.data.validate.checkForm(e.detail.value)) {
      const error = this.data.validate.errorList![0]
      console.log("error_+_+_+_+"+JSON.stringify(error))
      wx.showToast({
        title: error.msg,
        icon: "none",
        duration: 800
      })
      return;
    }
    
    userStore.login(this.data.loginData).then(() => {
      userStore.getInfo().then(() => {
        wx.switchTab({
          url: '/pages/Info/Info'
        })
      })     
    }).catch(() => {
      this.getCaptcha()
    })
    
  },
  formReset: function () {
    console.log('form发生了reset事件')
  },

  //表单参数验证
  initValidate(){
    const rules = {
      username: {
        required: true,
      },
      password: {
        required: true,
        rangelength: [6,16]
      },
      verifyCode:{
        required: true,
      },
    }
    const messages = {
      username:{
        required: '用户名不能为空',
      },
      password:{
        required: '密码不能为空',
        rangelength: '密码只能输入6~16位',
      },
      verifyCode:{
        required: '验证码不能为空',
      },
    }
    // 创建实例对象
    this.data.validate = new WxValidate(rules, messages)
    
  },





  


});
