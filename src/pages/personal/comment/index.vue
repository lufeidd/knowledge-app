<template>
  <div id="commentPage">
    <div class="content" v-for="item in commentData">
      <div class="info">
      <div class="head">
        <div class="titleFrom">
          <div class="box">
            <img v-lazy="item.icon" class="icon">
            <span class="publish">{{item.from}}</span>
          </div>
          <span class="date">{{item.date}}</span>
        </div>
      </div>
      <p class="comment">买的虽然有点波折，还好商家好好处理了，商品不错，下次还来他家买</p>
      <div class="section">
        <div class="bookDetail">
          <div class="ratiobox">
            <div class="bookImg" v-lazy:background-image="item.imgUrl"></div>
          </div>
          <div class="detailContent">
            <p class="title">{{item.title}}</p>
            <p class="title red">¥ {{item.price.toFixed(2)}}</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/personal/comment/index.scss" lang="scss"></style>

<script>

//  引入接口
import { USER_COMMENT } from "../../../apis/user.js";

export default {
  data () {
    return {
      commentData:[
        {icon:'https://bnmpstyle.bookuu.com/wap/images/default_shop.png',
        from:'路人甲',
        date:'2019-4-18',
        comment:'非常不错',
        imgUrl:'https://wdimg3.bookuu.com/goods/13/52/25/1554875545.jpg@!w210q85',
        title:'商品销售大全',
        price:23.00},
        {icon:'https://bnmpstyle.bookuu.com/wap/images/default_shop.png',
        from:'路人乙',
        date:'2019-4-18',
        comment:'买的虽然有点波折，还好商家好好处理了，商品不错，下次还来他家买',
        imgUrl:'https://wdimg3.bookuu.com/goods/13/52/25/1554875545.jpg@!w210q85',
        title:'宝宝巴士在线讲故事',
        price:23.00},
        {icon:'https://bnmpstyle.bookuu.com/wap/images/default_shop.png',
        from:'路人甲',
        date:'2019-4-18',
        comment:'这个东西整的很难用啊，商家你能不能好啊后写个使用说明书啊，我快要疯了呀。',
        imgUrl:'https://wdimg3.bookuu.com/goods/13/52/25/1554875545.jpg@!w210q85',
        title:'金鹰考恢复很快',
        price:23.00},
        {icon:'https://bnmpstyle.bookuu.com/wap/images/default_shop.png',
        from:'路人甲',
        date:'2019-4-18',
        comment:'非常不错',
        imgUrl:'https://wdimg3.bookuu.com/goods/13/52/25/1554875545.jpg@!w210q85',
        title:'宝宝巴士在线讲故事',
        price:23.00},]
    }
  },
  mounted(){
    this.getUserComment();
  },
  methods: {
    async getUserComment (){
      let data = {
        version: "1.0"
      }
      let res = await USER_COMMENT(data);
      if(res.response_code) {

      }else {
        this.$toast(res.error_message);
      }
      console.log(res);
    }
  }
}
</script>
