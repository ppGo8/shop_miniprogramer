<template>
  <view class="login-container">
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>

    <button type="primary" class="btn-login" @click="userinfo">一键登录</button>

    <text class="tips-text">登录后尽享更多权益</text>
  </view>
</template>

<script>
  import {
    mapMutations,
    mapState
  } from 'vuex'
  export default {
    name: "my-login",
    data() {
      return {
        // loginResult:{},
      };
    },
    computed: {
      ...mapState('m_user', ['redirectInfo'])
    },
    methods: {
      ...mapMutations('m_user', ['updateUserInfo', 'updateToken', '']),
      //  用户授权之后获得用户的基本信息
      userinfo() {
        // 使用uni-app官方提供的方法
        const self = this
        const query = {}
        uni.login({
          provider: 'weixin',
          success: function(loginRes) {
            // console.log('@获得登录信息code:', loginRes);
            query.code = loginRes.code,
              // 获取用户信息
              uni.getUserInfo({
                provider: 'weixin',
                success: function(infoRes) {
                  // console.log('@获得登录信息getinfo的4条:', infoRes);
                  query.encryptedData = infoRes.encryptedData
                  query.iv = infoRes.iv
                  query.rawData = infoRes.rawData
                  query.signature = infoRes.signature
                },
                complete: (infoRes) => {
                  console.log(this);
                  self.updateUserInfo(infoRes.userInfo)
                }
              });
          },
          fail: function() {
            return uni.$showMsg('登录失败!')
          },
          complete: () => {
            this.getToken(query)
            this.navigateBack()
          }
        })
      },
      // 获得token
      getToken(query) {
        uni.request({
          url: " https://api-hmugo-web.itheima.net/api/public/v1/users/wxlogin",
          method: "POST",
          data: query,
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'xmlhttprequest'
          },
          success: (res) => {
            // console.log('@res', res);
          },
          complete: (res) => {
            // console.log('@c', res);
            if (res.statusCode !== 200) return uni.$showMsg('登录失败')
            // uni.$showMsg('登录成功')
            // 直接把token存放到vuex中,自己写的假的token
            this.updateToken(
              'Bearer eyJhbGciOiJlUzl1NilslnR5cC16lkpXVCJ9.eyJ1aWQiOizLCJpYXQiOiE1NiQ3MZAwNzkslmV4cCI6MTAwMTU2NDCZMDA3OH0.YPt-XeLniV- 1TaXGY2FhxmCe4NyXuRnRB8OMCfnPo'
            )
          }
        })

      },
      // 跳转回登陆之前的页面
      navigateBack() {
        if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
          uni.switchTab({
            url: this.redirectInfo.from,
            complete:()=>{
              this.updateUserInfo(null)
            }
          })
        }
      }



    }
  }
</script>

<style lang="scss">
  .login-container {
    height: 750rpx;
    // background-color: white;
    background-color: #f8f8f8;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;

    //  绘制半椭圆区域
    // &::after {
    //   content: ' ';
    //   display: block;
    //   width: 100%;
    //   height: 40px;
    //   background-color: white;
    //   position: absolute;
    //   bottom: 0;
    //   left: 0;
    //   border-radius: 100% 100% 0 0 ;
    //   // 该盒子向下移动50%，这样就可以隐藏超出父盒子的部分，只保留上半部分椭圆
    //   transform: translateY(50%);
    // }

    .btn-login {
      width: 90%;
      border-radius: 100px;
      margin: 15px 0;
      background-color: #C00000;

    }

    .tips-text {
      font-size: 12px;
      color: grey;
    }
  }
</style>