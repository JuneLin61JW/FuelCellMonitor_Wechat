// npm install mqtt -S
import mqtt from './mqtt.min.js';
// 连接字符串, 通过协议指定使用的连接方式
// ws 未加密 WebSocket 连接
// wss 加密 WebSocket 连接
// mqtt 未加密 TCP 连接
// mqtts 加密 TCP 连接
// wxs 微信小程序连接
// alis 支付宝小程序连接

export class MQTT {
  url: string; // mqtt地址
  client: any ;
  connectStatus: string;
  payload: any;
  constructor() {
    //url:'wxs://localhost:8084/mqtt'
    this.url = 'wxs://localhost:1234/mqtt';
    this.connectStatus = '';
  }
 
  //连接mqtt
  connect() {
    const options = {
      // 认证信息
      clientId: "emqx_wechat_" + Math.random().toString(16).substring(2, 8),
      username: "user", //用户名 不用的话什么也不用填
      password: "password", //密码 不用的话什么也不用填
      reconnectPeriod: 4000, // 重连时间间隔
    };

    try {
      this.client = mqtt.connect(this.url, options);

      this.client?.on("connect", ()=> {
        this.connectStatus = '已连接';
        console.log(this.connectStatus);
      });

      this.client?.on('message', (topic, payload) => {
        this.payload = payload;
        console.log(`收到消息 - Topic: ${topic}，Payload: ${payload}`)
      });

      this.client?.on('error', (error: any) => {      
        this.connectStatus = '客户端出现错误：' + error;
        console.log(this.connectStatus);
      });

      this.client?.on('reconnect', () => {
        this.connectStatus = '网络超时或通讯地址错误，重连中';
        console.log(this.connectStatus);
      });

      this.client?.on('offline', ()=> {         
        this.connectStatus = '已掉线';
        console.log(this.connectStatus);
      });

      this.client?.on('close', ()=> {
        console.log('连接已关闭')
      });

      this.client?.on('disconnect', (packet)=> {
        console.log('关闭连接中，报文:' + packet)
      });

    } catch (error) {
      console.log("mqtt.connect error",error);
    }   
    return this;
  }

  //断开连接
  disconnect() {
    this.client?.end(true);
    this.client = null;
    console.log('已主动断开连接')
  };

  //订阅
  subscribes(topic: string) {
    if (this.client) {
      this.client.subscribe(topic, (error: any) => {
        if (!error) {
          console.log('订阅成功');
          this.connectStatus = '订阅成功';
        } else {
          console.log('订阅失败');
          this.connectStatus = '订阅失败';
        }
      });
    } else {
      console.log('请先进行连接')
    }
  };

  //取消订阅
  unsubscribes(topic: string) {
    if (this.client) {
      this.client.unsubscribe(topic, (error: any) => {
        if (!error) {
          console.log(topic, '取消订阅成功');
        } else {
          console.log(topic, '取消订阅失败');
        }
      });
    } else {
      console.log('请先进行连接')
    }
    return this;
  }
}

export const mq = new MQTT();


 