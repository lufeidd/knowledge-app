<template>
  <div id="activePage" :style="{'background-color':bgcolor}">
    <div class="active-bg">
      <div class="bg-piture" v-lazy:background-image="activityData.base.activity_cover"></div>
      <div class="activeRules" @click="activeRules">
        <div class="activeText">活动规则</div>
      </div>
      <!--<div class="promptTwo">
        <div class="prompt dn">邀请好友助力即可获得</div>
        <div class="prompt">星期八邀你助力,免费领取</div>
      </div>-->
    </div>
    <div class="startHelpTwo">
      <div class="startHelp" v-if="activityData.base.launch_id" @click="billShow">邀请好友助力
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-myactive_jiantou" />
        </svg>
      </div>
      <div class="startHelp" v-else @click="startHelp">开启助力</div>
    </div>
    <div class="helpFriend" v-if="activityData.base.launch_id">
      <div class="helpAndPic" v-if="activityData.launcher.curr_num > 0">
        <div class="helpCount">
          <span>已获得</span>
          <span class="text-color">{{ activityData.launcher.curr_num }}份</span>
          <span>助力</span>
        </div>
        <div class="helpPicture">
          <div class="oval" v-if="activityData.launcher.supporter_list.length > 0">
            <div class="bookImg" v-lazy:background-image="activityData.launcher.supporter_list[0].user_pic"></div>
          </div>
          <div class="oval" style="margin-left: 13px;" v-if="activityData.launcher.supporter_list.length > 1">
            <div class="bookImg" v-lazy:background-image="activityData.launcher.supporter_list[1].user_pic"></div>
          </div>
          <div class="oval" style="margin-left: 26px;" v-if="activityData.launcher.supporter_list.length > 2">
            <div class="bookImg" v-lazy:background-image="activityData.launcher.supporter_list[2].user_pic"></div>
          </div>
          <div class="picture" @click="pictureShow"></div>
        </div>
      </div>
      <div class="concern">
        <div class="svg">
          <div class="bookImg" v-lazy:background-image="activityData.base.brand_pic"></div>
        </div>
        <div class="text">
          <span>点击关注，实时查看领奖进度</span>
        </div>
        <div class="href" @click="hrefShow">
          <span>关注</span>
        </div>
      </div>
    </div>
    <div class="rewardTitle">
      <div class="line"></div>
      <div class="rewardName">邀好友，领奖励</div>
      <div class="line"></div>
    </div>
    <div class="rewardContent">
      <div v-for="(item,index) in activityData.base.reward_list" :key="index">
        <div class="bookImg" v-lazy:background-image="item.ad_pic">
          <div class="callBack">
            <div class="grade">{{index + 1}}</div>
            <div v-if="item.state == 2" class="contentBox">
              <div class="imgOne">
                <div class="content">已领取</div>
              </div>
            </div>
            <div v-else-if="item.state == 1" class="contentBox">
              <div class="imgFour">
                <div class="content" @click="addressShow(index)">已获得,点击领取</div>
              </div>
            </div>
            <div v-else-if="item.state == 0" class="contentBox">
              <div class="imgThree">
                <div class="content">还差{{ item.goal_num - item.curr_num }}份助力</div>
              </div>
            </div>
            <!--<div v-else="item.state == 0" class="contentBox">
              <div class="imgTwo">
                <div class="content">还差{{ item.goal_num - item.curr_num }}份助力</div>
              </div>
            </div>-->
          </div>
        </div>
      </div>
    </div>
    <div class="activeMore">
        <div class="moreText" @click="outLink">
          前往更多活动
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-myactive_jiantou" />
          </svg>
        </div>
    </div>
    <div class="ranking">
      <div class="ranking-tit">
        <div class="line"></div>
        <div class="rankingTitle">排行榜</div>
        <div class="line"></div>
      </div>
      <div class="rankingContet">
        <div v-for="(item,index) in activityData.rank" :key="index">
          <div class="rankingMember">
            <div class="grade">NO&nbsp;{{index + 1}}</div>
            <div class="bookImg" v-lazy:background-image="item.user_pic"></div>
            <div class="title">{{item.nickname}}</div>
            <div class="count">{{item.support_nums}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="rules" id="rules">
      <div class="rules-tit">
        <div class="line"></div>
        <div class="rulesTitle">活动规则</div>
        <div class="line"></div>
      </div>
      <div class="rulesCount">{{ activityData.base.rules }}</div>
    </div>
    <!-- 点击好友头像显示的弹层 -->
    <van-popup v-model="pictureShowPopup" class="picturePopup">
      <svg class="icon close" aria-hidden="true" @click="pictureClose">
        <use xlink:href="#icon-shanchu" />
      </svg>
      <div class="firendList">
        <div class="firendList-tit">
          <div class="firendListTitle">助力名单</div>
        </div>
        <div class="friendContet" v-if="helpFriendList">
          <div v-for="(Item,index) in supporterData.response_data.supporter_list" :key="index">
            <div class="friendMember">
              <div class="bookImg" v-lazy:background-image="Item.user_header"></div>
              <div class="title">{{Item.nickname}}</div>
              <div class="day">{{Item.md}}</div>
              <div class="time">{{Item.his}}</div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
    <!-- 点击关注显示的弹层 -->
    <van-popup v-model="hrefShowPopup" class="hrefPopup">
    <svg class="icon close" aria-hidden="true" @click="hrefClose">
      <use xlink:href="#icon-close-line" />
    </svg>
    <div class="hrefTitle">
      {{ activityData.base.qr_desc }}
    </div>
    <div class="hrefName">一些诱惑性文字一些诱惑性文字</div>
    <div class="hrefText">
      一些诱惑性文字
    </div>
    <div class="hrefLine"></div>
    <div class="box">
      <div class="bookImg" v-lazy:background-image="activityData.base.qr_url"></div>
    </div>
    <div class="imgText">长按识别二维码，关注公众号</div>
  </van-popup>
    <!-- 海报显示的弹层 -->
    <van-popup v-model="billShowPopup" class="billPopup">
      <svg class="icon close" aria-hidden="true" @click="billClose">
        <use xlink:href="#icon-close-line" />
      </svg>
      <div class="box">
        <div class="bookImg" v-lazy:background-image="supporterData.pic_url"></div>
      </div>
      <div class="imgText">长按保存海报，分享好友邀请助力</div>
    </van-popup>
    <!-- 点击获取地址显示的弹层 -->
    <van-popup v-model="addressShowPopup" class="addressPopup">
      <svg class="icon close" aria-hidden="true" @click="addressClose">
        <use xlink:href="#icon-close-line" />
      </svg>
      <div class="addressBox">
        <div v-for="(Item,index) in addressData" :key="index">
          <div class="addressMember">
            <div
              class="default"
              @click="editAction(Item.address_id)"
              :class="{ active: Item.is_default == 1 }"
            >
              <svg class="icon" aria-hidden="true" v-if="Item.is_default == 1">
                <use xlink:href="#icon-checked-block" />
              </svg>
              <svg class="icon" aria-hidden="true" v-else>
                <use xlink:href="#icon-uncheck-line" />
              </svg>
            </div>
            <div class="title">{{ Item.consignee }}/{{ Item.mobile }}/{{ Item.province }}{{ Item.city }}{{ Item.county }}{{ Item.address }}</div>
          </div>
        </div>
      </div>
      <div class="button">
        <div class="addButton">
          <div class="box" @click="addAddress">新增地址</div>
        </div>
        <div class="define" v-if="addressData.length">
          <div class="box" @click="sureAddress">确定地址</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<style src="@/style/scss/pages/assist/active.scss" scoped lang="scss"></style>

<style lang="scss" scoped>
  #activePage{

  }
</style>
<script>
  import { ASSISTANCE_DETAIL , ASSISTANCE_POSTER , ASSISTANCE_SUPPORTER , ASSISTANCE_TAKEPRIZE } from "../../apis/assist";
  import {LOGIN_PARTERNER} from "../../apis/passport.js";
  import { USER_ADDRESS_EDIT , USER_ADDRESS_LIST } from "../../apis/user.js";
  export default {
    data() {
      return {
        pictureShowPopup: false,
        hrefShowPopup: false,
        addressShowPopup: false,
        billShowPopup: false,
        helpFriendList: false,
        headimg: "",
        nickname: "",
        openid: "",
        unionid: "",
        activityData: {
          base: {},
          launcher: {},
          rank: {}
        },
        posterData: {

        },
        supporterData: {
        },
        addressData: [],
        activity_id: 0,
        addressId: 0,
        bgcolor: "",
        awardId: 0,
        activeList: [
          {pic:"http://file.mhuoba.com/picture/shopadmin/20190705/11/20190705111229706.jpg"}
        ],
      }
    },
    mounted () {
      this.activity_id = this.$route.query.activity_id;
      this.activeGetData();
      //获取微信信息
      this.headimg = localStorage.getItem("headimg");
      this.nickname = localStorage.getItem("nickname");
      this.openid = localStorage.getItem("openid");
      this.unionid = localStorage.getItem("unionid");
    },
    methods: {
      activeRules () {
        document.querySelector("#rules").scrollIntoView(true);
      },
      pictureShow () {
        this.supporterGetData();
      },
      pictureClose () {
        this.pictureShowPopup = false;
      },
      hrefShow () {
        this.hrefShowPopup = true;
      },
      hrefClose () {
        this.hrefShowPopup = false;
      },
      addressShow (index) {
        if (this.activityData.base.reward_list[index].traget_type == 1) {
          this.awardId = index;
          this.getAddressData();
        } else {
          this.takePrize();
        }
      },
      addressClose () {
        this.addressShowPopup = false;
      },
      async billShow () {
        var tStamp = this.$getTimeStamp();
        var data = {
          launch_id: this.activityData.base.launch_id,
          version: "1.0",
          timestamp: tStamp
        };
        data.sign = this.$getSign(data);
        let res = await ASSISTANCE_POSTER(data);
        if (res.hasOwnProperty("response_code")) {
          this.posterData = res.response_data;
        } else {
          this.$toast(res.error_message);
        }
        this.billShowPopup = true;
      },
      billClose () {
        this.billShowPopup = false;
      },
      // 新增收货地址
      addAddress () {
        this.$router.push({ name: "address", query: { pageType: "add" } });
      },
      outLink () {
        window.location.href = this.activityData.base.jump_url;
      },
      // 获取我的收货地址信息
      async getAddressData () {
        var tStamp = this.$getTimeStamp();
        let data = {
          timestamp: tStamp,
          version: "1.0"
        };
        data.sign = this.$getSign(data);
        let res = await USER_ADDRESS_LIST(data);
        if (res.hasOwnProperty("response_code")) {
          // store 设置登录状态
          this.$store.commit("changeLoginState", 1);
          localStorage.setItem("loginState", 1);

          this.addressData = [];
          for (let i = 0; i < res.response_data.length; i++) {
            if (res.response_data[i].is_default == 1) {
              this.addressId = res.response_data[i].address_id;
            }
            this.addressData.push(res.response_data[i]);
          }
          this.addressShowPopup = true;
        } else {
          if (res.hasOwnProperty("error_code") && res.error_code == 100) {
            // store 设置登录状态
            this.$store.commit("changeLoginState", 100);
            localStorage.setItem("loginState", 100);
          }
          this.$toast(res.error_message);
        }
      },
      // 修改当前地址
      async editAddress (addressId, key) {
        var tStamp = this.$getTimeStamp();
        let data = {
          timestamp: tStamp,
          address_id: addressId,
          is_default: 1,
          version: "1.0"
        };
        data.sign = this.$getSign(data);
        let res = await USER_ADDRESS_EDIT(data);
        if (res.hasOwnProperty("response_code")) {
          this.getAddressData();
          // 从订单确认页面进入的获取地址需要主动回退
          if(this.$route.query.type && this.$route.query.type == 'confirm') {
            this.$router.go(-1);
          }
        } else {
          this.$toast(res.error_message);
        }
      },
      editAction(address_id, key) {
        this.editAddress(address_id, key);
      },
      // 获取活动页基本信息
      async activeGetData () {
        var tStamp = this.$getTimeStamp();
        var data = {
          activity_id: this.activity_id,
          openid: this.openid,
          version: "1.0",
          timestamp: tStamp
        };
        data.sign = this.$getSign(data);
        let res = await ASSISTANCE_DETAIL(data);
        if (res.hasOwnProperty("response_code")) {
          this.activityData = res.response_data;

          this.bgcolor = res.response_data.base.background;
        } else {
          this.$toast(res.error_message);
        }
      },
      //开启助力点击
      async startHelp () {
        var tStamp = this.$getTimeStamp();
        var data = {
          outer_id: this.unionid,
          type: 2,
          outer_name: this.nickname,
          header_pic: this.headimg,
          version: "1.0",
          timestamp: tStamp
        };
        data.sign = this.$getSign(data);
        let res = await LOGIN_PARTERNER(data);
        if (res.hasOwnProperty("response_code")) {
          if (res.response_data.exist == 1) {
            //登陆成功

          } else {
            this.$router.push({
              name: "bindphone",
              query: {
                activity_id: this.activity_id
              }
            });
          }
        } else {
          this.$toast(res.error_message);
        }
      },
      //获取助力名单
      async supporterGetData () {
        var tStamp = this.$getTimeStamp();
        var data = {
          launch_id: this.activityData.base.launch_id,
          version: "1.0",
          timestamp: tStamp
        };
        data.sign = this.$getSign(data);
        let res = await ASSISTANCE_SUPPORTER(data);
        if (res.hasOwnProperty("response_code")) {
          this.supporterData = res.response_data;
          this.helpFriendList = true;
          this.pictureShowPopup = true;
        } else {
          this.$toast(res.error_message);
        }
      },
      //确定地址
      async sureAddress () {
        for (let i = 0; i < this.addressData.length; i++) {
          if (this.addressData[i].is_default == 1) {
            this.takePrize();
            return false;
          }
        }
        this.$dialog.alert({
          message: '请选择地址'
        });
      },
      //领取奖励接口
      async takePrize () {
        var tStamp = this.$getTimeStamp();
        var data = {
          launch_id: this.activityData.base.launch_id,
          address_id: this.addressId,
          award_id: this.activityData.base.reward_list[this.awardId].award_id,
          version: "1.0",
          timestamp: tStamp
        };
        data.sign = this.$getSign(data);
        let res = await ASSISTANCE_TAKEPRIZE(data);
        if (res.hasOwnProperty("response_code")) {
          if(res.response_data.state == "suc") {
            this.$toast("领取成功");
            this.addressClose();
          } else {
            this.$toast(res.error_message);
          }
        } else {
          this.$toast(res.error_message);
        }
      }
    }
  }
</script>
