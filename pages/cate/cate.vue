<template>
  <view>
    <view class="scroll-view-container">
      <!-- 左侧滑动区域 -->
      <scroll-view class="left-scroll-view" :style="{height:usefulDeviceHeight + 'px'}" scroll-y>
        <!-- bolck用于循环生成,在html中没有这个节点 -->
        <block v-for="(item,i) in cateList" :key="i">
          <!-- :class 默认选中第一项,添加左侧红色竖线 -->
          <view :class="['left-scroll-view-item', i === active? 'active' : '' ]" @click="activeChanged(i)">
            {{item.cat_name}}
          </view>
        </block>
      </scroll-view>

      <!-- 右侧滑动区域 -->
      <scroll-view class="right-scroll-view"  :style="{height:usefulDeviceHeight + 'px'}" scroll-y :scroll-top="scrollTop">
        <view class="cate-lv2" v-for="(item2,i2) in cateLevel2" :key="i2">
          <!-- 二级分类的标题 -->
          <view class="cate-lv2-title">
            /{{item2.cat_name}}/
          </view>
          <!-- 三级分类的盒子 -->
          <view class="cate-lv3-list">
            <!-- 三级分类的item项 -->
            <view class="cate-lv3-item" v-for="(item3,i3) in item2.children" :key="i3" @click="gotoGoodsList(item3)">
              <image :src="item3.cat_icon"></image>
              <text>{{item3.cat_name}}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
</view>
</template>

<script>
  export default {
    data() {
      return {
        usefulDeviceHeight: 0, // 当前设备可用高度
        cateList: [], // 分类数据列表
        active: 0, // 左侧导航激活项索引
        cateLevel2: [], // 二级分类列表
        scrollTop:0,// 右侧滑动区域,单项绑定的数据;数据只能从这里传到浏览器

      };
    },
    onLoad() {
      // 动态获取使用小程序的设备信息
      const sysInfo = uni.getSystemInfoSync()
      // 设备可用高度,除了tabbar和navigationbar
      this.usefulDeviceHeight = sysInfo.windowHeight
      // 获取分类数据
      this.getCateList()

    },
    methods: {
      getCateList() {
        uni.request({
          url: "https://api-hmugo-web.itheima.net/api/public/v1/categories",
          success: (res) => {
            console.log('分类数据请求:', res.errMsg);
            // 存储分类数据
            this.cateList = res.data.message // 一级
            // 默认显示第一个一级分类下的二级分类数据
            this.cateLevel2 = res.data.message[0].children // 二级

          },
          fail: (err) => {
            console.log('分类数据请求:', err.errMsg);
            return uni.$showMsg()
          }
        })
      },
      // 左侧导航栏激活状态变化
      activeChanged(i) {
        this.active = i
        // 重新为二级分类赋值,选中哪个一级分裂,就把它对应的二级分类赋值给cateLevel2
        // 思想:需要展示哪些再用哪些
        this.cateLevel2 = this.cateList[i].children
        // 切换左侧导航栏,右侧导航栏要回到顶部
        // 赋值前后值不能一样;滚动条原来是0,不能重新赋值为0,所以若为0赋值1,1赋值0
        // 数值不发生改变不会重新渲染;数值发生改变才会重新渲染.
        this.scrollTop = this.scrollTop === 0 ? 1 : 0
      },
      // 三级页面跳转到
      gotoGoodsList(item){
        uni.navigateTo({
          url:'/subpkg/goods_list/goods_list?cid=' + item.cat_id
        })
      }

    }
  }
</script>

<style lang="scss">
  .scroll-view-container {
    display: flex;

    .left-scroll-view {
      width: 120px;

      .left-scroll-view-item {
        background-color: #F7F7F7;
        line-height: 60px;
        text-align: center;
        font-size: 12px;

        // 既left-scroll-view-item类名,又包含active类名
        &.active {
          background-color: #FFFFFF;
          position: relative;

          // 这个元素前面添加红色小竖线
          &::before {
            content: ' ';
            display: block;
            width: 3px;
            height: 30px;
            background-color: #C00000;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
          }

        }
      }
    }
  }

  .cate-lv2-title {
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    padding: 15px 0;
  }

  .cate-lv3-list {
    display: flex;
    // 一行放不下换行
    flex-wrap: wrap;

    .cate-lv3-item {
      width: 33.33%;
      display: flex;
      // 纵向分布
      flex-direction: column;
      // 纵向居中
      justify-content: center;
      // 横向居中
      align-items: center;
      margin-bottom: 10px;

      image {
        width: 60px;
        height: 60px;
      }

      text {
        font-size: 12px;
      }
    }


  }
</style>