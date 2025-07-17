// pages/more/more.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img1: '/images/log.png',
    img2: '/images/device.png',
    img3: '/images/product.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

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
        selected: 1
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

  onClick(e) {
    let item = e.currentTarget.dataset.id
    //console.log(item);
    switch (item) {
      case "1":
        {
          wx.navigateTo({
            url: '/pages/devlog/devlog'
          })
          break;
        }
      case "2":
        {
          wx.navigateTo({
            url: '/pages/device/device'
          })
          break;
        }
      case "3":
        {
          wx.navigateTo({
            url: '/pages/category/category'
          })
          break;
        }
      case "4":
        {

          break;
        }
      default:
        break;
    }
  },
})