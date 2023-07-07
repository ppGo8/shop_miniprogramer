<template>
  <view>
    <!-- 搜索框 -->
    <view class="search-box" style="background-color: #C00000;">
      <uni-search-bar ref='searchInput' @input="input" :radius="100" cancelButton="none" focus="true" v-model="keyWord"> </uni-search-bar>
      <!-- 使用 uni-ui 提供的搜索组件 -->
    </view>

    <!-- 渲染搜索建议列表 -->
    <view class="sugg-list" v-if="searchResults.length !== 0">
      <view class="sugg-item" v-for="(item,i) in searchResults" :key="i" @click="gotoDetail(item)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="arrowright" size="16"></uni-icons> <!-- 使用uni-app提供的图标icons -->
      </view>
    </view>

    <!-- 搜索历史 -->
    <view class="history-box" v-else>
      <!-- 标题区域 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
      </view>
      <!-- 列表区域 -->
      <view class="history-list">
        <uni-tag :text="item" v-for="(item, i) in historys" :key="i" @click="gotoGoodsList(item)"></uni-tag>
      </view>
    </view>

  </view>
</template>

<script>
  export default {
    data() {
      return {
        timer: null, // 防抖的定时器
        keyWord: '', // 用户输入的关键词
        searchResults: [], // 服务器返回的用户搜索数据
        historyList: [], // 搜索历史列表
      };
    },
    computed: {
      // 翻转用户输入的搜索词,使得:在页面上显示时,后输入的词先显示
      historys() {
        // reverse方法会改变元素族
        return [...this.historyList].reverse()
      }
    },
    methods: {
      input(e) {
        // 防抖:不断延迟,只响应最后一次
        // 如果用户连续输入,就清除上一个计时器;再重新延迟0.5s
        // 直到用户停止输入,0.5s后输出用户的输入
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          // console.log(e); // 最新的搜索内容 e.value是undefined;直接打印e即可获得value
          this.keyWord = e
          // 调用方法,服务器返回用户搜索的数据
          this.getSearchList()
        }, 500)
      },
      async getSearchList() {
        // 判断搜索关键字是否为空
        if (this.keyWord.length === 0) {
          this.searchResults = [] // 用户输入的为空,就要清空返回结果记录表
          return
        }
        // 用户输入不为空,发送请求获得返回结果记录表
        await uni.request({
          url: 'https://api-hmugo-web.itheima.net/api/public/v1/goods/qsearch',
          data: {
            query: this.keyWord
          },
          success: (res) => {
            // console.log('搜索数据请求:', res.errMsg);
            console.log('我是搜索建议');
            this.searchResults = res.data.message
            // 通过this存储数据,而非参数
            this.saveSearchHistory()
          },
          fail: () => {
            console.log('搜索列表请求:', err.errMsg);
            return uni.$showMsg()
          }
        })
      },
      gotoDetail(item) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
        })
      },
      // 保存搜索历史
      saveSearchHistory() {
        // this.historyList.push(this.keyWord)  // 将用户的输入放在最后一位  

        // 上面写法的问题及解决方法
        // 1.关键词顺序 : 计算属性实现用户输入关键词数组翻转
        // 2.关键词重复 : set方法去重
        const set = new Set(this.historyList) // 数组转集合
        set.delete(this.keyWord) // 如果有重复,需要先删除;
        set.add(this.keyWord) // 删除后添加,新词添加到最后一位
        this.historyList = Array.from(set) // 集合转数组 

        // 使用本地存储,将数据持久化到本地;
        // 当用户切换页面再返回时,在onload处重新取出数据复制,保证依旧有搜索历史
        // 如果不本地存储,那么数据就是变成页面生命周期的数据,页面重新加载
        uni.setStorageSync('keyWord', JSON.stringify(this.historyList))
      },
      cleanHistory() {
        // 清空data和本地存储的数据
        this.historyList = []
        uni.removeStorageSync('keyWord')
      },
      gotoGoodsList(kw) {
        this.keyWord = kw
        this.getSearchList()
      }
    },
    onLoad() {
      // 页面加载时,重新取出来数据
      this.historyList = JSON.parse(uni.getStorageSync('keyWord') || '[]') // 没有数据就要用空数组
    }
  }
</script>

<style lang="scss">
  // 实现吸顶效果
  .search-box {
    position: sticky;
    top: 0;
    z-index: 999;
  }

  // 实现搜索建议列表的单行显示,且隐藏部分显示...
  .sugg-list {
    padding: 0 5px;

    .sugg-item {
      display: flex;
      align-items: center; // 纵向
      justify-content: space-between; // 横向
      font-size: 12px;
      padding: 13px 0;
      border-bottom: 1px solid #efefef;

      .goods-name {
        //一行显示
        white-space: nowrap;
        // 超出部分隐藏
        overflow: hidden;
        // 超出部分内容设置...
        text-overflow: ellipsis;
      }
    }

  }

  .history-box {
    padding: 0 5px;

    .history-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      font-size: 13px;
      border-bottom: 1px solid #efefef;
    }

    .history-list {
      display: flex;
      flex-wrap: wrap;

      .uni-tag {
        margin-top: 5px;
        margin-right: 5px;
      }
    }
  }
</style>