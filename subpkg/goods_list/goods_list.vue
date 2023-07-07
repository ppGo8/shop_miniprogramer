<template>
  <view>
    <view class="goods-list">
      <view v-for="(item,i) in goodsList" :key="item.goods_id" @click="gotoDetail(item)">
      <!-- 动态绑定数据 -->
      <my-goods :goods="item"></my-goods>  
      </view>
      
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 请求参数对象
        queryObj: {
          query: '',
          cid: '',
          pagenum: 1, // 页码
          pageSize: 10, // 每页大小
        },
        goodsList: [], // 接受服务器返回的数据
        total: 0, // 实现分页 
        isLoading : false, // 节流阀,不能重复发送请求

      };
    },
    onLoad(options) {
      // options页面参数
      // 在页面加载时,将页面的参数存在queryObj上
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''

      // 向服务器发送请求
      this.getGoodsList()
    },
    methods: {
      async getGoodsList(cb) {
        // 打开节流阀
        this.isLoading = true
        await uni.request({
          url: "https://api-hmugo-web.itheima.net/api/public/v1/goods/search",
          data: {
            query: this.queryObj.query,
            cid: this.queryObj.cid,
            pagesize: this.queryObj.pageSize,
            pagenum: this.queryObj.pagenum,
          },
          success: (res) => {
            console.log('商品详情数据', res.data.message)
            this.goodsList = [...this.goodsList,...res.data.message.goods]
            this.total = res.data.message.total
            
          },
          complete: () => {
            // 请求完毕,关闭节流阀
            this.isLoading = false
            // 请求完毕,自动停止刷新
            cb && cb()
          }
          
        })
      },
      gotoDetail(goods){
        uni.navigateTo({
          url:'/subpkg/goods_detail/goods_detail?goods_id=' + goods.goods_id
        })
      }
    },
    onReachBottom(){
      // 是否存在下一页数据
      if(this.queryObj.pagenum * this.queryObj.pageSize >=this.total) return uni.showToast({
        icon:'none',
        title:'数据加载完毕!',
      })
      // 节流阀判断
      if(this.isLoading === true) return
      this.queryObj.pagenum ++  // 页码 +1 
      this.getGoodsList()
      
    },
    onPullDownRefresh() {
      // 重置关键数据
      this.queryObj.pagenum = 1
      this.total = 0
      this.goodsList = []
      this.isLoading = false 
      // 重新发送请求,且获得数据后关闭下拉刷新效果
      this.getGoodsList(()=>uni.stopPullDownRefresh())
      
    }

  }
</script>

<style lang="scss">


</style>