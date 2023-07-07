<template>
  <view class="my-search-container" :style="{'background-color':bgcolor}" @click="searchBoxHandler">
    <view class="my-search-box" :style="{'border-radius':radius+'px'}">
      <!-- 使用uni-ui提供的图标组件 -->
      <uni-icons type="search" size="18"></uni-icons>
      <text class="placeholder">搜索</text>
      
    </view>
  </view>
</template>

<script>
  export default {
    name:"my-search",
    props :{
      // 背景颜色
      bgcolor:{
        type:String,
        default:'#C00000'
      },
      // 圆角尺寸
      radius:{
        type:Number,
        default:18
      }
    },
    data() {
      return {
        
      };
    },
    methods:{
      // 触发组件的点击事件
      searchBoxHandler(){
        // 触发外界通过 @click 绑定的 click 事件处理函数
        this.$emit('click')  // 或者是通过在使用该组件的页面的事件那里后面+.nabative,这样在父组件页面就可以直接为子组件标签绑定click事件
      }
    }
  }
</script>

<style lang="scss">
.my-search-container{
  height: 50px;
  // background-color: #C00000;
  display: flex;
  align-items: center;
  padding: 0 10px;
  .my-search-box{
    height:36px;
    background-color: #FFFFFF;
    // border-radius: 18px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .placeholder{
      font-size: 15px;
      margin-left: 5px;
      
      
    }
  }
}
</style>