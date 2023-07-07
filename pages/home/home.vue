<template>
  <view>
    <!-- 搜索组件 -->
    <view class="search-box">
      <my-search @click="gotoSearch"></my-search>
    </view>
    
    <!-- 1.首页轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item,index) in swiperList" key="index">
        <!-- 注意:属性="",引号里面的内容是JS表达式,Vue在解析时,最外层的""相当于没有 -->
        <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id='+ item.goods_id">
          <img :src="item.image_src">
        </navigator>
      </swiper-item>
    </swiper>

    <!-- 2.分类导航区域 -->
    <view class="nav-list">
      <view class="nav-item" v-for="(item,index) in navList" :key="index" @click="navClickHandler(item)">
        <image :src="item.image_src" class="nav-img"></image>
      </view>
    </view>

  <!-- 3.楼层区域 -->
  <view class="floor-list">
    <!-- 每个楼层的item项目 -->
    <view class="floor-item" v-for="(item,i) in floorList" :key="i">
      <!-- 标题区域 -->
      <image :src="item.floor_title.image_src" class="floor-title" ></image>
      
      <!-- 图片区域 -->
      <view class="floor-img-box">
        <!-- 左侧大盒子区域 -->
        <navigator class="letf-img-box" :url="item.product_list[0].url"> 
          <image :src="item.product_list[0].image_src" :style=" { width: item.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
        </navigator>
        <!-- 右侧4个小盒子区域 -->
        <view class="right-img-box">
          <navigator class="right-img-item" v-for="(item2,index2) in item.product_list" :key="index2" v-if="index2!==0" :url="item2.url">
            <image :src="item2.image_src" :style="{width:item2.image_width + 'rpx'}" mode="widthFix"></image>
          </navigator>
        </view>
        
      </view>
    </view>
    
  </view>
  

  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 1.1 轮播图数据列表
        swiperList: [],
        // 2.1 分类导航数据
        navList: [],
        // 3.1 楼层数据
        floorList:[],
      };
    },
    //小程序刚加载时,调用下列方法
    onLoad() {
      // 1.2 获取轮播图数据
      this.getSwiperList()
      // 2.2 获取分类数据
      this.getNavList()
      // 3.2 获取楼层数据
      this.getFloorList()
    },
    methods: {
      // 1.3 定义轮播图方法
      async getSwiperList() {
        await uni.request({
          url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
          success: (res) => {
            console.log('轮播图请求:', res.errMsg);
            this.swiperList = res.data.message // message是存储轮播图数据的对象数组 
          },
          fail: (err) => {
            console.log('轮播图请求:', err.errMsg);
            return uni.$showMsg() // 显示数据请求失败的toast
          }
        })
      },
      // 2.3 定义获得分类数据的方法
      async getNavList() {
        await uni.request({
          url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/catitems',
          success: (res) => {
            console.log('分类数据请求:', res.errMsg);
            // 存储分类数据
            this.navList = res.data.message
          },
          fail: (err) => {
            console.log('分类数据请求:', err.errMsg);
            return uni.$showMsg()
          }
        })
      },
      // 3.3 定义获取楼层数据的函数
      async getFloorList() {
        await uni.request({
          url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/floordata',
          success: (res) => {
            console.log('楼层数据数据请求:', res.errMsg);
            // 处理数据
            res.data.message.forEach(floor =>{
              floor.product_list.forEach(prod =>{
                // 修改路径 
                prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
              })
            })
            // 存储楼层数据
            this.floorList = res.data.message
          },
          fail: (err) => {
            console.log('楼层数据数据请求:', err.errMsg);
            return uni.$showMsg()
          }
        })
      },
      // 2:  nav-item 项被点击时候的事件处理函数
      navClickHandler(item) {
        // 1) 跳转到分类,分类是tabbar页面
        // 如果想使用标签跳转到tababr,需要设置open-type="switchTab"
        // 编程式方法跳转到分类页面
        if (item.name === '分类') {
          console.log('跳转到分类页面');
          uni.switchTab({
            // 地址前面有没有/需要多试试
            url: '/pages/cate/cate'
          })
        }
      },
      gotoSearch() {
        uni.navigateTo({
          url: '/subpkg/search/search'
        })
      }

    },
  }
</script>

<style lang="scss">
  // 1.轮播图样式
  swiper {
    height: 330rpx;

    .swiper-item,
    image {
      height: 100%;
      width: 100%;
    }
  }

  // 2.分类样式
  .nav-list {
    display: flex;
    justify-content: space-around;
    margin: 15px 0;

    .nav-img {
      width: 128rpx;
      height: 140rpx;
    }
  }
  
   // 3.楼层区域
   .floor-title{
     width: 100%;
     height: 60rpx;
   }
   .floor-img-box{
     display: flex;
     padding: 10rpx;
   }
   .right-img-box{
     display: flex;
     flex-wrap: wrap;
     // 分散布局
     justify-content: space-around;
     
   }
   
   // 搜索栏吸顶效果
   .search-box {
     // 设置定位效果为“吸顶”
     position: sticky;
     // 吸顶的“位置”
     top: 0;
     // 提高层级，防止被轮播图覆盖
     z-index: 999;
   }
  
   
   
</style>