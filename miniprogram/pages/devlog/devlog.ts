// pages/devlog/devlog.ts
import { getUdpPage } from "../../api/iot/devlog/devlog_hh/index"
import { UdpQuery,UdpPageVO } from "../../api/iot/devlog/devlog_hh/types"
import { Columns } from '../../components/table/data'
const queryParams:UdpQuery = {
  pageNum: 1,
  pageSize: 10,
}
const app = getApp<IAppOption>()
const SystemInfo = app.globalData.SystemInfo

type InitData = {
  page: number,
  total: number,
  tableheight: number,
  keywords: string,
  isEmpty: boolean,
  isScanBack: boolean,
  dateText: string,
  dateValue: [],
  dateVisible: boolean,
  timescope: Object[],
  dataList: UdpPageVO[],
  tableColumns: Columns[],
  getListLoading: boolean,
  queryParams: UdpQuery,
}

type InitMethod = {
  handlequery(): void,
  searchlog(): void,
  scanNumber(): void,
  clearHandle(e: GlobalData.WxAppletsEvent): void,
  changeHandle(e: GlobalData.WxAppletsEvent): void,
  pageChange(e: GlobalData.WxAppletsEvent): void,
  searchfault(e: GlobalData.WxAppletsEvent): void,
  onColumnChange(e: GlobalData.WxAppletsEvent): void,
  onPickerChange(e: GlobalData.WxAppletsEvent): void,
  onPickerCancel(e: GlobalData.WxAppletsEvent): void,
  onTimePicker(e: GlobalData.WxAppletsEvent): void,
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
    dateText: '15分钟',
    dateValue: [],
    dateVisible: false,
    timescope: [
      { label: '15分钟', value: '15' },
      { label: '1小时', value: '60' },
      { label: '3小时', value: '180' },
      { label: '24小时', value: '1440' },
      { label: '7天', value: '10080' },
    ],
    tableColumns: [
      {
        title: "id",
        key: "id",    
        width: "20%"  
      },
      {
        title: "时间",
        key: "createTime",   
        width: "20%"     
      },
      {
        title: "数据",
        key: "data",       
        width: "60%"  
      }
    ],
    queryParams,
    dataList: [],
    getListLoading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
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
    this.data.queryParams.timeValue = 15;
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
        that.searchlog();
      }
    })
  },

  handlequery() {
    this.data.queryParams.pageNum = this.data.page;
    getUdpPage(
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
        //console.log("list",data.list)
        if (data.list.length == 0) {
          this.data.isEmpty = true;
        } else {
          this.data.isEmpty = false;
        }
        
    })
  },

  searchlog() {
      this.data.queryParams.keywords = this.data.keywords
      this.handlequery();
  },

  searchfault(e) {
    //console.log('fault:',e)
    let fault = e.detail.value
    this.data.queryParams.fault = fault   
    this.handlequery()
  },
  
  onColumnChange(e) {
    //console.log('picker pick:', e);
  },
  

  onPickerChange(e) {
    const { value, label } = e.detail;

    console.log('picker change:', e.detail);
    this.setData({
      dateVisible: false,
      dateValue: value,
      dateText: label.join(' '),
    });
    this.data.queryParams.timeValue = value.join(' ');
    this.handlequery();

  },

  onPickerCancel(e) {
    console.log(e, '取消');
    console.log('picker cancel:');
    this.setData({
      dateVisible: false,
    });
  },

  onTimePicker() {
    this.setData({ dateVisible: true });
  },

})