<template>
    <div id="resultPage">
      <div class="head">
        <div class="brand">
          <div class="ratiobox" @click="show">
            <div class="bookImg" v-lazy:background-image="iconUrl"></div>
          </div>
          <div class="right">
              <div class="name">磨铁教育</div>
              <div class="fans">44万粉丝</div>
          </div>
          <div class="focus add" v-if="focus" @click="cancelfocus">已关注</div>
          <div class="focus" v-else @click="addfocus">+关注</div>
        </div>
        <div class="sell">
          <div>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shop-line"></use>
            </svg> 品牌商城
          </div>
          <div class="link">
            136件商品在售 <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line"></use>
            </svg>
          </div>
        </div>
      </div>
      <van-tabs sticky animated swipeable color="#666" title-active-color="#333">
        <van-tab title="最新">
          <div class="content">
            <div class="ratiobox">
              <div class="bookImg" v-lazy:background-image="iconUrl"></div>
            </div>
            <div class="right">
              <div class="text">这里是视频的标题，可能会很长有两行文字</div>
              <div class="pinpai">品牌名称</div>
              <div class="nice">
                <span>
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-good-line"></use>
                  </svg> <span>25566</span>
                </span>
                <span class="comment">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-comment-line"></use>
                  </svg> <span>266</span>
                </span>
              </div>
            </div>
          </div>
                    <div class="content">
            <div class="ratiobox">
              <div class="bookImg" v-lazy:background-image="iconUrl"></div>
            </div>
            <div class="right">
              <div class="text">这里是视频的标题，可能会很长有两行文字</div>
              <div class="pinpai">品牌名称</div>
              <div class="nice">
                <span>
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-good-line"></use>
                  </svg> <span>25566</span>
                </span>
                <span class="comment">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-comment-line"></use>
                  </svg> <span>266</span>
                </span>
              </div>
            </div>
          </div>
                    <div class="content">
            <div class="ratiobox">
              <div class="bookImg" v-lazy:background-image="iconUrl"></div>
            </div>
            <div class="right">
              <div class="text">这里是视频的标题，可能会很长有两行文字</div>
              <div class="pinpai">品牌名称</div>
              <div class="nice">
                <span>
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-good-line"></use>
                  </svg> <span>25566</span>
                </span>
                <span class="comment">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-comment-line"></use>
                  </svg> <span>266</span>
                </span>
              </div>
            </div>
          </div>
                    <div class="content">
            <div class="ratiobox">
              <div class="bookImg" v-lazy:background-image="iconUrl"></div>
            </div>
            <div class="right">
              <div class="text">这里是视频的标题，可能会很长有两行文字</div>
              <div class="pinpai">品牌名称</div>
              <div class="nice">
                <span>
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-good-line"></use>
                  </svg> <span>25566</span>
                </span>
                <span class="comment">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-comment-line"></use>
                  </svg> <span>266</span>
                </span>
              </div>
            </div>
          </div>
                    <div class="content">
            <div class="ratiobox">
              <div class="bookImg" v-lazy:background-image="iconUrl"></div>
            </div>
            <div class="right">
              <div class="text">这里是视频的标题，可能会很长有两行文字</div>
              <div class="pinpai">品牌名称</div>
              <div class="nice">
                <span>
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-good-line"></use>
                  </svg> <span>25566</span>
                </span>
                <span class="comment">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-comment-line"></use>
                  </svg> <span>266</span>
                </span>
              </div>
            </div>
          </div>
                    <div class="content">
            <div class="ratiobox">
              <div class="bookImg" v-lazy:background-image="iconUrl"></div>
            </div>
            <div class="right">
              <div class="text">这里是视频的标题，可能会很长有两行文字</div>
              <div class="pinpai">品牌名称</div>
              <div class="nice">
                <span>
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-good-line"></use>
                  </svg> <span>25566</span>
                </span>
                <span class="comment">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-comment-line"></use>
                  </svg> <span>266</span>
                </span>
              </div>
            </div>
          </div>
                    <div class="content">
            <div class="ratiobox">
              <div class="bookImg" v-lazy:background-image="iconUrl"></div>
            </div>
            <div class="right">
              <div class="text">这里是视频的标题，可能会很长有两行文字</div>
              <div class="pinpai">品牌名称</div>
              <div class="nice">
                <span>
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-good-line"></use>
                  </svg> <span>25566</span>
                </span>
                <span class="comment">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-comment-line"></use>
                  </svg> <span>266</span>
                </span>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="数学">内容 2</van-tab>
        <van-tab title="英语">内容 3</van-tab>
        <van-tab title="在线课堂">内容 3</van-tab>
        <van-tab title="历史文化">内容 3</van-tab>
        <van-tab title="趣味知识">内容 3</van-tab>
        <van-tab title="标签 3">内容 3</van-tab>
      </van-tabs>
      <van-popup v-model="showPopup">
        <svg class="icon close" aria-hidden="true" @click="close">
          <use xlink:href="#icon-close-line"></use>
        </svg>
        <div class="ratiobox">
          <div class="bookImg" v-lazy:background-image="iconUrl"></div>
        </div>
        <div class="name">磨铁教育自媒体</div>
        <div class="company">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-zimeitigongsi"></use>
          </svg>北京磨铁有限公司（2019年3月12日入驻）
        </div>
        <div class="line"></div>
        <div class="content">在自媒体时代，各种不同的声音来自四面八方，主流媒体的声音逐渐变弱人们不再接受被一个“统一的声音”告知对或错，每一个人都在从独立</div>
      </van-popup>
    </div>
</template>

<style src="@/style/scss/pages/brand/result.scss" lang="scss"></style>

<script>
export default {
    data(){
        return {
          iconUrl:'https://media2.v.bookuu.com/activity/08/53/20190418085322949.jpg@!q75',
          focus:false,
          showPopup:false,
        }
    },
    methods:{
      show(){
        this.showPopup=true;
      },
      close(){
        this.showPopup=false;
      },
      addfocus(){
        if(this.focus=true){
          this.foucus=false;
        }
      },
      cancelfocus(){
        if(this.focus=false){
          this.focus=true;
        }
      }
    }
}
</script>

