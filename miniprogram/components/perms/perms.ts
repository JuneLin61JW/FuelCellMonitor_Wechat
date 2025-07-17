// components/perms/perms.ts
import userStore from "../../store/userStore"

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: true
  },

  lifetimes: {
    attached: function(){
      const perms = userStore.data.perms
      const show = perms.indexOf(this.properties.value) != -1
      console.log("show:",show)
      this.setData({ show })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})