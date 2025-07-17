// pages/monitor/monitor.ts
import mqtt from "../../utils/mqtt.min.js";
const url = require('../../api/base').allBaseUrl.Envs.mqtt;
import { getIotDeviceStatus} from '../../api/iot/monitor/index'
const app = getApp<IAppOption>()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    barheight: 0,
    circlebottom: 0,
    menubottom: 0,
    triggered: false,
    isOnline: '离线',
    StatusColor: '#d9d9d9',
    isScanBack: false,
    //mqtt
    client: mqtt.MqttClient,
    mqttStatus: '',
    subTopic: "",

    device: {
      status: 0,
      bicycleNum: '',
      deviceName: '',
    },

    CellData: 
    {
      version: 0,
      code: '0',
      
    },

    menulist:[
      {
        "id":"1",
        "url":"../../images/power-on.png",
        "title":"开启",
      },
      {
        "id": "2",
        "url": "../../images/power-off.png",
        "title": "关闭",
      },
      {
        "id": "3",
        "url": "../../images/reset.png",
        "title": "复位",
      },
      {
        "id": "4",
        "url": "../../images/登录.png",
        "title": "登录",
      },
    ],
    mainmodel:{
      "url": "../../images/菜单.png",
      "title": "",
    },
    

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const res = wx.getSystemInfoSync();
    const { screenHeight, safeArea: {bottom} } = res;
    console.log('screenHeight',screenHeight)
    console.log('bottom',bottom)
    if (screenHeight && bottom) {
      let safeBottom = screenHeight - bottom;
      console.log('safeBottom:',safeBottom)
      this.setData({
        barheight: 160 + safeBottom,
        circlebottom: 135 + safeBottom,
        menubottom: 125 + safeBottom,
      })
    }
    console.log('barheight:',this.data.barheight)
    console.log('menubottom:',this.data.menubottom)
    this.connect()
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
        selected: 0
      })
    };
    if (this.data.isScanBack) {
      this.data.isScanBack = false
    }

    console.log("全局变量deviceId:",app.globalData.deviceId);
    if (app.globalData.deviceId) { //判断全局变量里的设备号是否为空，不为空则进行查询，并重新赋值为空
      
      this.setData({
        subTopic: app.globalData.deviceId
      });
      this.searchToSub();
      app.globalData.deviceId = ''; 
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    /*if (!this.data.isScanBack) {
      this.disconnect();
    }*/
    
    console.log("页面隐藏")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.unsubscribes(this.data.device.deviceName);
    this.disconnect();
    console.log("页面卸载")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.onScrollRefresh();
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

  changeHandle(e) {
    const { value } = e.detail;
    this.setData({
      subTopic: value
    });
    //console.log("subTopic:",this.data.subTopic)
  },

  clearHandle(e) {
    const { value } = e.detail;
    this.data.subTopic = value;
    //console.log("subTopic:",this.data.subTopic)
  },


  //连接mqtt
  connect() {
    this.setMqttStatus("尝试连接中")
    const options = {
      // 认证信息
      clientId: "emqx_wechat_" + Math.random().toString(16).substring(2, 8),
      username: "user", //用户名 不用的话什么也不用填
      password: "password", //密码 不用的话什么也不用填
      reconnectPeriod: 10000, // 重连时间间隔,设置为 0 以后将取消自动重连
    };

    try {
      this.data.client = mqtt.connect(url, options);

      this.data.client?.on("connect", () =>{
        this.setMqttStatus('连接成功，请搜索设备号进行订阅') ;
      })

      this.data.client?.on('message', (topic, payload) => {
        const msg = JSON.parse(payload.toString())
        
        this.setData({
          CellData: msg
        })
        console.log(`收到消息 - Topic: ${topic}，Payload: ${payload}`)
        //console.log("CellData",this.data.CellData.id)
      });

      this.data.client?.on('error', (error: any) => {      
        this.setMqttStatus('出现错误：' + error) ;
      });

      this.data.client?.on('reconnect', () => {
        this.setMqttStatus('网络超时或通讯地址错误，重连中...') ;
      });

      this.data.client?.on('offline', ()=> {         
        this.setMqttStatus('已掉线') ;
      });

      this.data.client?.on('close', ()=> {
        this.setMqttStatus("连接已关闭")
      });

      this.data.client?.on('disconnect', (packet)=> {
        this.setMqttStatus("关闭连接中...")
        console.log('关闭连接中，报文:' + packet)
      });

    } catch (error) {
      console.log("mqtt.connect error",error);
    }   
  },

  //订阅
  subscribes(topic:string) {
    if (this.data.client) {
      this.data.client.subscribe("device/" + topic, (error,granted) => {
        if (error) {
          this.setMqttStatus('订阅失败')
          console.log("订阅失败,"+error)
        } else {
          this.setMqttStatus("订阅成功")
          console.log(granted[0].topic +"订阅成功")
        }
      })
    } else {
      this.setMqttStatus("请先进行连接")
      console.log('请先进行连接')
    }   
  },

  //取消订阅
  unsubscribes(topic:string) {
    if (this.data.client) {
      this.data.client.unsubscribe("device/" + topic, (error: any) => {
        if (!error) {
          this.setMqttStatus("取消订阅成功")
          //console.log("取消订阅成功")
        } else {
          this.setMqttStatus("取消订阅失败")
          //console.log("取消订阅失败")
        }
      });
    } else {
      this.setMqttStatus("请先进行连接")
      console.log('请先进行连接')
    }
  },

  //断开连接
  disconnect() {
    this.data.client?.end(true);
    this.data.client = null;
    this.setMqttStatus('成功断开连接')   
  },

  setMqttStatus(status: string) {
    this.setData({
      mqttStatus: status
    })
    console.log(this.data.mqttStatus)
  },

  resetDevice() {
    this.setData({
      device:{
        status: 0,
        bicycleNum: '',
        deviceName: '',
      },
    });
  },

  getDevice() {
    getIotDeviceStatus(this.data.subTopic).then(({data}) => {
      if (data !== null && (data.deviceName === this.data.subTopic || data.Num === this.data.subTopic)) {
        this.unsubscribes(this.data.device.deviceName);
        this.setData({
          CellData: {
            version: 0,
            code: '0',
            
          }
        });
        this.setDevStatus(data.status);
        this.subscribes(data.deviceName);
        wx.showToast({
          title: '设备搜索成功',
          icon: 'success',
          duration: 1000
        });
      } else {
        wx.showToast({
          title: '暂无此设备，请检查输入',
          icon: 'none',
          duration: 3000
        });
      }
      console.log("device:",this.data.device);
    });  
  },

  searchToSub() {
    if (this.data.subTopic) {
      this.getDevice();
    } else {
      wx.showToast({
        title: '请检查输入',
        icon: 'none',
        duration: 3000
      });
    }
  },

  menuItemClick(res) {
    //console.log(res);
    //获取点击事件的信息
    let that = this.data
    let clickInfo = res.detail.iteminfo 
    //console.log(clickInfo);
    //console.log(clickInfo.id)
    switch (clickInfo.id) {
      case '1':
        {
          wx.showModal({
            title: '发送请求',
            content: '请确认是否发送【开机】命令请求',
            success (res) {
              if (res.confirm) {
                
              } else if (res.cancel) {
                //console.log('用户点击取消')
              }
            }
          })         
          break;
        }
      case '2':
        {
          wx.showModal({
            title: '发送请求',
            content: '请确认是否发送【关机】命令请求',
            success (res) {
              if (res.confirm) {
                
              } else if (res.cancel) {
                //console.log('用户点击取消')
              }
            }
          })
          break;
        }
      case '3':
        {
          wx.showModal({
            title: '发送请求',
            content: '请确认是否发送【复位】命令请求',
            success (res) {
              if (res.confirm) {
                
              } else if (res.cancel) {
                //console.log('用户点击取消')
              }
            }
          })
          break;
        }
      case '4':
        {
          wx.showModal({
            title: '发送请求',
            content: '请确认是否发送【登录】命令请求',
            success (res) {
              if (res.confirm) {
                
              } else if (res.cancel) {
                //console.log('用户点击取消')
              }
            }
          })
          break;
        }   
      default:
        break;
    }
  },

  setDevStatus(status: number) {
    if (status) {
      this.setData({
        isOnline: '在线',
        StatusColor: '#38b48b'
      })
    } else {
      this.setData({
        isOnline: '离线',
        StatusColor: '#d9d9d9'
      })
    }
  },

  //用户下拉动作
  onScrollRefresh() {
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: 'Loading...'
    })
    if (this.data.subTopic) {
      getIotDeviceStatus(this.data.device.deviceName).then(({data}) => {
        if (data !== null && data.deviceName === this.data.device.deviceName) {
          this.setData({
            triggered: false,
          });
          wx.hideLoading();
          wx.hideNavigationBarLoading();
          wx.stopPullDownRefresh();
        }
        //console.log("device:",this.data.device)
        this.setDevStatus(data.status);
      });
    } else {
      this.setData({
        triggered: false,
      });
      wx.hideLoading();
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      wx.showToast({
        title: '搜索框不能为空',
        icon: 'none',
        duration: 3000
      });
    }
  },

  scanNumber() {
    let that = this
    this.data.isScanBack = true;
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        console.log(res);
        let bicycleNo = res.result
        let str = 'bicycleNo='
        if (bicycleNo.includes(str)) {
          let index = bicycleNo.lastIndexOf(str)
          bicycleNo = bicycleNo.substring(index+str.length,bicycleNo.length)
        }
        console.log(bicycleNo);
        that.setData({
          subTopic: bicycleNo
        })
        that.searchToSub()
      }
    })
  },

})