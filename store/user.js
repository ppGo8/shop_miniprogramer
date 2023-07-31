export default {
  // 开启命名空间
  namespaced: true,
  // 数据
  state: () => ({
    address: JSON.parse(uni.getStorageSync('address') || '{}'),
    token: uni.getStorageSync('token') || '',
    userinfo: JSON.parse(uni.getStorageSync('userinfo') || '{}'),
    // 重定向的object对象
    redirectInfo: null,
  }),

  // 方法
  mutations: {
    // 更新收获地址
    updateAddress(state, address) {
      state.address = address
      this.commit('m_user/saveAddressToStorage')
    },
    // 更新用户信息
    updateUserInfo(state, userinfo) {
      state.userinfo = userinfo
      this.commit('m_user/saveUserInfoToStorage')
    },
    // 更新用户的Token
    updateToken(state, token) {
      state.token = token
      this.commit('m_user/saveTokenToStorage')
    },
    // 持久化存储Token
    saveTokenToStorage(state) {
      // token本身就是字符串,不需要使用JSON的方法
      uni.setStorageSync('token', state.token)
    },
    // 持久化存储address
    saveAddressToStorage(state) {
      uni.setStorageSync('address', JSON.stringify(state.address))
    },
    // 持久化存储userinfo
    saveUserInfoToStorage(state) {
      uni.setStorageSync('userinfo', JSON.stringify(state.userinfo))
    },
    updateRedirectInfo(state,info){
      state.redirectInfo = info
      console.log('@redirectInfo:',state.redirectInfo);
    }

  },
  // 计算属性
  getters: {
    addstr(state) {
      // 判断该数组是否为空
      if (!state.address.provinceName) return ''
      return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
    }
  },

}