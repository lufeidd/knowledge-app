<template>
  <div id="libraryDetail">
    <div class="package">
      <div class="title">
        <div class="text">
          <span class="line"></span>
          <span class="lh titleOver">{{ packageData.base.title }}</span>
        </div>
      </div>
      <div class="content">
        {{ packageData.base.summary }}
      </div>
      <div class="radioButton" v-if="email" @click="buyAction(packageData.base.goods_id)">
        <span>￥ {{ packageData.base.price }} 立即购买</span>
      </div>
      <div class="radioButton" v-else @click="emailClick">
        <img src="../../assets/library/icon_email.png" alt width="19px" height="15px"/>
        <span>免费通过邮件获取</span>
      </div>
    </div>
    <div class="content-box">
      <van-tabs v-model="activeName" v-if="pictureFile">
        <van-tab title="图片" name="a">
            <van-row class="textB">
              <van-col span="8" v-for="(item,index) in packageData.base.pic" :key="index">
                <div class="box" @click="getImg(item)">
                  <div class="bookImg" v-lazy:background-image="item"></div>
                </div>
              </van-col>
            </van-row>
        </van-tab>
        <van-tab title="文档" name="b">
          <div class="textFile">
            <div v-for="(item,index) in packageData.base.details" :key="index">
              <div class="content">
                <a
                  @click="fileClickUrl(item.file_path)"
                >
                <img src="../../assets/library/img_big2.png" alt width="30px" height="25px"/>
                <div class="text">{{ item.file_name }}</div>
                </a>
                <img src="../../assets/library/icon_dowenload.png" alt width="25px" height="25px" @click="textPackIcon"/>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
      <div class="textFile" v-else>
        <div class="file">文档</div>
        <div v-for="(item,index) in packageData.base.details" :key="index">
          <div class="content">
            <a
              @click="fileClickUrl(item.file_path)"
            >
              <img src="../../assets/library/img_big2.png" alt width="30px" height="25px"/>
              <div class="text">{{ item.file_name }}</div>
            </a>
            <img src="../../assets/library/icon_dowenload.png" alt width="25px" height="25px" @click="textPackIcon"/>
          </div>
        </div>
      </div>
    </div>
    <!--<div class="bottom">
      <div class="content">
        <img src="../../assets/library/img_big2.png" alt width="30px" height="25px"/>
        <div class="text">资源包自定义材质、模型、音乐、音效闪烁标语的显示文本和 字体。</div>
      </div>
    </div>-->
    <!-- 点击获取邮件弹窗 -->
    <van-popup v-model="emailShowPopup" class="emailPopup">
      <van-cell-group>
        <van-field v-model="emailValue" placeholder="请输入邮箱地址" class="input" />
      </van-cell-group>
      <div class="button">
        <div class="close" @click="closeEmail">取消</div>
        <div class="send" @click="sendEmail">
          <span>发送邮件</span>
        </div>
      </div>
    </van-popup>
    <Loading :isLoading="isLoading"></Loading>
  </div>
</template>

<style src="@/style/scss/pages/library/detail.scss" scoped lang="scss"></style>
<style lang="scss">
  #loadingPage{
    background: #f0f0f0!important;
  }
</style>
<script>
  import { ALBUM } from "../../apis/album.js";
  import { FILEPACKAGE_SEND } from "../../apis/bookresource.js";
  import { ImagePreview } from 'vant';
export default {
  data () {
    return {
      isLoading: true,
      pictureFile: true,
      packageData: {
        base: {},
        brand_info: {},
        details: []
      },
      email: false,
      emailShowPopup: false,
      goods_id: 0,
      emailValue: '',
      activeName: 'a'
    }
  },
  mounted () {
    this.goods_id = this.$route.query.goods_id;
    this.packageGet();
  },
  methods: {
    // email显示弹窗事件
    emailClick () {
      this.emailShowPopup = true
    },
    closeEmail () {
      this.emailShowPopup = false
    },
    // 文件包基本初始化
    async packageGet () {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        goods_id: this.goods_id,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await ALBUM(data);
      if (res.hasOwnProperty("response_code")) {
        this.packageData = res.response_data;
        if (this.packageData.base.price != 'undefined' && this.packageData.base.price != null && this.packageData.base.price != 0) {
          this.email = true;
        }
        if (this.packageData.base.is_payed != '0') {
          this.email = false;
        }
        if (this.packageData.base.pic.length == 0) {
          this.pictureFile = false;
        }
        this.isLoading = false;
        console.log(this.resourceData);
      } else {
        this.$toast(res.error_message);
      }
    },
    // 发送邮件接口
    async sendEmail () {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        goods_id: this.goods_id,
        email: this.emailValue,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await FILEPACKAGE_SEND(data);
      if (res.hasOwnProperty("response_code")) {
        this.$toast('获取成功');
        this.emailShowPopup = false;
      } else {
        this.$toast(res.error_message);
      }
    },
    getImg (item) {
      if (this.packageData.base.price != 0 && this.packageData.base.is_payed == '0') {
        this.buyAction(this.goods_id);
      } else if (this.packageData.base.is_payed != '0') {
        ImagePreview([item])
      } else if (this.packageData.base.price == 0) {
        ImagePreview([item])
      }
    },
    textPackIcon () {
      if (this.packageData.base.price != 'undefined' && this.packageData.base.price != null && this.packageData.base.price != 0 && this.packageData.base.is_payed == '0') {
        this.buyAction(this.goods_id);
      } else if ((this.packageData.base.price == 0)) {
        this.emailClick();
      } else if (this.packageData.base.is_payed != '0') {
        this.emailClick();
      }
    },
    // 购买
    buyAction (goodsId) {
        if (goodsId != null) {
          this.$router.push({
            name: "payaccount",
            query: { goods_id: goodsId }
          });
        }
    },
    // 文档判断是否预览
    fileClickUrl (url) {
      if (this.packageData.base.price != 0 && this.packageData.base.is_payed == '0') {
        this.buyAction(this.goods_id);
      } else if (this.packageData.base.is_payed != '0') {
        window.location.href = url;
      } else if (this.packageData.base.price == 0) {
        window.location.href = url;
      }
    }
  }
}
</script>
