// components/pagination/pagination.ts
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    currentIndex: { //当前页码
      type: Number,
      value: 1
    },
    total: {
      type: Number,
      observer(newVal,oldVal) {
        if (newVal > 0) {
          this.setData({
            pageTotal: Math.ceil(newVal/10),
            show: true 
          })
          this.updateBtnDis();
        } else {
          this.setData({
            show: false
          })
        }
        
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    index: 1,
    pageTotal: 1,
    show: true,
    pageMask: false,
    prevBtnDis: true,
    nextBtnDis: true
  },

  lifetimes: {
   
 },

  /**
   * 组件的方法列表
   */
  methods: {

    //每次改变页码就调用该函数
    triggerParent: function () {

      // 通知父组件当前加载的页数

      // 自定义组件向父组件传值 
        const option = {
          currentIndex: this.data.index
        };
      // pagingChange 自定义名称事件，父组件中使用
      this.triggerEvent('pagingChange', option)
     
    },
    //开启页码弹窗
    showPagePopUp: function () {
      this.setData({
        pageMask: true
      })
    },
    //关闭页码弹窗
    hidePagePopUp: function () {
      this.setData({
        pageMask: false
      })
    },
    //更改页码点击事件
    onChangePage: function (e) {
      //console.log("更改页码事件：",e);
      this.setData({
        pageMask: false,
        index: e.currentTarget.dataset.index //点击的页数
      })

      // 先判断当前页数，是否需要更新disabled的状态
      this.updateBtnDis();

      this.triggerParent();
    
    },
    //上一页点击事件
    prevPage: function () {
      if(this.data.index <= 1) return; 
      let num = this.data.index - 1;
      this.setData({
        index: num
      })
      this.triggerParent();
      // 更新按钮状态
      this.updateBtnDis();
    },
    //下一页点击事件
    nextPage: function () {
      if(this.data.index >= this.data.pageTotal) return; 
      let num = this.data.index + 1;
      this.setData({
        index: num
      })

      this.triggerParent();

      // 更新按钮状态
      this.updateBtnDis();
    },

    //判断按钮是否为disabled
    updateBtnDis: function () {

      let index = this.data.index;
      let total = this.data.pageTotal;

      if(index == total && index == 1){ // 都为起始页和总页数都为1
        console.log('都为起始页和总页数都为1')
        this.setData({
          nextBtnDis: true,
          prevBtnDis: true
        })
      }else if (index == total && index != 1) { // 最后一页
        console.log('最后一页')
        this.setData({
          prevBtnDis: false,
          nextBtnDis: true
        })
      } else if (index == 1 && index < total){ // 第一页
        console.log('第一页')
        this.setData({
          prevBtnDis: true,
          nextBtnDis: false
        })
      } else if (index > total) { //当前页数大于总页数
        console.log('当前页数大于总页数')
        let isPreBtnDis = false
        if (total == 1) {
          isPreBtnDis = true
        } 
        this.setData({
          index: total,
          prevBtnDis: isPreBtnDis,
          nextBtnDis: true
        })
        this.triggerParent();
      }else{
        this.setData({
          prevBtnDis: false,
          nextBtnDis: false
        })
      }
    }
  }
})