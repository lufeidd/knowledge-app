<template>
  <div id="interest">
    <!-- 0 封面 -->
    <div v-if="pageType == 0" class="box indexBox">
      <div class="content">
        <img
          src="./../../assets/activity/interest/indexButton.png"
          width="40%"
          @click="nextAction('next')"
        />
        <!-- <img v-lazy="require('./../../assets/activity/interest/indexButton.png')" /> -->
        <!-- <div class="bookImg" v-lazy:background-image="require('../assets/copyright_logo.png')"></div> -->
        <p>累计已有{{ join_nums }}人参与</p>
      </div>
    </div>
    <!-- 1 性别 -->
    <div v-if="pageType == 1" class="box sexBox">
      <img v-lazy="require('./../../assets/activity/interest/sex.png')" width="100%" />
      <div class="choise">
        <van-row>
          <van-col span="12">
            <img
              src="./../../assets/activity/interest/man.png"
              @click="sexAction(1)"
              :class="{ active: sexType == 1 }"
            />
          </van-col>
          <van-col span="12">
            <img
              src="./../../assets/activity/interest/woman.png"
              @click="sexAction(2)"
              :class="{ active: sexType == 2 }"
            />
          </van-col>
        </van-row>
      </div>
      <div>
        <img
          src="./../../assets/activity/interest/next.png"
          width="25%"
          @click="nextAction('next')"
        />
      </div>
    </div>
    <!-- 2 阶段 -->
    <div v-if="pageType == 2" class="box rankBox">
      <img v-lazy="require('./../../assets/activity/interest/rank.png')" width="100%" />
      <div class="choise">
        <van-row>
          <van-col span="8">
            <img
              src="./../../assets/activity/interest/rank-1.png"
              width="60%"
              @click="rankAction(1)"
              :class="{ active: rankType == 1 }"
            />
          </van-col>
          <van-col span="8">
            <img
              src="./../../assets/activity/interest/rank-2.png"
              width="60%"
              @click="rankAction(2)"
              :class="{ active: rankType == 2 }"
            />
          </van-col>
          <van-col span="8">
            <img
              src="./../../assets/activity/interest/rank-3.png"
              width="60%"
              @click="rankAction(3)"
              :class="{ active: rankType == 3 }"
            />
          </van-col>
          <van-col span="8">
            <img
              src="./../../assets/activity/interest/rank-4.png"
              width="60%"
              @click="rankAction(4)"
              :class="{ active: rankType == 4 }"
            />
          </van-col>
          <van-col span="8">
            <img
              src="./../../assets/activity/interest/rank-5.png"
              width="60%"
              @click="rankAction(5)"
              :class="{ active: rankType == 5 }"
            />
          </van-col>
          <van-col span="8">
            <img
              src="./../../assets/activity/interest/rank-6.png"
              width="60%"
              @click="rankAction(6)"
              :class="{ active: rankType == 6 }"
            />
          </van-col>
        </van-row>
      </div>
      <div class="content">
        <van-row>
          <van-col span="12">
            <img src="./../../assets/activity/interest/prev.png" width="70%" @click="prevAction" />
          </van-col>
          <van-col span="12">
            <img
              src="./../../assets/activity/interest/next.png"
              width="70%"
              @click="nextAction('next')"
            />
          </van-col>
        </van-row>
      </div>
    </div>
    <!-- 3 计划 -->
    <div v-if="pageType == 3" class="box planBox">
      <img v-lazy="require('./../../assets/activity/interest/plan.png')" width="100%" />
      <div class="choise">
        <van-row>
          <van-col span="24">
            <img
              src="./../../assets/activity/interest/plan-1.png"
              width="100%"
              @click="planAction(1)"
              :class="{ active: planType == 1 }"
            />
          </van-col>
          <van-col span="24">
            <img
              src="./../../assets/activity/interest/plan-2.png"
              width="100%"
              @click="planAction(2)"
              :class="{ active: planType == 2 }"
            />
          </van-col>
          <van-col span="24">
            <img
              src="./../../assets/activity/interest/plan-3.png"
              width="100%"
              @click="planAction(3)"
              :class="{ active: planType == 3 }"
            />
          </van-col>
          <van-col span="24">
            <img
              src="./../../assets/activity/interest/plan-4.png"
              width="100%"
              @click="planAction(4)"
              :class="{ active: planType == 4 }"
            />
          </van-col>
        </van-row>
      </div>
      <div class="content">
        <van-row>
          <van-col span="12">
            <img src="./../../assets/activity/interest/prev.png" width="70%" @click="prevAction" />
          </van-col>
          <van-col span="12">
            <img
              src="./../../assets/activity/interest/next.png"
              width="70%"
              @click="nextAction('next')"
            />
          </van-col>
        </van-row>
      </div>
    </div>
    <!-- 4 知识 -->
    <div v-if="pageType == 4" class="box knowledgeBox">
      <img v-lazy="require('./../../assets/activity/interest/knowledge.png')" width="100%" />
      <div class="choise">
        <van-row>
          <van-col span="24">
            <img
              src="./../../assets/activity/interest/knowledge-1.png"
              width="100%"
              @click="knowledgeAction(1)"
              :class="{ active: knowledgeType == 1 }"
            />
          </van-col>
          <van-col span="24">
            <img
              src="./../../assets/activity/interest/knowledge-2.png"
              width="100%"
              @click="knowledgeAction(2)"
              :class="{ active: knowledgeType == 2 }"
            />
          </van-col>
          <van-col span="24">
            <img
              src="./../../assets/activity/interest/knowledge-3.png"
              width="100%"
              @click="knowledgeAction(3)"
              :class="{ active: knowledgeType == 3 }"
            />
          </van-col>
          <van-col span="24">
            <img
              src="./../../assets/activity/interest/knowledge-4.png"
              width="100%"
              @click="knowledgeAction(4)"
              :class="{ active: knowledgeType == 4 }"
            />
          </van-col>
          <van-col span="24">
            <img
              src="./../../assets/activity/interest/knowledge-5.png"
              width="100%"
              @click="knowledgeAction(5)"
              :class="{ active: knowledgeType == 5 }"
            />
          </van-col>
        </van-row>
      </div>
      <div class="content">
        <van-row>
          <van-col span="12">
            <img src="./../../assets/activity/interest/prev.png" width="70%" @click="prevAction" />
          </van-col>
          <van-col span="12">
            <img
              src="./../../assets/activity/interest/end.png"
              width="70%"
              @click="nextAction('end')"
            />
          </van-col>
        </van-row>
      </div>
    </div>
    <!-- 5 推送结果 -->
    <div v-if="pageType == 5" class="box endBox">
      <img
        v-lazy="require('./../../assets/activity/interest/result/baby.jpg')"
        v-if="knowledgeType == 1"
      />
      <img
        v-lazy="require('./../../assets/activity/interest/result/job.jpg')"
        v-if="knowledgeType == 2"
      />
      <img
        v-lazy="require('./../../assets/activity/interest/result/learn.jpg')"
        v-if="knowledgeType == 3"
      />
      <img
        v-lazy="require('./../../assets/activity/interest/result/student.jpg')"
        v-if="knowledgeType == 4"
      />
      <img
        v-lazy="require('./../../assets/activity/interest/result/life.jpg')"
        v-if="knowledgeType == 5"
      />

      <div class="section">
        <div
          class="bookDetail"
          v-for="(item, index) in recommend_goods"
          :key="index"
          @click="toDetail(item)"
        >
          <div class="ratiobox">
            <a class="bookImg" v-lazy:background-image="item.pic"></a>
          </div>
          <div class="title">{{ item.title }}</div>
          <div class="button">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-bofang_zhongxinbofang" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/activity/interest.scss" scoped lang="scss"></style>
<style lang="scss">
.van-button--plain {
  background-color: #fff;
}
.van-button--primary {
  border-color: #fff;
}
[class*="van-hairline"][data-v-0b517b56]:after {
  border-color: #fff;
}
.van-button--plain.van-button--primary {
  color: #7986ff;
}
.van-button--small {
  min-width: 85px;
  display: block;
  margin: 0 auto;
}
</style>

<script>
import axios from "axios";
//  引入接口
import { ACTIVITY_INTEREST_INDEX } from "../../apis/activity.js";
import { ACTIVITY_INTEREST_JOIN } from "../../apis/activity.js";

export default {
  data() {
    return {
      joininfo: [],
      join_nums: 0,
      pageType: 0,
      // 性别
      sexType: 1,
      // 阶段
      rankType: 1,
      // 计划
      planType: 1,
      // 知识
      knowledgeType: 1,
      recommend_goods: [],
      is_login: 0
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    // 选择性别
    sexAction(t) {
      this.sexType = t;
    },
    // 选择阶段
    rankAction(t) {
      this.rankType = t;
    },
    // 计划
    planAction(t) {
      this.planType = t;
    },
    // 知识
    knowledgeAction(t) {
      this.knowledgeType = t;
    },
    // 下一步
    nextAction(_t) {
      // 未登录跳转到登录页
      if (this.is_login == 0) {
        this.$router.push({
          name: "login"
        });
      } else {
        let _type = this.pageType;
        _type++;
        // 查看结果
        if (_t == "end") {
          this.joinData();
        } else {
          // 未参加过答卷活动
          if (this.joininfo && this.joininfo.user_id) {
            // 参加过答卷跳到结果页
            this.knowledgeType = this.joininfo.question4;
            _type = 5;
            this.joinData();
          }
        }
        this.pageType = _type;
      }
    },
    // 上一步
    prevAction() {
      let _type = this.pageType;
      _type--;
      this.pageType = _type;
    },
    // 首次进入监测账号
    async initData() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        version: "1.0",
      };
      data.sign = this.$getSign(data);
      let res = await ACTIVITY_INTEREST_INDEX(data);
      if (res.hasOwnProperty("response_code")) {
        this.join_nums = res.response_data.join_nums;
        this.joininfo = res.response_data.joininfo;
        this.is_login = res.response_data.is_login;

        // 获取页面分享信息
        var _pageName = "activity/interest";
        var _params = JSON.stringify({});
        if (this.isWxLogin) this.$getWxShareData(_pageName, _params);

      } else {
        // this.$toast(res.error_message);
      }
    },
    // 获取结果
    async joinData() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        version: "1.0",
        question1: this.sexType,
        question2: this.rankType,
        question3: this.planType,
        question4: this.knowledgeType
      };
      data.sign = this.$getSign(data);
      let res = await ACTIVITY_INTEREST_JOIN(data);
      if (res.hasOwnProperty("response_code")) {
        this.recommend_goods = res.response_data.recommend_goods;
      } else {
        this.$toast(res.error_message);
      }
    },
    // 商品详情
    toDetail(item) {
      if(item.url) window.location.href = item.url;

      // var __name = null;
      // var queryTmp = {};
      // switch (item.type) {
      //   case 1:
      //     // 音/视频
      //     if (item.goods_type == 1 || item.goods_type == 2) {
      //       __name = "albumdetail";
      //     }
      //     if (item.goods_type == 6) {
      //       // 文章
      //       __name = "article";
      //     }
      //     if (item.goods_type == 9) {
      //       // 专辑
      //       __name = "album";
      //     }
      //     if (item.goods_type == 3) {
      //       // 图书
      //       __name = "detail";
      //     }
      //     if (item.goods_type == 4) {
      //       // 电子书
      //       __name = "ebookdetail";
      //     }
      //     break;
      //   case 2:
      //     // 自定义页面
      //     __name = "custompage";
      //     break;
      //   default:
      //     break;
      // }
      // if (item.goods_id) queryTmp.goods_id = item.goods_id;
      // if (item.brand_id) queryTmp.brand_id = item.brand_id;
      // if (item.home_id) queryTmp.home_id = item.home_id;
      // if (item.page_id) queryTmp.page_id = item.page_id;
      // if (item.supplier_id) queryTmp.supplier_id = item.supplier_id;
      // this.$router.push({
      //   name: __name,
      //   query: queryTmp
      // });
    }
  }
};
</script>
