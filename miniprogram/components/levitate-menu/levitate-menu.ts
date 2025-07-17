// components/levitate-menu/levitate-menu.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    mainmodel: {
      type: Object,
      value: {}
    },
    menulist: {
      type: Object,
      value: []
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    flag:"visibility: hidden;"		//设置隐藏且占位
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showclick:function(){
      //console.log("showclick")
      if (this.data.flag) {
        this.setData({
          flag: '',
        })
      } else {
        this.setData({
          flag: 'visibility: hidden;',
        })
      }
      //console.log(this.data.flag)
    },
    itemclick:function(e){
      this.showclick();
      console.log(e.currentTarget.dataset);
      let info = e.currentTarget.dataset.item;
      if (info){
        this.triggerEvent('menuItemClick', {
            "iteminfo":info
        })
      }
    }
  }
})