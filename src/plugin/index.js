export default {
  install: function (Vue, options) {
    // 全局变量

    // 验证码倒计时
    Vue.prototype.$countDown = function (options) {
      let self = this
      let time = options.time

      if (typeof time === 'number') {
        let clock = window.setInterval(() => {
          if (time === 0) {
            clearInterval(clock)
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
  }
}
