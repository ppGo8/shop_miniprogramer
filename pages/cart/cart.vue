<template>
  <view class="cart-container" v-if="cart.length !== 0">
    <my-address></my-address>
    <!-- 商品列表标题区域 -->
    <view class="cart-title">
      <!-- 左侧图标 -->
      <uni-icons type='shop' size='18'></uni-icons>
      <!-- 右侧文本 -->
      <text class='cart-title-text'>购物车</text>
    </view>

    <!-- 循环渲染购物车商品信息 -->
    <uni-swipe-action>
      <block v-for="(goods,i) in cart" :key='i'>
        <uni-swipe-action-item :right-options="options" @click="swipeItemClickHandler(goods)">
          <my-goods :goods="goods" :showRadio="true" :showNum="true" @radio-change="radioChangeHandler"
            @num-change="numChangeHandler"></my-goods>
        </uni-swipe-action-item>
      </block>
    </uni-swipe-action>

    <!-- 使用自定义的结算组件 -->
    <my-settle></my-settle>
  </view>

    <view class="empty-cart" v-else>
      <image src="/static/cart_empty@2x.png" class="empty-img"></image>
      <text class="tip-text">空空如也~</text>
    </view>
</template>

<script>
  // 引入混合
  import badgeMix from '@/mixins/tabbar-badge.js' // 渲染tababr购物车右上角徽标
  import {
    mapState,
    mapMutations
  } from 'vuex'
  export default {
    mixins: [badgeMix],
    computed: {
      ...mapState('m_cart', ['cart'])
    },
    data() {
      return {
        options: [{
          text: '删除',
          style: {
            backgroundColor: '#C00000'
          }
        }]
      };
    },
    methods: {
      ...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
      radioChangeHandler(e) {
        // 调用mutations方法
        this.updateGoodsState(e)
      },
      numChangeHandler(e) {
        // 调用mutaions方法,修改最新的商品数量
        this.updateGoodsCount(e)
      },
      swipeItemClickHandler(goods) {
        // 调用mutations方法,删除指定id的商品
        this.removeGoodsById(goods.goods_id)
      }

    }

  }
</script>

<style lang="scss">
  .cart-container {
    padding-bottom: 50px;
  }

  .cart-title {
    height: 40px;
    display: flex;
    align-items: center;
    padding-left: 5px;
    border-bottom: 1px solid #efefef;

    .cart-title-text {
      font-size: 14px;
      margin-left: 10px;
    }

  }
  .empty-cart{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 150px;
    .empty-img{
      width: 90px;
      height: 90px;
    }
    .tip-text{
      font-size: 12px;
      color:grey;
      margin-top: 15px;
    }
  }
</style>