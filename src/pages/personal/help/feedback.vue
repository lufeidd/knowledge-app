<template>
  <div id="feedbackPage">
    <textarea cols="30" rows="10" placeholder="请输入问题并留下联系方式，我们会尽快联系您" @blur="question"></textarea>
    <input type="text" placeholder="您的手机号、QQ或邮箱（三选一）" @blur="way">
    <div class="bottomBox" :class="{iphx:this.isIphx}" v-if="submit">
      <van-button disabled type="danger" size="large" replace to="/personal/help/feedback">提交</van-button>
    </div>
    <div class="bottomBox" :class="{iphx:this.isIphx}" v-else>
      <van-button type="danger" size="large" replace to="/personal/help/feedback">提交</van-button>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/help/index.scss" lang="scss"></style>

<script>
export default {
  data () {
    return {
      submit:true,
    }
  },
  mounted(){
    var input=$('input').val();
    console.log(input.length)
  },
  methods:{
    change(){
      var input=$('input').val().length;
      var textarea=$('textarea').val().length;
      if( input>0 && textarea>0){
        this.submit = false;
        console.log(this.submit)
      }
    },
    question(){
      this.change();
    },
    way(){
      this.change();
    }
  }
}
</script>
