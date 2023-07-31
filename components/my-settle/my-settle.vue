<template>
  <view class="my-settle-container">
    <!-- 全选 -->
    <label class="radio" @click="changeAllState">
      <radio color="#C00000" :checked="isFullCheck" /><text>全选</text>
    </label>

    <!-- 合计 -->
    <view class="amount-box">
      合计：<text class="amount">￥{{checkedGoodsAmount}}</text>
    </view>

    <!-- 结算按钮 -->
    <view class="btn-settle" @click='settlement'>
      结算({{checkedCount}})
    </view>

  </view>
</template>

<script>
  import {
    mapGetters,
    mapMutations,
    mapState
  } from 'vuex'
  export default {
    name: "my-settle",
    data() {
      return {
        // 倒计时的秒数
        seconds: 3,
        // 定时器Id
        timer: null,
      };
    },
    methods: {
      ...mapMutations('m_cart', ['updateAllGoodsState']),
      ...mapMutations('m_user', ['updateRedirectInfo','updateRedirectInfo']),
      changeAllState() {
        // !this.isFullCheck 是最新的状态
        console.log('@全选按钮最新的状态是:', !this.isFullCheck)
        this.updateAllGoodsState(!this.isFullCheck)
      },
      // 用户点击了结算按钮,进行判断操作
      settlement() {
        // 是否勾选了商品
        if (!this.checkedCount) return uni.$showMsg("请选择要结算的商品!")
        // 是否选择了地址
        if (!this.addstr) return uni.$showMsg("请选择收货地址!")
        // 判断用户是否登录
        // if (!this.token) return uni.$showMsg('请登录!')
        if (!this.token) return this.delayNavigate()


      },
      delayNavigate() {
        // 每次跳转之前,将seconds重置为3
        this.seconds = 3
        // 展示倒计时跳转的提示框
        this.showTips(this.seconds)
        this.timer = setInterval(() => {
          this.seconds--
          if (this.seconds <= 0) {
            clearInterval(this.timer)
            // 计时器结束后跳转
            uni.switchTab({
              url: '/pages/my/my',
              success:()=>{
                this.updateRedirectInfo({
                  openType:'switchTab',
                  from:'/pages/cart/cart'
                })
              }
            })
            return // 防止跳转后,后面的提示消息继续显示
          }

          this.showTips(this.seconds)
        }, 1000)
      },
      // 展示倒计时的提示信息
      showTips(n) {
        uni.showToast({
          icon: 'none',
          title: '请登录后再结算!' + n + '秒之后自动跳转到登录页',
          mask: true, // 防止点击穿透,添加透明遮罩效果
          duration: 1500 // 1.5s后消失
        })
      }
    },
    computed: {
      ...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsAmount']),
      ...mapGetters('m_user', ['addstr']),
      ...mapState('m_user', ['token']),
      isFullCheck() {
        return this.checkedCount === this.total
      }
    }
  }
</script>

<style lang="scss">
  .my-settle-container {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    padding: 5px;
    background-color: white;
    border-top: 1px solid #efefef;

    .radio {
      display: flex;
      align-items: center;

    }

    .amount-box {
      .amount {
        color: #C00000;
        font-weight: bold;
      }
    }

    .btn-settle {
      background-color: #C00000;
      height: 50px;
      color: white;
      line-height: 50px;
      padding: 0 10px;
      min-width: 100px;
      text-align: center;
    }
  }
</style>