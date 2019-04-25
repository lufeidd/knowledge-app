export default {
  install: function (Vue, options) {

    // 判断是否是iphonex
    Vue.prototype.winWidth = $(window).width();
    Vue.prototype.winHeight = $(window).height();
    const ua = window.navigator.userAgent.toLowerCase();
    Vue.prototype.isIphx = ua.match(/mobile/) && $(window).width() == 375 && $(window).height() == 812;
    // 全局变量
    // 倒计时
    Vue.prototype.clock = null
    Vue.prototype.audioDuration = null
    Vue.prototype.videoDuration = null

    // 验证码倒计时
    Vue.prototype.$countDown = function (options) {
      let self = this
      let time = options.time

      if (typeof time === 'number') {
        this.clock = window.setInterval(() => {
          if (time === 0) {
            clearInterval(this.clock)
            options.disabled = false
            options.timeMsg = '获取验证码'
            return false
          }
          time--
          options.disabled = true
          options.timeMsg = time + 's'
          console.log(time)
        }, 1000)
      } else {
        self.$toast('时间格式不正确')
      }
    }

    // 时间倒计时
    Vue.prototype.$timeCountDown = function (options) {
      let self = this
      let second = options.time
      if (typeof second === 'number') {
        this.clock = window.setInterval(() => {
          if (second === 0) {
            clearInterval(this.clock)
            return false
          }
          second--

          let h = Math.floor(second / 60 / 60)
          let m = Math.floor((second - h * 60 * 60) / 60)
          let s = second - (h * 60 * 60) - (m * 60) 
          if (h < 10) h = '0' + h
          if (m < 10) m = '0' + m
          if (s < 10) s = '0' + s
          let res = h + ":" + m + ":" + s
    
          options.date = res;
          console.log(res)
        }, 1000)
      } else {
        self.$toast('时间格式不正确')
      }

    }
  }
}
