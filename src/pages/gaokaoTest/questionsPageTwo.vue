<template>
  <div id="questionsPageTwo">
    <article>
      <div class="introduce" :class="title"></div>
      <div class="question-wrapper">
        <div v-for="(item,index) in percentList" :key="item.id">
          <p>{{item.no}}.{{item.data}}</p>
          <van-radio-group v-model="fillList[item.id]" @change="fillQuestions">
            <van-radio name="1" @click="chooseYes(item,index)">是</van-radio>
            <van-radio name="2" @click="chooseNo(item,index)">否</van-radio>
          </van-radio-group>
        </div>
      </div>
    </article>
    <footer v-if="percentPage == 1">
      <div class="btn-box next-able" v-if="fillOver"  @click="next"></div>
      <div class="btn-box next-disabled" v-else></div>
    </footer>
    <footer v-if="percentPage == 2">
      <div class="btn-box-left pre" @click="previous"></div>
      <div class="btn-box-right next-able" v-if="fillOver"  @click="next"></div>
      <div class="btn-box-right next-disabled" v-else></div>
    </footer>
    <footer v-if="percentPage == 3">
      <div class="btn-box-left pre" @click="previous"></div>
      <div class="btn-box-right next-able" v-if="fillOver"  @click="next"></div>
      <div class="btn-box-right next-disabled" v-else></div>
    </footer>
    <footer v-if="percentPage == 4">
      <div class="btn-box-left pre" @click="previous"></div>
      <div class="btn-box-right next-able" v-if="fillOver"  @click="next"></div>
      <div class="btn-box-right next-disabled" v-else></div>
    </footer>
    <footer v-if="percentPage == 5">
      <div class="btn-box-left pre" @click="previous"></div>
      <div class="btn-box-right check-result-able" v-if="fillOver"  @click="checkResult"></div>
      <div class="btn-box-right check-result-disabled" v-else></div>
    </footer>
    <EazyNav type="brand" :isShow="false"></EazyNav>
    <!--通用弹窗-->
    <PublicPopup></PublicPopup>
  </div>
</template>

<script>
  import { GAOKAO_TEST_INDEX,GAOKAO_TEST_SUBMIT } from '@/apis/gaokaoTest';

  export default {
    data() {
      return {
        title: '',
        questionsList: [], // 所有题目列表
        percentList: [], // 当前页面展示的题目列表
        percentPage: 1, // 当前题目页
        fillList: [], // 用户填写的
        // preList: [],
        fillOver: false,
        valueObj: {}, // 提交给后台的用户填写结果
        yes: '',
        no: ''
      }
    },
    methods: {
      async gaokaoTestIndex() {
        let data = {
          version: '1.0',
        };
        let res = await GAOKAO_TEST_INDEX(data);
        if (res.hasOwnProperty('response_code')) {
          var resData = res.response_data;
          if (resData.result != '') {
            this.$router.push({name: 'resultPage'});
          } else {
            if (resData.sex==0 || !resData.birthday) {
              this.$router.push({name: 'gaokaoTestIndex'});
            }
          }

          console.log(res);
          this.questionsList = res.response_data.questions;
          for (let i in this.questionsList) {
            this.fillList[this.questionsList[i].id] = '0';  //  未填写默认0
          }

          this.percentList = this.questionsList.slice(0, 5);
        }
      },
      async gaokaoTestSubmit() {
        let data = {
          version: '1.0',
          answers: JSON.stringify(this.valueObj)
        };
        // console.log('valueObj',data.answers);
        let res = await GAOKAO_TEST_SUBMIT(data);
        if (res.hasOwnProperty('response_code')) {
          console.log(res);
          if (res.response_data.success == 1) { // 提交成功，跳转到测试结果页
            this.$router.push({name: 'resultPage'});
          }
        }
      },
      chooseYes(item,index) {
        var _list = [];
        this.fillList[item.id] = '1';
        for(let i in this.fillList){
          _list[i] = this.fillList[i];
        }
        this.fillList = [];
        this.fillList = _list;
      },
      chooseNo(item,index) {
        var _list = [];
        this.fillList[item.id] = '2';
        for(let i in this.fillList){
          _list[i] = this.fillList[i];
        }
        this.fillList = [];
        this.fillList = _list;
      },
      fillQuestions() {
        var num = 0;
        for (let i in this.percentList) {
          if (this.fillList[this.percentList[i].id] != '0') {
              num++;
          }
        }
        if (num == 5) {
          this.fillOver = true;
        } else {
          this.fillOver = false;
        }
      },
      addData() {
        //  将用户填写的fillList内容添加到valueObj
        for (let i in this.fillList) {
          this.valueObj[i] = this.fillList[i];
        }
      },
      next() {
        this.addData();
        // 显示下一页题目
        if (this.percentPage == 1) {
          this.percentList = this.questionsList.slice(5, 10);
          this.percentPage++;
          this.title = 'title-two';
        } else if (this.percentPage == 2) {
          this.percentList = this.questionsList.slice(10, 15);
          this.percentPage++;
          this.title = 'title-three';
        } else if (this.percentPage == 3) {
          this.percentList = this.questionsList.slice(15, 20);
          this.percentPage++;
          this.title = 'title-four';
        } else if (this.percentPage == 4) {
          this.percentList = this.questionsList.slice(20, 25);
          this.percentPage++;
          this.title = 'title-five';
        }
        this.fillQuestions();
      },
      previous() {
        // 显示上一页题目
        if (this.percentPage == 2) {
          this.percentList = this.questionsList.slice(0, 5);
          this.percentPage--;
          this.title = 'title-one';
        } else if (this.percentPage == 3) {
          this.percentList = this.questionsList.slice(5, 10);
          this.percentPage--;
          this.title = 'title-two';
        } else if (this.percentPage == 4) {
          this.percentList = this.questionsList.slice(10, 15);
          this.percentPage--;
          this.title = 'title-three';
        } else if (this.percentPage == 5) {
          this.percentList = this.questionsList.slice(15, 20);
          this.percentPage--;
          this.title = 'title-four';
        }
        this.fillQuestions();
      },
      checkResult() {
        this.addData();
        this.gaokaoTestSubmit();
      }
    },
    created() {
      if(localStorage.getItem('loginState') != 1) {
        this.$router.push({name: 'login'});
      }
    },
    mounted() {
      this.title = 'title-one';
      this.gaokaoTestIndex();
    }
  }
</script>

<style src="@/style/scss/pages/gaokaoTest/questionsPageTwo.scss" lang="scss" scoped>

</style>

