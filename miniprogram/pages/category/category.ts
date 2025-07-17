// pages/category/category.ts
import { getIotCategoryPage } from "../../api/iot/category/index"
import { IotCategoryQuery,IotCategoryPageVO } from "../../api/iot/category/types"
import { Columns } from '../../components/table/data'
// 获取应用实例
const app = getApp<IAppOption>()
const SystemInfo = app.globalData.SystemInfo

const queryParams:IotCategoryQuery = {
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
  dataList: IotCategoryPageVO[],
  tableColumns: Columns[],
  getListLoading: boolean,
  queryParams: IotCategoryQuery,
}

type InitMethod = {
  handlequery(): void,
  searchCategory(): void,
  clearHandle(e: GlobalData.WxAppletsEvent): void,
  changeHandle(e: GlobalData.WxAppletsEvent): void,
  pageChange(e: GlobalData.WxAppletsEvent): void,
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
      title: "产品名称",
      key: "name",
      type: "action",
    }, {
      title: "数据源",
      key: "dataSourceLabel",
      type: "action",
    }],
    dataList: [],
    getListLoading: false,
    queryParams,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.setData({
      tableheight: (SystemInfo!.screenHeight * app.globalData.pixelRatio1) - 450,
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
  handlequery() {
    this.data.queryParams.pageNum = this.data.page;
    getIotCategoryPage(
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

  searchCategory() {
      this.data.queryParams.keywords = this.data.keywords;
      this.handlequery();
  },
})