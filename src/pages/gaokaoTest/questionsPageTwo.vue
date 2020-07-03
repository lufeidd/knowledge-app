<template>
  <div id="questionsPageTwo">
    <article>
      <div class="introduce"></div>
      <div class="question-wrapper">
        <div v-for="item in 5">
          <p>1. 你喜欢？</p>
          <van-radio-group v-model="questionOne">
            <van-radio name="1">是</van-radio>
            <van-radio name="2">否</van-radio>
          </van-radio-group>
        </div>
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
        questionOne: '',
        // list: [{"A1": 1}, {"B1":2}]
      }
    }
  }
</script>

<style src="@/style/scss/pages/gaokaoTest/questionsPageTwo.scss" lang="scss" scoped>

</style>

