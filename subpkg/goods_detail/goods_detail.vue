<template>
  <view v-if="goods_info.goods_name" class="goods-detail-container">

    <!-- 商品轮播图 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item,i) in goods_info.pics" :key="goods_id">
        <image :src="item.pics_big" @click="preview(i)"></image>
      </swiper-item>
    </swiper>

    <!-- 商品信息区域 -->
    <view class="goods-info-box">
      <!-- 商品价格  -->
      <view class="price">{{goods_info.goods_price}}</view>
      <!-- 商品信息主体 -->
      <view class="goods-info-body">
        <!-- 商品名字 -->
        <view class="goods-name">{{goods_info.goods_name}}</view>
        <!-- 收藏 -->
        <view class="favi">
          <uni-icons type="star" size="18" color="gray"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <!-- 运费 -->
      <view class="email">快递:免运费</view>
    </view>

    <!-- 商品详细信息区域 -->
    <rich-text :nodes="goods_info.goods_introduce"></rich-text>

    <!-- 商品底部导航区域 -->
    <view class="goods_nav">
      <!-- fill 控制右侧按钮的样式 -->
      <!-- options 左侧按钮的配置项 -->
      <!-- buttonGroup 右侧按钮的配置项 -->
      <!-- click 左侧按钮的点击事件处理函数 -->
      <!-- buttonClick 右侧按钮的点击事件处理函数 -->
      <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick"
        @buttonClick="buttonClick" />
    </view>

  </view>
</template>

<script>
  import {
    mapState,
    mapMutations,
    mapGetters
  } from 'vuex'
  export default {
    computed: {
      ...mapState('m_cart', []),
      ...mapGetters('m_cart', ['total'])
    },
    watch: {
      // total(newVal){
      //   // find方法返回数组对象的引用
      //   const findResult = this.options.find(x => x.text ==='购物车')
      //   if(findResult){
      //     // total发生了变化就赋值给
      //     findResult.info = newVal
      //   }
      // }
      total: {
        // 页面加载完毕后就调用一次
        immediate: true,
        handler(newVal) {
          // find方法返回数组对象的引用
          const findResult = this.options.find(x => x.text === '购物车')
          if (findResult) {
            // total发生了变化就赋值给
            findResult.info = newVal
          }
        }
      }
    },
    data() {
      return {
        goods_info: {},
        // 左侧按钮组的配置对象
        options: [{
          icon: 'shop',
          text: '店铺'
        }, {
          icon: 'cart',
          text: '购物车',
          info: 0
        }],
        // 右侧按钮组的配置对象
        buttonGroup: [{
            text: '加入购物车',
            backgroundColor: '#ff0000',
            color: '#fff'
          },
          {
            text: '立即购买',
            backgroundColor: '#ffa200',
            color: '#fff'
          }
        ],
      };
    },
    onLoad(options) {
      const goods_id = options.goods_id
      // 调用方法,获取商品详细数据
      this.getGoodsDetail(goods_id)
    },
    methods: {
      ...mapMutations('m_cart', ['addToCart']),
      async getGoodsDetail(goods_id) {
        await uni.request({
          url: "https://api-hmugo-web.itheima.net/api/public/v1/goods/detail",
          // 传递的参数
          data: {
            goods_id: goods_id
          },
          success: (res) => {
            // 第一个replace 解决图片之间有白色间隙的问题,将图片改成块级结构
            // 第二个replac 解决图片无法在ios上显示的问题,将图片修改为jpg的格式
            res.data.message.goods_introduce = res.data.message.goods_introduce.replace(/<img /g,
              '<img style="display:block;" ').replace(/webp/g, 'jpg')
            this.goods_info = res.data.message
          }
        })
      },
      preview(i) {
        uni.previewImage({
          current: i,
          urls: this.goods_info.pics.map(x => x.pics_big)
        })
      },
      onClick(e) {
        if (e.content.text === '购物车') {
          uni.switchTab({
            url: '/pages/cart/cart'
          })
        }
      },
      buttonClick(e) {
        // console.log(e);
        if (e.content.text === '加入购物车') {
          // 组织一个商品的信息对象，都是之前请求获得的
          const goods = {
            // 用户在商品列表，点击商品图片那么就将商品id传递给这个页面
            // 该页面在onload是，自动发送request请求得到的有关商品的数据
            goods_id: this.goods_info.goods_id,
            goods_name: this.goods_info.goods_name,
            goods_price: this.goods_info.goods_price,
            goods_count: 1, // 默认是1
            goods_small_logo: this.goods_info.goods_small_logo,
            goods_state: true, // 默认是true
          }
          // 调用addToCart方法
          this.addToCart(goods)
        }

      }

    },
  }
</script>

<style lang="scss">
  swiper {
    height: 750rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }

  // 商品信息区域的样式
  .goods-info-box {
    padding: 10px;
    padding-right: 0;

    .price {
      color: #c00000;
      font-size: 18px;
      margin: 10px 0;
    }

    .goods-info-body {
      display: flex;
      justify-content: space-between;

      .goods-name {
        font-size: 13px;
        padding-right: 10px;
      }

      // 收藏区域
      .favi {
        width: 120px;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-left: 1px solid #efefef;
        color: gray;
      }
    }

    // 运费
    .email {
      margin: 10px 0;
      font-size: 12px;
      color: gray;
    }
  }

  // 商品底部导航
  .goods_nav {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;

  }

  .goods-detail-container {
    // 避免页面内容被底部导航栏覆盖,显示不出来下面的部分
    padding-bottom: 50px;
  }
  .uni-tab__cart-box {
    padding-bottom: 10px;
  }
</style>