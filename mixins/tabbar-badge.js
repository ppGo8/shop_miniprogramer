import {
  mapGetters
} from 'vuex'

// 导出一个mixin对象,在4个tabbar页面中引用该方法
// 功能:在各个页面显示的时候,为购物车添加右上角的徽标
// 说明:minin对象的生命周期函数会和组件的声明周期函数同时加载

export default {
  computed: {
    ...mapGetters('m_cart', ['total'])
  },
  watch:{
    total(){
      // 当total的数量发生变化,调用方法设置页面徽标
       this.setBdage()
    }
  },
  onShow() {
    // 页面展示时,调用setBdage方法设置页面徽标
    this.setBdage()
  },
  methods: {
    setBdage() {
      // 调用uniapp提供的方法 设置tabbar的右上角的徽标
      uni.setTabBarBadge({
        //下标为2的tababr
        index: 2,
        // 显示的内容
        text: this.total + ' ' // 要求是字符串形式,因此拼串
      })
    }
  }
}