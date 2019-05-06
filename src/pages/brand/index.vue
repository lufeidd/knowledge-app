<template>
    <div id="resultPage">
      <div class="head">
        <div class="brand">
          <div class="ratiobox" @click="show">
            <div class="bookImg" v-lazy:background-image="brandData.header_pic"></div>
          </div>
          <div class="right">
              <div class="name">{{brandData.name}}</div>
              <div class="fans">{{brandData.statistic_list.fans_num}}粉丝</div>
          </div>
          <div class="focus" v-if="focus == 0" @click="focusAction">+关注</div>
          <div class="focus add" v-else @click="focusAction">已关注</div>
        </div>
        <router-link to="/brand/mall">
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
        </router-link>
      </div>
      <van-tabs sticky animated swipeable color="#666" title-active-color="#333" @click="tabChange">
        <van-tab :title="item.name" v-for="item,index in brandData.column_list" :key="index" >
          <van-list
            v-model="programLoading"
            :finished="programFinished"
            finished-text="没有更多了"
            @load="programLoad"
          >
          <div class="content" v-for="item,index in column_list_data">
            <div class="ratiobox">
              <div class="bookImg" v-lazy:background-image="item.goods_pic"></div>
            </div>
            <div class="right">
              <div class="text">{{item.goods_name}}</div>
              <div class="pinpai">品牌名称</div>
              <div class="nice">
                <span>
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-good-line"></use>
                  </svg> <span>{{item.praise_num}}</span>
                </span>
                <span class="comment">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-comment-line"></use>
                  </svg> <span>{{item.comment_num}}</span>
                </span>
              </div>
            </div>
          </div>
          </van-list>
        </van-tab>
      </van-tabs>
      <van-popup v-model="showPopup">
        <svg class="icon close" aria-hidden="true" @click="close">
          <use xlink:href="#icon-close-line"></use>
        </svg>
        <div class="ratiobox">
          <div class="bookImg" v-lazy:background-image="brandData.header_pic"></div>
        </div>
        <div class="name">磨铁教育自媒体</div>
        <div class="company">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-zimeitigongsi"></use>
          </svg>（{{brandData.create_time}}入驻）
        </div>
        <div class="line"></div>
        <div class="content">{{brandData.summary}}</div>
      </van-popup>
    </div>
</template>

<style src="@/style/scss/pages/brand/result.scss" lang="scss"></style>

<script>
import { BRAND_INFO } from "../../apis/brand.js";
import { BRAND_COLUMN_GETS } from "../../apis/brand.js";
import { FOCUS_ADD } from "../../apis/public.js";
import { FOCUS_CANCEL } from "../../apis/public.js";
import { setTimeout } from 'timers';
export default {
    data(){
        return {
          iconUrl:'https://media2.v.bookuu.com/activity/08/53/20190418085322949.jpg@!q75',
          focus:null,
          showPopup:false,
          programLoading: false,
          programFinished: false,
          brandData:{},
          column_list_data:[],
          packets_id:null,
          brand_id:1,
          currentPage:1,
        }
    },
    mounted(){
      this.brandGetData();
    },
    methods:{
      show(){
        this.showPopup=true;
      },
      close(){
        this.showPopup=false;
      },
      programLoad(){
        this.columnListData();
        console.log('page:',this.currentPage)
      },
      // 获取关注接口信息
      async focusData(__type) {
        var data = {};
        var res;
        switch (__type) {
          case "focus":
            data = {
              brand_id: this.brand_id,
              version: "1.0"
            };
            res = await FOCUS_ADD(data);
            this.focus = 1;
            // this.$toast('已关注~');
            break;
          case "cancel":
            data = {
              brand_id: this.brand_id,
              version: "1.0"
            };
            res = await FOCUS_CANCEL(data);
            this.focus = 0;
            this.$toast("已取消关注~");
            break;
        }
        // 出错提示
        if (res.hasOwnProperty("response_code")) {
        } else {
          this.$toast(res.error_message);
        }
      },
      focusAction() {
        if (this.focus > 0) {
          this.focusData("cancel");
        } else {
          this.focusData("focus");
        }
      },
      async brandGetData(){
        var tStamp = this.$getTimeStamp();
        var data={
          brand_id:this.brand_id,
          version:"1.0",
          timestamp:tStamp,
        };
        data.sign = this.$getSign(data);
        let res = await BRAND_INFO(data);
        if(res.hasOwnProperty("response_code")){
          this.brandData = res.response_data;
          this.packets_id = res.response_data.column_list[0].packets_id;
          this.columnListData();
          // console.log(this.packets_id);
        }else{
          this.$toast(res.error_message);
        }
      },
      tabChange(index){
        // console.log(index,this.brandData.column_list[index].packets_id);
        this.packets_id = this.brandData.column_list[index].packets_id;
        this.programFinished = false;
        this.column_list_data = [];
        this.columnListData();
      },
      async columnListData(){
        var tStamp = this.$getTimeStamp();
        var data={
          brand_id:this.brand_id,
          packets_id:this.packets_id,
          page:this.currentPage,
          page_size:3,
          version:"1.0",
          timestamp:tStamp,
        };
        data.sign = this.$getSign(data);
        let res = await BRAND_COLUMN_GETS(data);
        if(res.hasOwnProperty("response_code")){
          // this.column_list_data = res.response_data;
          // console.log(this.packets_id);
          var result = res.response_data.result;
          setTimeout(() => {
            for (let i = 0; i < res.response_data.result.length; i++) {
              this.column_list_data.push(result[i]);
            }
            // 加载状态结束
            this.programLoading = false;
            this.currentPage++;

            // 数据全部加载完成
            if (this.column_list_data.length >= res.response_data.total_count) {
              this.programFinished = true;
              this.currentPage = 1;
            }
          }, 500);
        }else{
          this.$toast(res.error_message);
        }
      },
    }
}
</script>

