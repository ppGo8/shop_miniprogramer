// 1.引入包
import Vue from 'vue'
import Vuex from 'vuex'
import moduleCart from '@/store/cart.js'
import moduleUser from '@/store/user.js'
// 2.使用插件
Vue.use(Vuex)  

// 3.创建store对象,模块化编程后续会导入
const store = new Vuex.Store({  // 注意,第二个Store要大写
  // 注意，这里是modules,要写s
  modules: {
    // 对象的key不要写任何引号
    m_cart : moduleCart,
    m_user: moduleUser,
  }
})

// 4.默认暴露
export default store