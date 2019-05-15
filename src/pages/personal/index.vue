<template>
  <div id="personalPage">
    <!-- 头部 -->
    <div class="infoBox">
      <div class="left">
        <div class="ratioBox" v-if="infoData.is_login" :class="{ active: !infoData.user_header }"></div>
        <div class="ratioBox" v-else>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-personal-block"></use>
          </svg>
        </div>
      </div>
      <div class="right">
        <div class="title">
          <div class="desc">
            <template v-if="infoData.is_login">{{ infoData.user_name }}</template>
            <template v-else>点击登录</template>
          </div>
          <div class="action">
            <!-- <a class="tip" href="/personal/news">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-personalNews"></use>
              </svg>
            </a>-->
            <router-link
              v-if="infoData.is_login"
              :to="{path: '/personal/set/index'}"
            >
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-personalSet"></use>
              </svg>
            </router-link>
            <router-link v-else :to="{path: '/login/index'}">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-personalSet"></use>
              </svg>
            </router-link>
          </div>
        </div>
        <div class="subTitle">登录后同步您的收藏</div>
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
          <div class="svg">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-personalBuy"></use>
            </svg>
          </div>
          <div class="desc">
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
              <use xlink:href="#icon-personalAccount"></use>
            </svg>
          </div>
          <div class="desc">
            <span class="text">我的购买</span>
          </div>
          <div class="action">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line"></use>
            </svg>
          </div>
        </router-link>
        <router-link v-else to="/login/index" class="cell">
          <div class="svg">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-personalAccount"></use>
            </svg>
          </div>
          <div class="desc">
            <span class="text">我的购买</span>
          </div>
          <div class="action">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line"></use>
            </svg>
          </div>
        </router-link>

        <!-- 我的购物车 -->
        <router-link v-if="infoData.is_login" to="/cart" class="cell">
          <div class="svg">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-personalCart"></use>
            </svg>
          </div>
          <div class="desc">
            <span class="text">我的购物车</span>
          </div>
          <div class="action">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line"></use>
            </svg>
          </div>
        </router-link>
        <router-link v-else to="/login/index" class="cell">
          <div class="svg">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-personalCart"></use>
            </svg>
          </div>
          <div class="desc">
            <span class="text">我的购物车</span>
          </div>
          <div class="action">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line"></use>
            </svg>
          </div>
        </router-link>

        <!-- 我的评论 -->
        <router-link v-if="infoData.is_login" to="/personal/comment/index" class="cell">
          <div class="svg">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-personalComment"></use>
            </svg>
          </div>
          <div class="desc">
            <span class="text">我的评论</span>
          </div>
          <div class="action">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line"></use>
            </svg>
          </div>
        </router-link>
        <router-link v-else to="/login/index" class="cell">
          <div class="svg">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-personalComment"></use>
            </svg>
          </div>
          <div class="desc">
            <span class="text">我的评论</span>
          </div>
          <div class="action">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line"></use>
            </svg>
          </div>
        </router-link>

        <!-- 帮助与反馈 -->
        <router-link v-if="infoData.is_login" to="/personal/help/index" class="cell">
          <div class="svg">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-personalHelp"></use>
            </svg>
          </div>
          <div class="desc">
            <span class="text">帮助与反馈</span>
          </div>
          <div class="action">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line"></use>
            </svg>
          </div>
        </router-link>
        <router-link v-else to="/login/index" class="cell">
          <div class="svg">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-personalHelp"></use>
            </svg>
          </div>
          <div class="desc">
            <span class="text">帮助与反馈</span>
          </div>
          <div class="action">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line"></use>
            </svg>
          </div>
        </router-link>

      </template>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/personal/index.scss" lang="scss"></style>

<script>
//  引入接口
import { USER_HOMEPAGE } from "../../apis/user.js";

export default {
  data() {
    return {
      // 信息
      infoData: {},
    };
  },
  mounted() {
    this.homeData();
  },
  methods: {
    async homeData() {
      let data = {
        version: "1.0"
      };
      let res = await USER_HOMEPAGE(data);
      console.log("123", res.response_data);
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
            "url(" + res.response_data.user_header + ")"
          );
        }
      } else {
        this.$toast(res.error_message);
      }
    }
  }
};
</script>

