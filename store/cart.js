export default {
  namespaced: true,
  actions: {},
  mutations: {
    // 方法:将商品对象加入到购物车当中
    addToCart(state, goods) {
      // 判断购物车当中是否有已经有了这个商品
      // find方法:返回第一个满足条件的数组值,若没有返回undefined
      // find方法:第一个函数的x是遍历的数组的每一个值 
      const findResult = state.cart.find((x) => x.goods_id === goods.goods_id)
      // console.log(findResult);
      if (!findResult) {
        // 购物车没有这个商品
        state.cart.push(goods)
      } else {
        // 购物车有这个商品,将这个商品的数量+1
        findResult.goods_count++
      }
      // console.log(state.cart);
      // 在Mutations中调用自己的方法,也需要使用commit
      this.commit('m_cart/saveToStorage')
    },
    // 更新购物车中商品的勾选状态;mutations中的方法可以接受两个参数:第一个是state固定的，第二个是传过来的数值
    updateGoodsState(state, goods) {
      // 首先在数组中查找是否有这个商品
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      if (findResult) {
        findResult.goods_state = goods.goods_state
        this.commit('m_cart/saveToStorage') // 本地存储
      }
    },
    // 更新商品的数量
    updateGoodsCount(state, goods) {
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      if (findResult) {
        findResult.goods_count = goods.goods_count
        this.commit('m_cart/saveToStorage') // 本地存储
      }
    },
    // 根据id删除对应的商品
    removeGoodsById(state, goods_id) {
      state.cart = state.cart.filter(x => x.goods_id !== goods_id)
      this.commit('m_cart/saveToStorage') // 本地存储
    },
    // 更新购物车中所有商品的勾选状态
    updateAllGoodsState(state,newState){
      state.cart.forEach( x => x.goods_state = newState)
      this.commit('m_cart/saveToStorage') // 本地存储
    },
    // 定义本地存储方法,供Mutations自己调用
    saveToStorage(state) {
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    },
  },
  // 此处,state写成对象也可以
  state: () => ({
    // 购物车数组,用来存储购物车中每个商品的信息对象
    // 包含6个属性:goods_id,goods_name,goods_price,goods_count,goods_small_logo,goods_state
    cart: JSON.parse(uni.getStorageSync('cart') || '[]'),
  }),
  getters: {
    // 购物车中所有商品的总数量
    total(state) {
      // let goodsTotalCount = 0
      // state.cart.forEach(x => goodsTotalCount += x.goods_count)
      // return goodsTotalCount
      
      // 改造上述代码,使用reduce实现
      return state.cart.reduce((total,item)=> total+=item.goods_count,0) 
    },
    // 购物车中已勾选的商品的总数量
    checkedCount(state) {
      return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0)
    },
    // 已勾选商品的总价格
    checkedGoodsAmount(state){
      return state.cart.filter(x => x.goods_state ).reduce((total,item)=> total += item.goods_price * item.goods_count,0).toFixed(2)
    }
  },


}