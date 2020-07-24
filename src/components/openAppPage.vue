<template>
  <!--弹窗暂时作废-->
  <div id="openApp">
    <van-popup v-model="pop_one_show" class="open-app">
      <p class="title-text">在火把知识app中打开链接吗？</p>
      <div class="btn_wrapper">
        <span class="cancel" @click="cancel">取消</span>
        <span class="confirm" @click="confirm">确定</span>
      </div>
    </van-popup>
    <div class="open-in-browser" v-if="isInWx">
      <div class="text"><div>点击右上角，选择在浏</div>览器中打开~</div>
      <img src="./../assets/tips.png" class="pic">
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        pop_one_show: false,
        isInWx: false
      };
    },
    methods: {
      cancel() {
        this.pop_one_show = false;
      },
      confirm() {
        var u = navigator.userAgent;
        var _android = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
        var _wx = u.toLowerCase().match(/MicroMessenger/i) == "micromessenger";
        if (_android && _wx) {
          this.pop_one_show = false;
          this.isInWx = true;
        } else {
          let  _linkData = this.$getAppParams(this.name);
          this.$openAppPage(_linkData);
        }
      }
    },
    props: ['name'],
    mounted() {
     if (localStorage.getItem('isHuobaIosLogin')=='no' && localStorage.getItem('isHuobaAndroidLogin')=='no') {
       // this.pop_one_show = true;
     }
    }
  }
</script>

<style lang="scss" scoped>
  #openApp {
    .open-app {
      width: 255px;
      height: 126px;
      background: #FFFFFF;
      border-radius: 5px;
      .title-text {
        margin: 20px auto;
        width: 157px;
        font-size: 15px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #333333;
        line-height: 20px;
        text-align: center;
      }
      .btn_wrapper {
        display: flex;
        height: 46px;
        line-height: 46px;
        border-top: 0.5px solid #E5E5E5;
        .cancel {
          flex: 1;
          text-align: center;
          border-right: 0.5px solid #E5E5E5;
          font-size: 16px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #999999;
        }
        .confirm {
          flex: 1;
          text-align: center;
          font-size: 16px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #333333;
        }
      }
    }
    .open-in-browser {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 100;
      background: rgba(0, 0, 0, 0.5);
      .text {
        position: absolute;
        top: 100px;
        right: 120px;
        z-index: 10;
      }
      .pic {
        position: absolute;
        top: 10px;
        right: 26px;
        width: 280px;
      }
    }

  }
</style>
