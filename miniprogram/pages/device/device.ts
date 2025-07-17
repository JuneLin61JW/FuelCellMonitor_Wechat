// pages/device/device.ts
import { getIotDevicePage } from "../../api/iot/device/index"
import { IotDeviceQuery, IotDevicePageVO} from "../../api/iot/device/types"
import { Columns } from '../../components/table/data'
// 获取应用实例
const app = getApp<IAppOption>()
const SystemInfo = app.globalData.SystemInfo

const queryParams:IotDeviceQuery = {
  pageNum: 1,
  pageSize: 10,
}
type InitData = {
  page: number,
  total: number,
  tableheight: number,
  keywords: string,
  isEmpty: boolean,
  isScanBack: boolean,
  dataList: IotDevicePageVO[],
  tableColumns: Columns[],
  getListLoading: boolean,
  editStatus: boolean,
  queryParams: IotDeviceQuery,

  statusText: string,
  statusValue: [],
  statusVisible: boolean,
  statusPick: Object[],
}

type InitMethod = {
  handlequery(): void,
  searchdev(): void,
  scanNumber(): void,
  clearHandle(e: GlobalData.WxAppletsEvent): void,
  changeHandle(e: GlobalData.WxAppletsEvent): void,
  pageChange(e: GlobalData.WxAppletsEvent): void,
  onColumnChange(e: GlobalData.WxAppletsEvent): void,
  onPickerChange(e: GlobalData.WxAppletsEvent): void,
  onPickerCancel(e: GlobalData.WxAppletsEvent): void,
  onStatusPicker(e: GlobalData.WxAppletsEvent): void,
  handleClickAction(e: GlobalData.WxAppletsEvent): void,
}

Page<InitData,InitMethod>({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    total: 1,
    tableheight: 1000,
    keywords: '',
    isEmpty: false,
    isScanBack: false,
    // table 表头参数
    tableColumns: [{
      title: "车辆编号",
      key: "bicycleNum",
      type: "action"
    }, {
      title: "中控编号",
      key: "deviceName",
      type: "action"
    }, {
      title: "所属产品",
      key: "categoryName",
      type: "action"
    }, {
      title: "状态",
      key: "status",
      type: "action"
    }],
    queryParams,
    dataList: [],
    getListLoading: false,
    editStatus: false,

    statusText: '全部',
    statusValue: [],
    statusVisible: false,
    statusPick: [
      { label: '全部', value: '' },
      { label: '在线', value: '1' },
      { label: '离线', value: '0' },
    ],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    //console.log('system:',SystemInfo)
    //console.log("pixelRatio1",app.globalData.pixelRatio1)
    this.setData({
      tableheight: (SystemInfo!.screenHeight * app.globalData.pixelRatio1) - 550,
    })


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
    this.handlequery();
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


  clearHandle(e) {
    const { value } = e.detail;
    this.data.keywords = value;
  },

  changeHandle(e) {
    const { value } = e.detail;
    this.setData({
      keywords: value,
    });
    //console.log("keywords",this.data.keywords)
  },

  //页码改变事件
  pageChange(e){
    this.setData({
      page: e.detail.currentIndex
    })
    console.log("page:",this.data.page)
    this.handlequery();
    //console.log("页码改变时传到父组件的值", this.data.page);
  },

  scanNumber() {
    let that = this
    this.data.isScanBack = true;
    wx.scanCode({
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
          keywords: bicycleNo
        })
        that.searchdev();
      }
    })
  },

  handlequery() {
    this.data.queryParams.pageNum = this.data.page;
    getIotDevicePage(
      this.data.queryParams
    ).then(({data}) => {
      if (data.total > 0) {
        this.setData({
          dataList: data.list,
          total: data.total,
        })
      } else {
        this.setData({
          dataList: data.list,
          total: 0,
        })
      }
        //console.log("list",this.data.dataList)
        if (data.list.length == 0) {
          this.data.isEmpty = true;
        } else {
          this.data.isEmpty = false;
        }
        
    })
  },

  searchdev() {
      this.data.queryParams.keywords = this.data.keywords;
      this.handlequery();
  },

  onColumnChange(e) {
    //console.log('picker pick:', e);
  },
  

  onPickerChange(e) {
    const { value, label } = e.detail;

    console.log('picker change:', e.detail);
    this.setData({
      statusVisible: false,
      statusValue: value,
      statusText: label.join(' '),
    });
    this.data.queryParams.status = value.join(' ');
    this.handlequery();

  },

  onPickerCancel(e) {
    console.log(e, '取消');
    console.log('picker cancel:');
    this.setData({
      statusVisible: false,
    });
  },

  onStatusPicker() {
    this.setData({ statusVisible: true });
  },

  // 点击table的action区域
  handleClickAction(e) {
    console.log(e.detail.value)
    let str: string = ''
    const { type, index, item } = e.detail.value
    if (!item.status) {
      return;
    } else if (type === 'deviceName') {
      str = item.deviceName
    } else if (type === 'bicycleNum') {
      str = item.bicycleNum
    }
    if (str) {
      wx.showModal({
        title: str,
        content: '确定后，自动跳转监测页面',
        success (res) {
          if (res.confirm) {
            app.globalData.deviceId = str;
            wx.switchTab({
              url:'/pages/monitor/monitor'
            })
          } else if (res.cancel) {
            //console.log('用户点击取消')
          }
        }
      })
    }
    
  },
  
})