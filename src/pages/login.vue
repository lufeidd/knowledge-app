<template>
  <div id="loginPage">
    <van-nav-bar title="登录" left-text right-text left-arrow @click-left="onClickLeft"/>

    <div class="fieldBox">
      <div class="phone">
        <van-field
          v-model="phone"
          clearable
          label="+86"
          placeholder="手机号码"
          error-message
          type="tel"
          maxlength="11"
          @input="checkSubmit"
        />
      </div>

      <div class="password">
        <van-field
          v-model="password"
          type="password"
          clearable
          label="密码"
          maxlength="20"
          placeholder="6-20位数字、字母或符号，至少两种"
          @input="checkSubmit"
        />
      </div>

      <van-row v-bind:class="{ row: isRow }">
        <van-col span="12">
          <router-link to="/register">注册</router-link>
        </van-col>
        <van-col span="12">
          <template v-if="isPassword">
            <router-link to="/password">找回密码</router-link>
          </template>
          <template v-else>
            <span @click="getTip">找回密码</span>
          </template>
        </van-col>
      </van-row>

      <div class="submitBox">
        <template v-if="submitData.disabled">
          <van-button slot="button" size="large" disabled round type="danger">登录</van-button>
        </template>
        <template v-else>
          <van-button slot="button" size="large" round type="danger" @click="gotoPage">登录</van-button>
        </template>
      </div>

      <van-row v-bind:class="{ loginType: isLoginType }">
        <van-col span="12">
          <router-link to="/phone">
            <span class="iconfont icon-weixin-block"></span>
          </router-link>
        </van-col>
        <van-col span="12">
          <span class="iconfont icon-qq-block"></span>
        </van-col>
      </van-row>
    </div>
    <!-- axios -->
    <!-- <p>{{ axiosData }}</p> -->
    <!-- 视频 -->
    <!-- <movie :movieData="movieData"></movie> -->
    <!-- 音频 -->
    <!-- <music :musicData="musicData"></music> -->
    <!-- 上传图片 -->
    <upload :uploadData="uploadData"></upload>

    <swiper :options="swiperOption" ref="mySwiper" @someSwiperEvent="callback">
      <!-- slides -->
      <swiper-slide>I'm Slide 1</swiper-slide>
      <swiper-slide>I'm Slide 2</swiper-slide>
      <swiper-slide>I'm Slide 3</swiper-slide>
      <swiper-slide>I'm Slide 4</swiper-slide>
      <swiper-slide>I'm Slide 5</swiper-slide>
      <swiper-slide>I'm Slide 6</swiper-slide>
      <swiper-slide>I'm Slide 7</swiper-slide>
      <!-- Optional controls -->
      <div class="swiper-pagination" slot="pagination"></div>
      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
      <div class="swiper-scrollbar" slot="scrollbar"></div>
    </swiper>
  </div>
</template>

<style src="@/style/scss/pages/login.scss" lang="scss"></style>

<script>
import movie from "./../components/movie";
import music from "./../components/music";
import upload from "./../components/upload";
export default {
  components: {
    movie,
    music,
    upload
  },
  data() {
    return {
      swiperOption: {
        // some swiper options/callbacks
        // 所有的参数同 swiper 官方 api 参数
        // ...
        slidesPerView: 3
      },
      phone: "",
      password: "",
      submitData: {
        disabled: true
      },
      isRow: true,
      isLoginType: true,
      isPassword: false,
      axiosData: "",
      musicData: {
        type: "play",
        id: "myAudio",
        src: "",
        // 分：秒格式
        duration: "00:00",
        currentTime: "00:00"
      },
      movieData: {
        type: "play",
        id: "myVideo",
        src: "",
        // 分：秒格式
        duration: "00:00",
        currentTime: "00:00"
      },
      uploadData: {
        maxlength: 3
      }
    };
  },
  created() {
    this.getData();
    let queryData = this.$route.query;
    this.phone = queryData.phone;
    this.password = "";
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },
  mounted() {
    // current swiper instance
    // 然后你就可以使用当前上下文内的swiper对象去做你想做的事了
    console.log("this is current swiper instance object", this.swiper);
    this.swiper.slideTo(3, 1000, false);
    // 音频
    this.musicData.src = require("./../assets/music.mp3");
    // 视频
    this.movieData.src = require("./../assets/movie.mp4");
  },
  methods: {
    callback() {

    },
    onClickLeft() {
      this.$router.go(-1);
    },
    checkSubmit() {
      var regPhone = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
      var regPassword = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
      if (regPassword.test(this.password)) this.isPassword = true;
      if (regPassword.test(this.password) && regPhone.test(this.phone)) {
        this.submitData.disabled = false;
      } else {
        this.submitData.disabled = true;
      }
    },
    getData() {
      // axios
      const axios = this.api.axios;
      const data = this.api.loginApi;
      axios
        .get(data)
        .then(response => {
          this.axiosData = response.data.bpi;
          // this.$refs.loadmore.onTopLoaded();
        })
        .catch(error => {
          console.log(error);
          this.error = true;
        })
        .finally(() => (this.loadding = false));
    },
    gotoPage() {},
    getTip() {
      this.$router.push("/password");
    }
  }
};
</script>