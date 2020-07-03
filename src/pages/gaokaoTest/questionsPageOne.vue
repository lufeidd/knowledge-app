<template>
  <div id="questionsPageOne">
    <article>
      <!--<div  class="introduce">-->
        <!--<img src="./../../assets/gaokaoTest/introduce.png" width="100%" alt="">-->

      <!--</div>-->
      <div class="introduce"></div>
      <div class="question-wrapper">
        <p>你是男生还是女生？</p>
        <van-radio-group v-model="sex">
          <van-radio name="1">男生</van-radio>
          <van-radio name="2">女生</van-radio>
        </van-radio-group>
        <p>你出生的年份是？</p>
        <select v-model="birthday" onblur="window.scrollTo(0,0)">
          <option v-for="item in birthdayList" :key="item.value" :value="item.value" v-text="item.text"></option>
        </select>
      </div>
    </article>
    <footer>
      <div class="btn-box able" v-if="sex && birthday"  @click="addInfo"></div>
      <div class="btn-box disabled" v-else></div>
    </footer>
    <EazyNav type="brand" :isShow="false"></EazyNav>
  </div>
</template>

<script>
  import { GAOKAO_TEST_INDEX } from '@/apis/gaokaoTest';
  import { GAOKAO_TEST_ADD_INFO } from '@/apis/gaokaoTest';
  import { USER_INFO  } from '@/apis/user';

  export default {
    data() {
      return {
        sex: '',
        birthday: '',
        birthdayList: []
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
          }

        }
      },

      async userInfo() {
        let data = {
          version: '1.0'
        };
        let res = await USER_INFO(data);
        if (res.hasOwnProperty('response_code')) {
          let birthday;
          if (res.response_data.birthday) {
             birthday = Number(res.response_data.birthday.split('-')[0]);
          }
          this.sex = res.response_data.sex.toString();
          console.log(this.sex);
          if (birthday < 1960) {
            this.birthday = 1959;
          } else if (birthday > 2010) {
            this.birthday = 2011;
          } else {
            this.birthday = birthday;
          }
          // console.log(birthday);
        }
      },
      async addInfo() {
        let data = {
          version: '1.0',
          sex: this.sex,
          birthday: this.birthday
        };
        let res = await GAOKAO_TEST_ADD_INFO(data);
        if (res.hasOwnProperty('response_code')) {
          console.log(res);
          if (res.response_data.success == 1) { // 成功
            this.$router.push({name: 'questionsPageTwo'});
          }
        }
      },
      getBirthdayList() {
        const min = 1960;
        const max = 2010;
        let list = [];
        list.push({value: 2011, text: '2010年后'});
        for (let i = max; i >= min; i--) {
          list.push({value: i, text: i + '年'});
        }
        list.push({value: 1959, text: '1960年前'});
        this.birthdayList = list.concat();
        console.log(this.birthdayList);
      }
    },
    created() {
      if(localStorage.getItem('loginState') != 1) {
        this.$router.push({name: 'login'});
      }
    },
    mounted() {
      this.gaokaoTestIndex();
      this.userInfo();
      this.getBirthdayList();
    }
  }
</script>

<style src="@/style/scss/pages/gaokaoTest/questionsPageOne.scss" lang="scss" scoped>

</style>

