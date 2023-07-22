export default {
  // 开启命名空间
  namespaced: true,
  // 数据
  state: () => ({
    address: JSON.parse(uni.getStorageSync('address') || '{}'),
  }),
  
  // 方法
  mutations: {
    // 更新收获地址
    updateAddress(state, address) {
      state.address = address
      
      this.commit('m_user/saveAddressToStorage')
    },
    // 持久化存储address
    saveAddressToStorage(state){
      uni.setStorageSync('address',JSON.stringify(state.address))
    }
  },
  // 计算属性
  getters: {
    addstr(state){
      // 判断该数组是否为空
      if(!state.address.provinceName) return '' 
      return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
    }
  },

}