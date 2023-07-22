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
    <view class="btn-settle">
      结算({{checkedCount}})
    </view>

  </view>
</template>

<script>
  import {mapGetters,mapMutations} from 'vuex'
  export default {
    name: "my-settle",
    data() {
      return {

      };
    },
    methods:{
      ...mapMutations('m_cart',['updateAllGoodsState']),
      changeAllState(){
        // !this.isFullCheck 是最新的状态
        console.log('@全选按钮最新的状态是:',!this.isFullCheck)
        this.updateAllGoodsState(!this.isFullCheck)
      }
    },
    computed:{
      ...mapGetters('m_cart',['checkedCount','total','checkedGoodsAmount']),
      isFullCheck(){
       
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
    .radio{
      display: flex;
      align-items: center;
      
    }
    .amount-box{
      .amount{
        color: #C00000;
        font-weight: bold;
      }
    }
    .btn-settle{
      background-color: #C00000;
      height: 50px;
      color:white;
      line-height: 50px;
      padding: 0 10px;
      min-width: 100px;
      text-align: center;  
    }
  }
  
</style>