<template>
  <div id="activePage">
    <div class="active-bg">
      <div class="bg-piture"></div>
      <div class="activeRules" @click="activeRules">活动规则</div>
      <div class="promptTwo">
        <div class="prompt dn">邀请好友助力即可获得</div>
        <div class="prompt">星期八邀你助力,免费领取</div>
      </div>
      <div class="startHelpTwo">
        <div class="startHelp">邀请好友助力</div>
        <div class="startHelp dn">开启助力</div>
      </div>
    </div>
    <div class="helpFriend">
      <div class="helpAndPic">
        <div class="helpCount">
          <span>已获得</span>
          <span class="text-color">3份</span>
          <span>助力</span>
        </div>
        <div class="helpPicture">
          <div class="oval">
            <div class="bookImg" v-lazy:background-image="activeList[0].pic"></div>
          </div>
          <div class="oval" style="margin-left: 13px;">
            <div class="bookImg" v-lazy:background-image="activeList[0].pic"></div>
          </div>
          <div class="oval" style="margin-left: 26px;">
            <div class="bookImg" v-lazy:background-image="activeList[0].pic"></div>
          </div>
          <div class="picture" @click="pictureShow"></div>
        </div>
      </div>
      <div class="concern">
        <div class="svg">
          <div class="bookImg" v-lazy:background-image="activeList[0].pic"></div>
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
      <div v-for="(rewardItem,index) in rewardList" :key="index">
        <div class="bookImg" v-lazy:background-image="rewardItem.pic">
          <div class="callBack">
            <div class="grade">LV{{index + 1}}</div>
            <div v-if="rewardItem.type == 1" class="contentBox">
              <div class="imgOne">
                <div class="content">{{rewardItem.title}}</div>
              </div>
            </div>
            <div v-else-if="rewardItem.type == 2" class="contentBox">
              <div class="imgFour">
                <div class="content" @click="addressShow">{{rewardItem.title}}</div>
              </div>
            </div>
            <div v-else-if="rewardItem.type == 3" class="contentBox">
              <div class="imgThree">
                <div class="content">{{rewardItem.title}}</div>
              </div>
            </div>
            <div v-else="rewardItem.type == 4" class="contentBox">
              <div class="imgTwo">
                <div class="content">{{rewardItem.title}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="activeMore">
      <div class="moreText">
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
        <div v-for="(rankingItem,index) in ranking" :key="index">
          <div class="rankingMember">
            <div class="grade">NO&nbsp;{{index + 1}}</div>
            <div class="bookImg" v-lazy:background-image="rankingItem.pic"></div>
            <div class="title">{{rankingItem.title}}</div>
            <div class="count">{{rankingItem.count}}</div>
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
      <div class="rulesCount">{{this.activeRule}}</div>
    </div>
    <!-- 点击好友头像显示的弹层 -->
    <van-popup v-model="pictureShowPopup" class="picturePopup">
      <!--<svg class="icon close" aria-hidden="true" @click="pictureClose">
        <use xlink:href="#icon-close-line" />
      </svg>-->
      <div class="firendList">
        <div class="firendList-tit">
          <div class="firendListTitle">助力名单</div>
        </div>
        <div class="friendContet">
          <div v-for="(Item,index) in friendHelpList" :key="index">
            <div class="friendMember">
              <div class="bookImg" v-lazy:background-image="Item.pic"></div>
              <div class="title">{{Item.title}}</div>
              <div class="day">{{Item.day}}</div>
              <div class="time">{{Item.time}}</div>
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
      一些诱惑性文字
    </div>
    <div class="hrefName">一些诱惑性文字一些诱惑性文字</div>
    <div class="hrefText">
      一些诱惑性文字
    </div>
    <div class="hrefLine"></div>
    <div class="box">
      <div class="bookImg" v-lazy:background-image="activeList[0].pic"></div>
    </div>
    <div class="imgText">长按识别二维码，关注公众号</div>
  </van-popup>
    <!-- 点击获取地址显示的弹层 -->
    <van-popup v-model="addressShowPopup" class="addressPopup">
      <svg class="icon close" aria-hidden="true" @click="addressClose">
        <use xlink:href="#icon-close-line" />
      </svg>
      <div class="addressBox">
        <div v-for="(Item,index) in addressList" :key="index">
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
            <div class="title">{{Item.title}}</div>
          </div>
        </div>
      </div>
      <div class="button">
        <div class="addButton">
          <div class="box" @click="addAddress">新增地址</div>
        </div>
        <div class="define">
          <div class="box">确定地址</div>
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
  import { ASSISTANCE_DETAIL , ASSISTANCE_SUPPORTER } from "../../apis/assist";
  export default {
    data() {
      return {
        pictureShowPopup: false,
        hrefShowPopup: false,
        addressShowPopup: false,
        activityData: {},
        activity_id: 1,
        activeList: [
          {pic:"http://file.mhuoba.com/picture/shopadmin/20190705/11/20190705111229706.jpg"}
        ],
        rewardList: [
          {pic:"https://mhuoba.oss-cn-hangzhou.aliyuncs.com/shop/5/100041/picture/article/20191019/17/201910191709165658.jpeg!w200h124r",title:"已领取",type:"1"},
          {pic:"https://mhuoba.oss-cn-hangzhou.aliyuncs.com/shop/5/100041/picture/article/20191019/17/201910191709165658.jpeg!w200h124r",title:"已获得,点击领取",type:"2"},
          {pic:"https://mhuoba.oss-cn-hangzhou.aliyuncs.com/shop/5/100041/picture/article/20191019/17/201910191709165658.jpeg!w200h124r",title:"还差35份助力",type:"3"},
          {pic:"https://mhuoba.oss-cn-hangzhou.aliyuncs.com/shop/5/100041/picture/article/20191019/17/201910191709165658.jpeg!w200h124r",title:"还差35份助力",type:"3"},
          {pic:"https://mhuoba.oss-cn-hangzhou.aliyuncs.com/shop/5/100041/picture/article/20191019/17/201910191709165658.jpeg!w200h124r",title:"需50份助力",type:"4"}
        ],
        ranking: [
          {pic:"http://file.mhuoba.com/picture/shopadmin/20190705/11/20190705111229706.jpg",title: "我是昵称锋锋风疯封峰凤冯",count: "1111111"},
          {pic:"http://file.mhuoba.com/picture/shopadmin/20190705/11/20190705111229706.jpg",title: "我是昵称锋锋风封",count: "1111111"},
          {pic:"http://file.mhuoba.com/picture/shopadmin/20190705/11/20190705111229706.jpg",title: "我是昵称锋",count: "1111111"},
          {pic:"http://file.mhuoba.com/picture/shopadmin/20190705/11/20190705111229706.jpg",title: "我是昵称锋锋风疯封",count: "1111111"},
          {pic:"http://file.mhuoba.com/picture/shopadmin/20190705/11/20190705111229706.jpg",title: "我是昵称锋锋风疯封峰凤冯",count: "1111111"}
        ],
        activeRule: "我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则",
        friendHelpList: [
          {pic:"http://file.mhuoba.com/picture/shopadmin/20190705/11/20190705111229706.jpg",title: "我是昵称锋锋风疯封峰凤冯",day: "10.29",time:"12:10:10"},
          {pic:"http://file.mhuoba.com/picture/shopadmin/20190705/11/20190705111229706.jpg",title: "我是昵称锋锋风封",day: "10.29",time:"12:10:10"},
          {pic:"http://file.mhuoba.com/picture/shopadmin/20190705/11/20190705111229706.jpg",title: "我是昵称锋",day: "10.29",time:"12:10:10"},
          {pic:"http://file.mhuoba.com/picture/shopadmin/20190705/11/20190705111229706.jpg",title: "我是昵称锋锋风疯封",day: "10.29",time:"12:10:10"},
          {pic:"http://file.mhuoba.com/picture/shopadmin/20190705/11/20190705111229706.jpg",title: "我是昵称锋锋风疯封峰凤冯",day: "10.29",time:"12:10:10"},
          {pic:"http://file.mhuoba.com/picture/shopadmin/20190705/11/20190705111229706.jpg",title: "我是昵称锋锋风疯封峰凤冯",day: "10.29",time:"12:10:10"},
          {pic:"http://file.mhuoba.com/picture/shopadmin/20190705/11/20190705111229706.jpg",title: "我是昵称锋锋风封",day: "10.29",time:"12:10:10"},
          {pic:"http://file.mhuoba.com/picture/shopadmin/20190705/11/20190705111229706.jpg",title: "我是昵称锋",day: "10.29",time:"12:10:10"},
          {pic:"http://file.mhuoba.com/picture/shopadmin/20190705/11/20190705111229706.jpg",title: "我是昵称锋锋风疯封",day: "10.29",time:"12:10:10"},
          {pic:"http://file.mhuoba.com/picture/shopadmin/20190705/11/20190705111229706.jpg",title: "我是昵称锋锋风疯封峰凤冯",day: "10.29",time:"12:10:10"},
          {pic:"http://file.mhuoba.com/picture/shopadmin/20190705/11/20190705111229706.jpg",title: "我是昵称锋锋风疯封峰凤冯",day: "10.29",time:"12:10:10"},
          {pic:"http://file.mhuoba.com/picture/shopadmin/20190705/11/20190705111229706.jpg",title: "我是昵称锋锋风封",day: "10.29",time:"12:10:10"},
          {pic:"http://file.mhuoba.com/picture/shopadmin/20190705/11/20190705111229706.jpg",title: "我是昵称锋",day: "10.29",time:"12:10:10"},
          {pic:"http://file.mhuoba.com/picture/shopadmin/20190705/11/20190705111229706.jpg",title: "我是昵称锋锋风疯封",day: "10.29",time:"12:10:10"},
          {pic:"http://file.mhuoba.com/picture/shopadmin/20190705/11/20190705111229706.jpg",title: "我是昵称锋锋风疯封峰凤冯",day: "10.29",time:"12:10:10"}
        ],
        addressList: [
          {title: "张小北/150884563211/浙江省杭州市西湖区博库网络3号",is_default: "1",address_id:"1"},
          {title: "张小北/150884563211/浙江省杭州市西湖区博库网络3号",is_default: "0",address_id:"1"},
          {title: "张小北/150884563211/浙江省杭州市西湖区博库网络3号",is_default: "0",address_id:"1"},
          {title: "张小北/150884563211/浙江省杭州市西湖区博库网络3号",is_default: "0",address_id:"1"},
          {title: "张小北/150884563211/浙江省杭州市西湖区博库网络3号",is_default: "0",address_id:"1"},
          {title: "张小北/150884563211/浙江省杭州市西湖区博库网络3号",is_default: "0",address_id:"1"},
          {title: "张小北/150884563211/浙江省杭州市西湖区博库网络3号",is_default: "0",address_id:"1"},
          {title: "张小北/150884563211/浙江省杭州市西湖区博库网络3号",is_default: "0",address_id:"1"}
        ]
      }
    },
    mounted () {
      this.activeGetData();
    },
    methods: {
      activeRules () {
        document.querySelector("#rules").scrollIntoView(true);
      },
      pictureShow () {
        this.pictureShowPopup = true;
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
      addressShow () {
        this.addressShowPopup = true;
      },
      addressClose () {
        this.addressShowPopup = false;
      },
      // 新增收货地址
      addAddress () {
        this.$router.replace({ name: "address", query: { pageType: "add" } });
      },
      // 修改当前地址
      async editAddress(addressId, key) {
        var tStamp = this.$getTimeStamp();
        let data = {
          timestamp: tStamp,
          address_id: addressId,
          is_default: 1,
          version: "1.0"
        };
        data.sign = this.$getSign(data);
        /*let res = await USER_ADDRESS_EDIT(data);
        if (res.hasOwnProperty("response_code")) {
          this.getAddressData();
          // 从订单确认页面进入的获取地址需要主动回退
          if(this.$route.query.type && this.$route.query.type == 'confirm') {
            this.$router.go(-1);
          }
        } else {
          this.$toast(res.error_message);
        }*/
      },
      editAction(address_id, key) {
        this.editAddress(address_id, key);
      },
      // 获取页面基本信息
      async activeGetData () {
        var tStamp = this.$getTimeStamp();
        var data = {
          activity_id: this.activity_id,
          version: "1.0",
          timestamp: tStamp
        };
        data.sign = this.$getSign(data);
        let res = await ASSISTANCE_DETAIL(data);
        console.log(111, data);
        console.log(222, res);
        if (res.hasOwnProperty("response_code")) {
          console.log(222, res);
          // this.activityData = res.response_data;
          // console.log(this.activityData);
        } else {
           console.log(11);
          this.$toast(res.error_message);
        }
      }
    }
  }
</script>
