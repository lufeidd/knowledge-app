<template>
  <div id="libraryDetail">
    <div class="nullBox" v-if="onsale == 0">
      <img src="./../../assets/null/product.png" width="100%" />
      <div>该商品已下架~</div>
    </div>
    <div v-if="onsale == 1">
    <div class="package">
      <div class="title">
        <div class="text">
          <span class="line"></span>
          <span class="lh">{{ packageData.base.title }}</span>
        </div>
      </div>
      <div class="content">
        {{ packageData.base.summary }}
      </div>
      <div class="radioButton" v-if="buyPrice" @click="buyAction(packageData.base.goods_id)">
        <span>￥ {{ packageData.base.price }} 立即购买</span>
      </div>
      <div class="radioButton" v-if="email" @click="emailClick">
        <img src="../../assets/library/icon_email.png" alt width="19px" height="15px"/>
        <span>免费通过邮件获取</span>
      </div>
    </div>
    <div class="content-box">
      <van-tabs v-model="activeName" v-if="pictureFile">
        <van-tab title="图片" name="a">
            <van-row class="textB">
              <van-col span="8" v-for="(item,index) in packageData.base.pic" :key="index">
                <div class="box" @click="getImg(packageData.base.pic)">
                  <div class="bookImg" v-lazy:background-image="item"></div>
                </div>
              </van-col>
            </van-row>
        </van-tab>
        <van-tab title="文档" name="b">
          <div class="textFile">
            <div v-for="(item,index) in packageData.base.details" :key="index">
              <div class="content" v-if="isDownload">
                <div
                  class="fileText"
                  @click="fileClickUrl(item.id)"
                >
                <img src="../../assets/library/img_big2.png" alt width="30px" height="25px"/>
                <div class="text">{{ item.file_name }}</div>
                </div>
                <img src="../../assets/library/icon_dowenload.png" alt width="25px" height="25px" v-if="fileDownload" @click="textPackIcon"/>
              </div>
              <div class="content" v-else>
                <a
                  href="javascript:;"
                >
                  <img src="../../assets/library/img_big2.png" alt width="30px" height="25px"/>
                  <div class="text">{{ item.file_name }}</div>
                </a>
                <img src="../../assets/library/icon_dowenload.png" alt width="25px" height="25px" v-if="fileDownload" @click="textPackIcon"/>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
      <van-tabs v-else>
        <van-tab title="文档">
          <div class="textFile">
            <div v-for="(item,index) in packageData.base.details" :key="index">
              <div class="content" v-if="isDownload">
                <div
                  class="fileText"
                  @click="fileClickUrl(item.id)"
                >
                  <img src="../../assets/library/img_big2.png" alt width="30px" height="25px"/>
                  <div class="text">{{ item.file_name }}</div>
                </div>
                <img src="../../assets/library/icon_dowenload.png" alt width="25px" height="25px" v-if="fileDownload" @click="textPackIcon"/>
              </div>
              <div class="content" v-else>
                <a
                  href="javascript:;"
                >
                  <img src="../../assets/library/img_big2.png" alt width="30px" height="25px"/>
                  <div class="text">{{ item.file_name }}</div>
                </a>
                <img src="../../assets/library/icon_dowenload.png" alt width="25px" height="25px" v-if="fileDownload" @click="textPackIcon"/>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <a :href="this.fileHideUrl" download="file.pdf" id="hideDom" style="display: none"></a>
    </div>
    <!-- 点击获取邮件弹窗 -->
    <van-popup v-model="emailShowPopup" class="emailPopup">
      <svg class="icon close" aria-hidden="true" @click="closeEmail">
        <use xlink:href="#icon-close-line" />
      </svg>
      <div class="text">发送下载链接至邮箱</div>
      <van-cell-group>
        <van-field v-model="emailValue" placeholder="请填写电子邮箱地址" class="input">
          <van-button slot="button" size="small" round class="send" @click="sendEmail" :style="{'background': emailValue == '' ? '' : '#F45856','color': emailValue == '' ? '' : '#ffffff'}">发送</van-button>
        </van-field>
      </van-cell-group>
      <div class="text" style="margin-top: 20px;">
        复制下载链接
        <span>(粘贴至电脑浏览器打开)</span>
      </div>
      <div class="filePackageUrl">
        <div class="urlLink">{{ this.url }}</div>
        <van-button slot="button" size="small" round class="copyBtn" v-clipboard:copy="this.url" v-clipboard:success="copyUrl">复制</van-button>
      </div>
    </van-popup>
    <Loading :isLoading="isLoading"></Loading>
    <EazyNav type="brand" :isShow="false"></EazyNav>
  </div>
</template>

<style src="@/style/scss/pages/library/detail.scss" scoped lang="scss"></style>
<style>
  #libraryDetail .input .van-field__control{
    border-bottom: 1px solid #e6e6e6;
    padding-bottom: 10px;
  }
</style>
<style lang="scss" scoped>
  #loadingPage{
    background: #f0f0f0!important;
  }
  #libraryDetail .emailPopup .van-cell {
    border-bottom: 0;
    padding: 10px 0px 10px 0;
  }
  #libraryDetail .nullBox{
    text-align: center;
    font-size: 15px;
    color: #000;
  }
  #libraryDetail .nullBox img{
    width: 100%;
    margin-top: 100px;
    margin-bottom: 50px;
  }
</style>
<script>
  import { ALBUM } from "../../apis/album.js";
  import { FILEPACKAGE_SEND , FILEPACKAGE_GETURL } from "../../apis/bookresource.js";
  import { ImagePreview } from 'vant';
export default {
  data () {
    return {
      isLoading: true,
      pictureFile: true,
      buyPrice: false,
      fileDownload: true,
      isDownload: true,
      onsale: null,
      timeoutId: 0,
      fileHideUrl: '',
      url: '',
      phoneType: '',
      detailImgRouter: '',
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
  beforeRouteLeave (to,from,next) {
    this.detailImgRouter&&this.detailImgRouter.close()
    next()
  },
  mounted () {
    this.goods_id = this.$route.query.goods_id;
    this.packageGet();
    this.phoneTypeMethod();
  },
  methods: {
    // email显示弹窗事件
    async emailClick () {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        file_package_detail_id: this.packageData.base.compress_file_id,
        equipment: this.phoneType,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await FILEPACKAGE_GETURL(data);
      if (res.hasOwnProperty("response_code")) {
        if (res.response_data.file_path != null) {
          this.url = res.response_data.file_path;
          this.emailShowPopup = true
        }
      } else {
        if (res.error_code === 100) {
          this.$toast(res.error_message);
          this.login();
        } else {
          this.$toast(res.error_message);
        }
      }
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
        if (this.packageData.base.is_download == 0 && this.packageData.base.is_payed == '0' && this.packageData.base.price == 0) {
          this.email = false;
          this.buyPrice = false;
          this.fileDownload = false;
          this.isDownload = true;
        }
        if (this.packageData.base.is_download == 0 && this.packageData.base.is_payed == '0' && this.packageData.base.price != 0) {
          this.email = false;
          this.buyPrice = true;
          this.fileDownload = false;
          this.isDownload = true;
        }
        if (this.packageData.base.is_download == 0 && this.packageData.base.is_payed != '0' && this.packageData.base.price != 0) {
          this.email = false;
          this.buyPrice = false;
          this.fileDownload = false;
          this.isDownload = true;
        }
        if (this.packageData.base.is_download != 0 && this.packageData.base.is_payed == '0' && this.packageData.base.price == 0) {
          this.email = true;
          this.buyPrice = false;
          this.fileDownload = true;
          this.isDownload = true;
        }
        if (this.packageData.base.is_download != 0 && this.packageData.base.is_payed == '0' && this.packageData.base.price != 0) {
          this.email = false;
          this.buyPrice = true;
          this.fileDownload = true;
          this.isDownload = true;
        }
        if (this.packageData.base.is_download != 0 && this.packageData.base.is_payed != '0' && this.packageData.base.price != 0) {
          this.email = true;
          this.buyPrice = false;
          this.fileDownload = true;
          this.isDownload = true;
        }
        if (this.packageData.base.pic.length == 0) {
          this.pictureFile = false;
        }
        this.isLoading = false;
        this.onsale = 1;
        console.log(this.resourceData);
      } else {
        if (res.hasOwnProperty("error_code") && res.error_code == 401) {
          // 上下架状态, 1=> 在架, 0=> 下架
          this.onsale = 0;
          this.isLoading = false;
        }
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
        if (res.error_code === 100) {
          this.$toast(res.error_message);
          this.login();
        } else {
          this.$toast(res.error_message);
        }
      }
    },
    getImg (item) {
      if (this.packageData.base.price != 0 && this.packageData.base.is_payed == '0') {
        this.buyAction(this.goods_id);
      } else if (this.packageData.base.is_payed != '0') {
        this.detailImgRouter = ImagePreview({
          images: item
        });
        // ImagePreview(item)
      } else if (this.packageData.base.price == 0) {
        this.detailImgRouter = ImagePreview({
          images: item
        });
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
    // 机型判断方法
    phoneTypeMethod () {
      const u = navigator.userAgent;
      const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      console.log('判断');
      if (isiOS) {
        // ios
        console.log('ios');
        this.phoneType = 'ios';
      } else {
        // andriod
        console.log('andriod');
        this.phoneType = 'android';
      }
    },
    // 文档判断是否预览
    async fileClickUrl (id) {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        file_package_detail_id: id,
        equipment: this.phoneType,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await FILEPACKAGE_GETURL(data);
      if (res.hasOwnProperty("response_code")) {
        if (this.packageData.base.is_download == 0 && this.packageData.base.is_payed == '0' && this.packageData.base.price != 0) {
          this.buyAction(this.goods_id);
        } else if (this.packageData.base.is_download != 0 && this.packageData.base.is_payed == '0' && this.packageData.base.price != 0) {
          this.buyAction(this.goods_id);
        } else {
          /*const u = navigator.userAgent;
          const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
          console.log('判断');
          if (isiOS) {
            // ios
            console.log('ios');
            this.fileHideUrl = res.response_data.file_path;
            this.timeoutId = setTimeout(() => {
              document.getElementById('hideDom').click();
            },100)
          } else {
            // andriod
            console.log('andriod');
            this.$toast('Android暂不支持预览，请下载文件后查看');
          }*/
          /*this.fileHideUrl = res.response_data.file_path;*/
          this.fileHideUrl = res.response_data.view_path;
          this.timeoutId = setTimeout(() => {
            document.getElementById('hideDom').click();
          },100)
        }
      } else {
        if (res.error_code === 100) {
          this.$toast(res.error_message);
          this.login();
        } else {
          this.$toast(res.error_message);
        }
      }
    },
    // 登陆
    login () {
      this.$router.push({
        name: "login"
      });
    },
    // 点击自动复制内容
    copyUrl () {
      this.$toast("链接复制成功");
    }
  }
}
</script>
