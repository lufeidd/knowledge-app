<template>
  <div id="listPage">
    <div class="content" v-for="item in publishData">
      <div class="head">
        <div class="titleFrom">
          <img :src="item.icon" alt="" class="icon">
          <span class="publish">{{item.from}}</span>
        </div>
        <span :class="item.orderClass">{{item.order}}</span>
      </div>
      <div class="section">
        <div class="bookDetail">
          <div class="ratiobox">
            <a class="bookImg" :style="{'background-image':'url('+item.imgUrl+')'}"></a>
          </div>
          <span class="title">{{item.title}}</span>
        </div>
        <div class="tip">
          <span class="noChange">虚拟内容不退不换</span>
          <span class="actulPay">实付款：￥{{item.price.toFixed(2)}}</span>
        </div>
      </div>
      <div class="foot">
        <span class="button1">评价</span>
        <span class="button1">再次购买</span>
        <span class="button2" >去支付</span>
        <span class="button2">确认收货</span>
      </div>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/personal/order/list.scss" lang="scss"></style>

<script>
export default {
  data () {
    return {
      publishData:[
        {icon:'https://bnmpstyle.bookuu.com/wap/images/default_shop.png',
        from:'人民出版集团',
        order:'待支付',
        orderClass:'order1',
        imgUrl:'https://wdimg3.bookuu.com/goods/13/52/25/1554875545.jpg@!w210q85',
        title:'新版中国少年儿童百科全书共4册浩瀚宇宙+恐龙王国',
        price:134.00,},
        {icon:'https://bnmpstyle.bookuu.com/wap/images/default_shop.png',
        from:'人民出版集团',
        order:'待收货',
        orderClass:'order1',
        imgUrl:'https://wdimg3.bookuu.com/goods/13/52/25/1554875545.jpg@!w210q85',
        title:'新版中国少年儿童百科全书共4册浩瀚宇宙+恐龙王国',
        price:134.21,},
        {icon:'https://bnmpstyle.bookuu.com/wap/images/default_shop.png',
        from:'人民出版集团',
        order:'已完成',
        orderClass:'order2',
        imgUrl:'https://wdimg3.bookuu.com/goods/13/52/25/1554875545.jpg@!w210q85',
        title:'新版中国少年儿童百科全书共4册浩瀚宇宙+恐龙王国',
        price:134.00,},
      ],
      state:{evaluate:true,isPay:true,rePurchase:true,confirm:true }
    }
  },

}
</script>


