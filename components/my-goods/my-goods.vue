<template>
  <view>
    <view class="goods-item">
      <!-- 左侧的盒子 -->
      <view class="goods-item-left">
        <!-- 默认选中状态 -->
       <radio :checked="goods.goods_state" color="#C00000" v-if="showRadio" @click="radioClickHandler"></radio>
        <!-- 如果商品图片不存在,逻辑终端就使用默认图片 -->
        <image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
      </view>
      <!-- 右侧的盒子 -->
      <view class="goods-item-right">
        <!-- 商品介绍 -->
        <view class="goods-name">{{goods.goods_name}}</view>
        <!-- 商品价格 -->
        <view class="goods-info-box">
          <view class="goods-price">￥{{goods.goods_price | tofixed}}</view>
          <uni-number-box :min="1" :value="goods.goods_count" v-if="showNum" @change="numChangeHandler"></uni-number-box>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: "my-goods",
    props: {
      // 商品的信息对象
      goods: {
        type: Object,
        defaul: {},
      },
      showRadio:{
        type:Boolean,
        // 默认情况下不会展示radio
        default:false,
      },
      showNum:{
        type:Boolean,
        // 默认情况下不会显示数字加钱框
        default:false,
      }
    },
    data() {
      return {
        // 默认图片地址,如果图片地址不存在就显示这个. 在Html中使用逻辑终端
        defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
      };
    },
    filters:{
      // 把数字处理为带两位小数点的数字
      tofixed(num) {
        return Number(num).toFixed(2)    
      }
    },
    methods:{
      // radio组件的点击事件处理函数
      radioClickHandler(){
        // 使用this.$emit()触发外界通过@绑定的radio-change事件
        this.$emit('radio-change',{
          goods_id:this.goods.goods_id,
          goods_state:!this.goods.goods_state,// 用户点击小圆点后，要取反
        })
        
      },
      // 监听到了用户点击购物车页面的加减号,改变购物车数量
      // change事件会自动传递参数
      numChangeHandler(val){
       this.$emit('num-change',{
         goods_id : this.goods.goods_id,
         // 前面有个加号,保证goods_count是数字类型
         goods_count:+val
       })
      }
     
    }
  }
</script>

<style lang="scss">
  .goods-item {
    display: flex;
    padding: 10px 5px;
    border-bottom: 1px solid #f0f0f0;

    .goods-item-left {
      margin-right: 5px;
      display: flex;
      justify-content: space-around;
      align-items: center;


      .goods-pic {
        width: 100px;
        height: 100px;
        display: block;
      }
    }

    .goods-item-right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex:1;

      .goods-name {
        font-size: 13px;
      }
      .goods-info-box{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .goods-price {
          font-size: 16px;
          color: #c00000;
        }
      }
     
    }
  }
</style>