<template>
  <div id="activePage" :style="{'background-color':bgcolor}">
    <div class="active-bg">
      <div class="bg-piture" :style="{backgroundImage:'url('+activityData.base.activity_cover+')'}"></div>
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
      <div class="helpAndPic">
        <div class="helpCount" :style="{'color':color}">
          <span>已获得</span>
          <span class="text-color" :style="{'color':lightcolor}">{{ activityData.launcher.curr_num }}人</span>
          <span>助力</span>
        </div>
        <div class="helpPicture" @click="pictureShow">
          <div class="oval" v-if="activityData.launcher.supporter_list.length > 0">
            <div class="bookImg" v-lazy:background-image="activityData.launcher.supporter_list[0].user_pic"></div>
          </div>
          <div class="oval" style="right: 33px;" v-if="activityData.launcher.supporter_list.length > 1">
            <div class="bookImg" v-lazy:background-image="activityData.launcher.supporter_list[1].user_pic"></div>
          </div>
          <div class="oval" style="right: 46px;" v-if="activityData.launcher.supporter_list.length > 2">
            <div class="bookImg" v-lazy:background-image="activityData.launcher.supporter_list[2].user_pic"></div>
          </div>
          <div class="picture"></div>
        </div>
      </div>
      <div class="concern">
        <div class="svg">
          <div class="bookImg" v-lazy:background-image="activityData.base.brand_pic"></div>
        </div>
        <div class="text" :style="{'color':color}">
          <span>关注"火把知识"公众号,查看领奖提醒</span>
        </div>
        <div class="href" @click="hrefShow">
          <span>关注</span>
        </div>
      </div>
    </div>
    <div class="rewardTitle" :style="{'color':color}">
      <div class="line"></div>
      <div class="rewardName">邀好友，领奖励</div>
      <div class="line"></div>
    </div>
    <div class="rewardContent">
      <div v-for="(item,index) in activityData.base.reward_list" :key="index">
        <div class="bookImg" v-lazy:background-image="item.ad_pic" @click="receiveAwardes(item,index)">
          <div class="callBack">
            <div class="grade">奖品{{index + 1}}</div>
            <div v-if="item.state == 2" class="contentBox">
              <div class="imgOne">
                <div class="content">已领取</div>
              </div>
            </div>
            <div v-else-if="item.state == 1" class="contentBox">
              <div class="imgFour">
                <div class="content">已获得，点击领取</div>
              </div>
            </div>
            <div v-else-if="item.state == 0 && activityData.base.launch_id != 0" class="contentBox">
              <div class="imgThree">
                <div class="content">还差{{ item.goal_num - item.curr_num }}人助力</div>
              </div>
            </div>
            <div v-else-if="item.state == 0 && activityData.base.launch_id == 0" class="contentBox">
              <div class="imgThree">
                <div class="content">需{{ item.goal_num - item.curr_num }}人助力</div>
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
    <div class="activeMore" id="activetyMore">
        <div class="moreText" @click="outLink">
          前往更多活动
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-myactive_jiantou" />
          </svg>
        </div>
    </div>
    <div class="ranking" v-if="this.activityData.rank.length > 0 ? true : false">
      <div class="ranking-tit" :style="{'color':color}">
        <div class="line"></div>
        <div class="rankingTitle">排行榜</div>
        <div class="line"></div>
      </div>
      <div class="rankingContet">
        <div v-for="(item,index) in activityData.rank" :key="index">
          <div class="rankingMember" :style="{'color':color}">
            <div class="grade">No.{{index + 1}}</div>
            <div style="width: 20px;">
              <div class="bookImg" v-lazy:background-image="item.user_pic"></div>
            </div>
            <div class="title">{{item.nickname}}</div>
            <div class="count">已获得{{item.support_nums}}人助力</div>
          </div>
        </div>
      </div>
    </div>
    <div class="rules" id="rules">
      <div class="rules-tit" :style="{'color':color}">
        <div class="line"></div>
        <div class="rulesTitle">活动规则</div>
        <div class="line"></div>
      </div>
      <div class="rulesCount" :style="{'color':color}" v-html="changeHtml(activityData.base.rules)"></div>
    </div>
    <div class="HuoBaApp" @click="HuoBaApp">
      <div class="svg">
        <div class="bookImg" v-lazy:background-image="activityData.base.brand_pic"></div>
      </div>
      <div class="Text">
        <div class="top">火把知识</div>
        <div class="bottom">让知识照亮未来!</div>
      </div>
      <div class="button">立即打开</div>
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
              <div style="width: 21px;">
                <div class="bookImg" v-lazy:background-image="Item.user_header"></div>
              </div>
              <div class="title">{{Item.nickname}}</div>
              <div class="day">{{Item.md}}</div>
              <div class="time">{{Item.his}}</div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
    <!-- 点击关注显示的弹层 -->
    <!--<van-popup v-model="hrefShowPopup" class="hrefPopup">
    <svg class="icon close" aria-hidden="true" @click="hrefClose">
      <use xlink:href="#icon-close-line" />
    </svg>
    <div class="hrefTitle">
      {{ activityData.base.qr_desc }}
    </div>
    <div class="hrefName">{{ activityData.base.qr_desc_2 }}</div>
    <div class="hrefText">
      {{ activityData.base.qr_desc_3 }}
    </div>
    <div class="hrefLine"></div>
    <div class="box">
      <img class="bookImg" :src= activityData.base.qr_url />
    </div>
    <div class="imgText">长按识别二维码，关注公众号</div>
  </van-popup>-->
    <van-popup v-model="hrefShowPopup" class="hrefPopup">
      <!--<svg class="icon close" aria-hidden="true" @click="hrefClose">
        <use xlink:href="#icon-close-line" />
      </svg>-->
      <svg class="icon close" aria-hidden="true" @click="hrefClose">
        <use xlink:href="#icon-shanchu" />
      </svg>
      <div class="box">
        <img class="bookImg" :src= activityData.base.qr_url />
      </div>
    </van-popup>
    <!-- 海报显示的弹层 -->
    <van-popup v-model="billShowPopup" class="billPopup">
      <!--<svg class="icon close" aria-hidden="true" @click="billClose">
        <use xlink:href="#icon-close-line" />
      </svg>-->
      <svg class="icon close" aria-hidden="true" @click="billClose">
        <use xlink:href="#icon-shanchu" />
      </svg>
      <div class="box">
        <img class="bookImg" :src= posterData.pic_url />
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
        activityData: {
          base: {
            rules:""
          },
          launcher: {},
          rank: {}
        },
        source: 0,
        shareData: {
          share_info: {}
        },
        posterData: {

        },
        supporterData: {
        },
        addressData: [],
        activity_id: 0,
        addressId: 0,
        bgcolor: "",
        color: "",
        lightcolor: "",
        awardId: 0,
        activeList: [
          {pic:"http://file.mhuoba.com/picture/shopadmin/20190705/11/20190705111229706.jpg"}
        ],
      }
    },
    mounted () {
      this.activity_id = this.$route.query.activity_id;
      this.source = this.$route.query.source;
      this.activeGetData();
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
          this.awardId = index;
          this.takePrize();
        }
      },
      addressClose () {
        this.addressShowPopup = false;
      },
      async billShow () {
        var tStamp = this.$getTimeStamp();
		if (this.activityData.base.launch_id > 0) {
		var data = {
          launch_id: this.activityData.base.launch_id,
          version: "1.0",
          timestamp: tStamp
        };
        data.sign = this.$getSign(data);
        let res = await ASSISTANCE_POSTER(data);
        if (res.hasOwnProperty("response_code")) {
          this.posterData = res.response_data;
          this.billShowPopup = true;
        } else {
          this.$toast(res.error_message);
          document.querySelector("#activetyMore").scrollIntoView(true);
        }
		}
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
        //获取微信信息
        var tStamp = this.$getTimeStamp();
        var data = {
          activity_id: this.activity_id,
          openid: localStorage.getItem("openid"),
          version: "1.0",
          timestamp: tStamp
        };
        data.sign = this.$getSign(data);
        let res = await ASSISTANCE_DETAIL(data);
        if (res.hasOwnProperty("response_code")) {
          this.activityData = res.response_data;
          this.bgcolor = res.response_data.base.background;
          this.color = res.response_data.base.textcolor;
          this.lightcolor = res.response_data.base.lightcolor;

          if (this.source == 1) {
            this.billShow();
            this.$router.push({
              name:"assistactive",
              query:{
                activity_id:this.activity_id,
                source:0,
              }
            })
          }
          this.pageShareInfo();
        } else {
          this.$toast(res.error_message);
        }
      },
      // 页面分享信息获取方法
      pageShareInfo () {
        if (this.isWxLogin) this.$getWxShareData("assist/index", JSON.stringify({
          launch_id: this.activityData.base.launch_id,
          activity_id: this.activity_id
        }));
      },
      // 开启助力点击
      async startHelp () {
        var tStamp = this.$getTimeStamp();
        var data = {
          outer_id: localStorage.getItem("unionid"),
          type: 2,
          outer_name: localStorage.getItem("nickname"),
          header_pic: localStorage.getItem("headimg"),
          openid: localStorage.getItem("openid"),
          version: "1.0",
          timestamp: tStamp
        };
        data.sign = this.$getSign(data);
        let res = await LOGIN_PARTERNER(data);
        if (res.hasOwnProperty("response_code")) {
          if (res.response_data.exist == 1) {
            //登陆成功
            window.location.reload();
          } else {
            this.$router.push({
              name: "bindphone",
              query: {
                activity_id: this.activity_id,
                bindtype: 2,
                outerId: localStorage.getItem("unionid")
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
            this.activityData.base.reward_list[this.awardId].state = 2;
            this.addressClose();
          } else {
            this.$toast(res.error_message);
          }
        } else {
          this.$toast(res.error_message);
        }
      },
      //领取奖励
      receiveAwardes (item,index) {
        if (item.state == 2) {
          if (item.traget_url) {
            window.location.href = item.traget_url;
          }
        } else if (item.state == 1) {
          if (this.activityData.base.user_id != 0) {
            this.addressShow(index);
          }
        } else if (item.state == 0 && this.activityData.base.launch_id != 0) {
          if (item.traget_url) {
            window.location.href = item.traget_url;
          }
        } else if (item.state == 0 && this.activityData.base.launch_id == 0) {
          if (item.traget_url) {
            window.location.href = item.traget_url;
          }
        }
      },
      changeHtml (content) {
        return content.replace(/\n/g, "<br>");
      },
      HuoBaApp () {
        window.location.href = "https://a.app.qq.com/o/simple.jsp?pkgname=com.huoba.Huoba";
      }
    }
  }
</script>
