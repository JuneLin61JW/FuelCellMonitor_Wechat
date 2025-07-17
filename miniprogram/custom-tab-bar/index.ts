// custom-tab-bar/index.ts
Component({
  data: {
    selected: 0,
    color: "#afafaf",
    selectedColor: "#0099f6",
    backgroundColor: "#F7F8F8",
    list: [
      {
        pagePath: "/pages/monitor/monitor",
        iconPath: "/images/监测.png",
        selectedIconPath: "/images/监测-蓝.png",
        text: "监测",
      },
      {
        pagePath: "/pages/more/more",
        iconPath: "/images/更多.png",
        selectedIconPath: "/images/更多-蓝.png",
        text: "更多",
      },
      {
        pagePath: "/pages/Info/Info",
        iconPath: "/images/我的.png",
        selectedIconPath: "/images/我的-蓝.png",
        text: "我的"
      },
    ]
  },

  attached() {
  },  

  methods: {
    switchTab(e) {
      // console.log(e);
      const data = e.currentTarget.dataset;
      const url = data.path
      //console.log(url);
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})