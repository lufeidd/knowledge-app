<template>
  <div id="questionsPageOne">
    <article>
      <!--<div  class="introduce">-->
        <!--<img src="./../../assets/gaokaoTest/introduce.png" width="100%" alt="">-->

      <!--</div>-->
      <div class="introduce"></div>
      <!--<div>-->
        <!--<p>你是男生还是女生？</p>-->
        <!--<input type="radio" id="boy" name="gender" value="1">-->
        <!--<label for="boy">男生</label>-->
        <!--<input type="radio" id="girl" name="gender" value="2">-->
        <!--<label for="girl">女生</label>-->
      <!--</div>-->
      <div class="question-wrapper">
        <p>你是男生还是女生？</p>
        <van-radio-group v-model="gender">
          <van-radio name="1">男生</van-radio>
          <van-radio name="2">女生</van-radio>
        </van-radio-group>
        <p>你出生的年份是？</p>
        <select name="" id="">
          <option value="2020">2020年</option>
          <option value="2019">2019年</option>
          <option value="2018">2018年</option>
        </select>
      </div>
    </article>
    <footer>
      <div class="btn-box" @click=""></div>
    </footer>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        gender: ''
      }
    }
  }
</script>

<style src="@/style/scss/pages/gaokaoTest/questionsPageOne.scss" lang="scss" scoped>

</style>

