<template>
  <div id="personalPage">
    <!-- 头部 -->
    <div class="infoBox">
      <div class="left">
        <div class="ratioBox" v-if="infoData.is_login && infoData.user_header != ''"></div>
        <div class="ratioBox active" v-else>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-personal-block" />
          </svg>
        </div>
      </div>
      <div class="right">
        <div class="title">
          <div class="desc">
            <span v-if="infoData.is_login">{{ infoData.user_name }}</span>
            <router-link style="color: #fff;" :to="{name: 'login'}" v-else>点击登录</router-link>
          </div>
          <div class="action">
            <!-- <a class="tip" href="/personal/news">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-personalNews"></use>
              </svg>
            </a>-->
            <router-link v-if="infoData.is_login" :to="{path: '/personal/set/index'}">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-personalSet" />
              </svg>
            </router-link>
            <router-link v-else :to="{path: '/login/index'}">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-personalSet" />
              </svg>
            </router-link>
          </div>
        </div>
        <div class="subTitle" v-if="!infoData.is_login">登录后同步您的收藏</div>
      </div>
    </div>

    <!-- 关注/收藏/历史 -->
    <div class="entryBox">
      <van-row type="flex" justify="space-around">
        <van-col span="6">
          <router-link to="/personal/focus" v-if="infoData.is_login">
            <div class="count">
              <template v-if="infoData.is_login">{{ infoData.follow_num }}</template>
              <template v-else>--</template>
            </div>
            <div class="desc">关注</div>
          </router-link>
          <router-link to="/login/index" v-else>
            <div class="count">
              <template v-if="infoData.is_login">{{ infoData.follow_num }}</template>
              <template v-else>--</template>
            </div>
            <div class="desc">关注</div>
          </router-link>
        </van-col>
        <van-col span="6">
          <router-link to="/personal/collect" v-if="infoData.is_login">
            <div class="count">
              <template v-if="infoData.is_login">{{ infoData.collect_num }}</template>
              <template v-else>--</template>
            </div>
            <div class="desc">收藏</div>
          </router-link>
          <router-link to="/login/index" v-else>
            <div class="count">
              <template v-if="infoData.is_login">{{ infoData.collect_num }}</template>
              <template v-else>--</template>
            </div>
            <div class="desc">收藏</div>
          </router-link>
        </van-col>
        <van-col span="6">
          <router-link to="/personal/history" v-if="infoData.is_login">
            <div class="count">
              <template v-if="infoData.is_login">{{ infoData.history_num }}</template>
              <template v-else>--</template>
            </div>
            <div class="desc">历史</div>
          </router-link>
          <router-link to="/login/index" v-else>
            <div class="count">
              <template v-if="infoData.is_login">{{ infoData.history_num }}</template>
              <template v-else>--</template>
            </div>
            <div class="desc">历史</div>
          </router-link>
        </van-col>
      </van-row>
    </div>

    <!-- 入口 -->
    <div class="cellBox">
      <template>
        <!-- 我的余额 -->
        <div class="cell">
          <div class="svg" @click="gotoRemain">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-personalBuy" />
            </svg>
          </div>
          <div class="desc" @click="gotoRemain">
            <span class="text">我的余额</span>
            <span class="tip">{{ infoData.balance }}</span>
          </div>
          <div class="action">
            <router-link v-if="infoData.is_login" class="text" to="/personal/remain/account">充值</router-link>
            <router-link v-else class="text" to="/login/index">充值</router-link>
          </div>
        </div>

        <!-- 我的购买 -->
        <router-link v-if="infoData.is_login" to="/personal/order/list" class="cell">
          <div class="svg">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-personalAccount" />
            </svg>
          </div>
          <div class="desc">
            <span class="text">我的订单</span>
          </div>
          <div class="action">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line" />
            </svg>
          </div>
        </router-link>
        <router-link v-else to="/login/index" class="cell">
          <div class="svg">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-personalAccount" />
            </svg>
          </div>
          <div class="desc">
            <span class="text">我的订单</span>
          </div>
          <div class="action">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line" />
            </svg>
          </div>
        </router-link>

        <!--&lt;!&ndash; 我的书架 &ndash;&gt;-->
        <!--<router-link v-if="infoData.is_login" to="/ebook/shelf" class="cell">-->
          <!--<div class="svg">-->
            <!--<svg class="icon" aria-hidden="true">-->
              <!--<use xlink:href="#icon-shelf-block" />-->
            <!--</svg>-->
          <!--</div>-->
          <!--<div class="desc">-->
            <!--<span class="text">我的书架</span>-->
          <!--</div>-->
          <!--<div class="action">-->
            <!--<svg class="icon" aria-hidden="true">-->
              <!--<use xlink:href="#icon-next-line" />-->
            <!--</svg>-->
          <!--</div>-->
        <!--</router-link>-->
        <!--<router-link v-else to="/login/index" class="cell">-->
          <!--<div class="svg">-->
            <!--<svg class="icon" aria-hidden="true">-->
              <!--<use xlink:href="#icon-personalAccount" />-->
            <!--</svg>-->
          <!--</div>-->
          <!--<div class="desc">-->
            <!--<span class="text">我的书架</span>-->
          <!--</div>-->
          <!--<div class="action">-->
            <!--<svg class="icon" aria-hidden="true">-->
              <!--<use xlink:href="#icon-next-line" />-->
            <!--</svg>-->
          <!--</div>-->
        <!--</router-link>-->

        <!-- 我听我看 -->
        <router-link  to="/listenAndRead/index" class="cell">
          <div class="svg">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-gerenzhongxinwotingwokan" />
            </svg>
          </div>
          <div class="desc">
            <span class="text">我听我看</span>
            <span class="new">New</span>
          </div>
          <div class="action">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line" />
            </svg>
          </div>
        </router-link>

        <!-- 我的购物车 -->
        <router-link v-if="infoData.is_login" to="/cart" class="cell">
          <div class="svg">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-personalCart" />
            </svg>
          </div>
          <div class="desc">
            <span class="text">我的购物车</span>
          </div>
          <div class="action">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line" />
            </svg>
          </div>
        </router-link>
        <router-link v-else to="/login/index" class="cell">
          <div class="svg">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-personalCart" />
            </svg>
          </div>
          <div class="desc">
            <span class="text">我的购物车</span>
          </div>
          <div class="action">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line" />
            </svg>
          </div>
        </router-link>

        <!-- 我的优惠券 -->
        <router-link v-if="infoData.is_login" to="/coupon/mine" class="cell">
          <div class="svg">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-personalCoupon" />
            </svg>
          </div>
          <div class="desc">
            <span class="text">我的优惠券</span>
          </div>
          <div class="action">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line" />
            </svg>
          </div>
        </router-link>
        <router-link v-else to="/login/index" class="cell">
          <div class="svg">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-personalCoupon" />
            </svg>
          </div>
          <div class="desc">
            <span class="text">我的优惠券</span>
          </div>
          <div class="action">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line" />
            </svg>
          </div>
        </router-link>

        <!-- 兑换码 -->
        <router-link to="/redeem/codeInput" class="cell">
          <div class="svg">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-personalRedeem" />
            </svg>
          </div>
          <div class="desc">
            <span class="text">兑换码</span>
          </div>
          <div class="action">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line" />
            </svg>
          </div>
        </router-link>

        <!-- 我的评论 -->
        <router-link v-if="infoData.is_login" to="/personal/comment/index" class="cell">
          <div class="svg">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-personalComment" />
            </svg>
          </div>
          <div class="desc">
            <span class="text">我的评论</span>
          </div>
          <div class="action">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line" />
            </svg>
          </div>
        </router-link>
        <router-link v-else to="/login/index" class="cell">
          <div class="svg">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-personalComment" />
            </svg>
          </div>
          <div class="desc">
            <span class="text">我的评论</span>
          </div>
          <div class="action">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line" />
            </svg>
          </div>
        </router-link>

        <!-- 帮助与反馈 -->
        <router-link to="/personal/help/index" class="cell">
          <div class="svg">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-personalHelp" />
            </svg>
          </div>
          <div class="desc">
            <span class="text">帮助与反馈</span>
          </div>
          <div class="action">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line" />
            </svg>
          </div>
        </router-link>
        <!-- <router-link v-else to="/login/index" class="cell">
          <div class="svg">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-personalHelp" />
            </svg>
          </div>
          <div class="desc">
            <span class="text">帮助与反馈</span>
          </div>
          <div class="action">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line" />
            </svg>
          </div>
        </router-link> -->
      </template>
    </div>
    <CopyRight></CopyRight>
    <!-- 快速导航 -->
    <EazyNav type="brand" :isShow="true"></EazyNav>
  </div>
</template>

<style src="@/style/scss/pages/personal/index.scss" scoped lang="scss"></style>

<script>
// import easyNav from "./../../components/easyNav";
import { mapState, mapGetters, mapActions } from "vuex";
//  引入接口
import { USER_HOMEPAGE } from "../../apis/user.js";

export default {
  // components: {
  //   easyNav
  // },
  data() {
    return {
      // 信息
      infoData: {}
    };
  },
  mounted() {
    // console.log("token:", this.$cookies.get("token"));
    this.homeData();
  },
  methods: {
    gotoRemain() {
      if (this.infoData.is_login) {
        this.$router.push({ name: "remain" });
      } else {
        this.$router.push({ name: "login" });
      }
    },
    async homeData() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await USER_HOMEPAGE(data);

      // console.log( res.response_data, this.$cookies.get("token"));

      if (res.hasOwnProperty("response_code")) {
        this.$set(this.infoData, "user_header", res.response_data.user_header);
        this.$set(this.infoData, "user_name", res.response_data.user_name);
        this.$set(this.infoData, "follow_num", res.response_data.follow_num);
        this.$set(this.infoData, "collect_num", res.response_data.collect_num);
        this.$set(this.infoData, "history_num", res.response_data.history_num);
        this.$set(this.infoData, "is_login", res.response_data.is_login);
        this.$set(this.infoData, "balance", res.response_data.balance);

        if (this.infoData.is_login == 1) {
          $(".ratioBox").css(
            "background-image",
            "url(" + this.infoData.user_header + ")"
          );
        }
      } else {
        this.$toast(res.error_message);
      }
    }
  }
};
</script>

