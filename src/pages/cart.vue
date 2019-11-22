<template>
  <div id="cartPage">
    <div class="nullBox" v-if="show && cartlist.length == 0 && nouse_goods.length == 0">
      <img src="./../assets/null/product.png" width="100%" />
      <div>购物车为空~</div>
    </div>
    <div v-else>
      <!-- 操作 -->
      <van-row class="editBox" v-if="cartlist && cartlist.length > 0">
        <van-col span="12">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-cart-line" />
          </svg>
          共{{ goods_nums }}件商品
        </van-col>
        <van-col span="12" style="text-align: right;">
          <div @click="editOrDelete">
            <template v-if="status == 'edit'">编辑</template>
            <template v-else>完成</template>
          </div>
        </van-col>
      </van-row>
      <!-- 商品 -->
      <template v-if="cartlist && cartlist.length > 0">
        <div class="cardBox" v-for="(item, index) in cartlist" :key="index">
          <!-- 当前店铺商品全选 -->
          <div class="listBox total">
            <div class="right" @click="selectAllAction(index)">
              <svg class="icon" aria-hidden="true" v-if="item.select == 0">
                <use xlink:href="#icon-uncheck-line" />
              </svg>
              <svg class="icon active" aria-hidden="true" v-if="item.select == 1">
                <use xlink:href="#icon-checked-block" />
              </svg>
            </div>
            <router-link
              :to="{name: 'mall', query: {supplier_id: item.supplier_id,title:item.brand_name,}}"
              class="center"
            >
              <div class="title">
                <div class="text">{{ item.brand_name }}</div>
              </div>
            </router-link>
            <router-link :to="{name: 'mall', query: {supplier_id: item.supplier_id}}" class="right">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-next-line" />
              </svg>
            </router-link>
          </div>
          <!-- 满减 -->
          <!-- <div class="capping">
            <span class="tags">满减</span>
            <span class="desc">满100元立减5元，部分地区包邮</span>
          </div> -->
          <!-- 商品列表 -->
          <div class="listBox judge" v-for="(gItem, gIndex) in item.goodslist" :key="gIndex">
            <div class="right" @click="selectAction('click', index, gIndex)">
              <svg class="icon" aria-hidden="true" v-if="gItem.select == 0">
                <use xlink:href="#icon-uncheck-line" />
              </svg>
              <svg class="icon active" aria-hidden="true" v-if="gItem.select == 1">
                <use xlink:href="#icon-checked-block" />
              </svg>
            </div>
            <div class="left">
              <div class="ratioBox">
                <router-link :to="{name: 'detail', query: {goods_id: gItem.goods_id}}" class="box">
                  <img :src="gItem.pic" />
                  <div
                    class="tag"
                    v-if="gItem.stores <= 10 && gItem.stores > 0"
                  >仅剩{{ gItem.stores }}件</div>
                  <div class="tag" v-if="gItem.stores == 0">售罄</div>
                </router-link>
              </div>
            </div>
            <div class="center">
              <div class="title">
                <router-link
                  :to="{name: 'detail', query: {goods_id: gItem.goods_id}}"
                  class="text"
                >{{ gItem.title }}</router-link>
              </div>
              <div class="subTitle"></div>
              <div class="info">
                <span class="history">￥{{ gItem.price }}</span>
                <div class="action">
                  <van-stepper
                    v-model="gItem.count"
                    disable-input
                    integer
                    @plus="addCount(index, gIndex, gItem.detail_id)"
                    @minus="subCount(index, gIndex, gItem.detail_id)"
                    @overlimit="onOverlimit($event,gItem.count, gItem.detail_id)"
                    :min="1"
                    :max="gItem.stores"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-if="nouse_goods && nouse_goods.length > 0">
        <van-row class="editBox">
          <van-col span="12">失效商品</van-col>
          <van-col span="12" style="text-align: right;">
            <div @click="clearAction">清空失效商品</div>
          </van-col>
        </van-row>
        <!-- 失效商品 -->
        <div class="cardBox">
          <div class="listBox" v-for="(item, index) in nouse_goods" :key="index">
            <div class="right"></div>
            <div class="left">
              <div class="ratioBox">
                <router-link :to="{name: 'detail', query: {goods_id: item.goods_id}}" class="box">
                  <img :src="item.pic" />
                  <div class="tag" v-if="item.stores <= 10 && item.stores > 0">仅剩{{ item.stores }}件</div>
                  <div class="tag" v-if="item.stores == 0">售罄</div>
                </router-link>
              </div>
            </div>
            <div class="center">
              <div class="title">
                <router-link
                  :to="{name: 'detail', query: {goods_id: item.goods_id}}"
                  class="text"
                >{{ item.title }}</router-link>
              </div>
              <div class="subTitle"></div>
              <div class="info">
                <span class="history">￥{{ item.price }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <div v-if="this.isIphx" style="height: 34px;"></div>
      <div v-if="cartlist && cartlist.length > 0">
        <div style="height: 50px;"></div>

        <!-- 底部导航 结算 -->
        <van-submit-bar
          v-if="status == 'edit'"
          :class="{iphx:this.isIphx}"
          safe-area-inset-bottom
          :price="money"
          button-text="结算"
          @submit="onSubmit"
        >
          <div class="totalBox" @click="selectTotalAction">
            <svg class="icon" aria-hidden="true" v-if="selectTotal == 0">
              <use xlink:href="#icon-uncheck-line" />
            </svg>
            <svg class="icon active" aria-hidden="true" v-if="selectTotal == 1">
              <use xlink:href="#icon-checked-block" />
            </svg>
            <span>全选</span>
          </div>
        </van-submit-bar>
        <!-- 底部导航 删除 -->
        <van-submit-bar
          v-else
          :class="{iphx:this.isIphx}"
          class="deleteBox"
          safe-area-inset-bottom
          button-text="删除"
          @submit="deleteAction"
        >
          <div class="totalBox" @click="selectTotalAction">
            <svg class="icon" aria-hidden="true" v-if="selectTotal == 0">
              <use xlink:href="#icon-uncheck-line" />
            </svg>
            <svg class="icon active" aria-hidden="true" v-if="selectTotal == 1">
              <use xlink:href="#icon-checked-block" />
            </svg>
            <span>全选</span>
          </div>
          <!-- <template slots="default">
            <div style="position:absolute;right:120px;">清空失效宝贝</div>
          </template> -->
        </van-submit-bar>
      </div>
      <!-- <CopyRight></CopyRight> -->
    </div>
    <EazyNav type="brand"></EazyNav>
  </div>
</template>
<style src="@/style/scss/pages/cart.scss" scoped lang="scss"></style>
<script>
import {
  CART_INFO,
  CART_DELETE,
  CART_ADD,
  CART_EDIT
} from "./../apis/shopping";
import { throws } from "assert";
export default {
  data() {
    return {
      countType: "",
      money: null,
      goods_nums: null,
      selectTotal: 0,
      status: "edit",
      // 有效的购物车商品列表
      cartlist: [],
      // 无效的购物车商品列表
      nouse_goods: [],
      show: false
    };
  },
  mounted() {
    this.cartData();
  },
  methods: {
    // 减少数量
    async productCountData(detail_id, count) {
      var tStamp = this.$getTimeStamp();
      let data = {
        detail_id: detail_id,
        count: count,
        timestamp: tStamp,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await CART_EDIT(data);

      if (res.hasOwnProperty("response_code")) {
      } else {
        this.$toast(res.error_message);
      }
    },
    // 删除购物车中的商品品种
    async cartDeleteData(detail_id) {
      var tStamp = this.$getTimeStamp();
      let data = {
        detail_id: detail_id,
        timestamp: tStamp,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await CART_DELETE(data);

      if (res.hasOwnProperty("response_code")) {
        this.cartData();
      } else {
        this.$toast(res.error_message);
      }
    },
    // 获取购物车信息
    async cartData() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await CART_INFO(data);

      if (res.hasOwnProperty("response_code")) {
        this.goods_nums = res.response_data.goods_nums;
        this.cartlist = res.response_data.cartlist;
        this.show = true;
        // 公号商品
        if (this.cartlist && this.cartlist.length > 0) {
          for (let i = 0; i < this.cartlist.length; i++) {
            this.cartlist[i].select = 0;
            // 单个商品关联当前店铺以及购物车
            this.productWithAllAndTotal("init", i, null);
          }
        }
        this.nouse_goods = res.response_data.nouse_goods;
        this.money =
          res.response_data.money * 100
            ? res.response_data.money * 100
            : this.money;
        this.show = true;
      } else {
        this.$toast(res.error_message);
      }
    },
    // 购物车全选
    selectTotalAction() {
      this.selectTotal = this.selectTotal == 1 ? 0 : 1;
      // 关联购物车全选
      for (let i = 0; i < this.cartlist.length; i++) {
        this.selectAllAction(i);
      }
    },
    // 店铺全选
    selectAllAction(index) {
      var tCount = 0; // 购物车计数
      this.cartlist = this.cartlist.map((value, key) => {
        if (index == key) value.select = value.select == 1 ? 0 : 1;
        if (value.select == 0) tCount++;
        return value;
      });

      // 关联该店铺下商品选择状态
      this.cartlist[index].goodslist = this.cartlist[index].goodslist.map(
        (value, key) => {
          value.select = this.cartlist[index].select;
          return value;
        }
      );

      // 关联购物车全选
      if (tCount > 0) {
        this.selectTotal = 0;
      } else {
        this.selectTotal = 1;
      }

      // 获取已选中商品总金额
      this.getTotalMoney();
    },
    // 选择商品
    selectAction(_type, cIndex, gIndex) {
      // 单个商品关联当前店铺以及购物车
      this.productWithAllAndTotal(_type, cIndex, gIndex);
    },
    // 单个商品关联当前店铺以及购物车
    productWithAllAndTotal(_type, cIndex, gIndex) {
      // 点击 _type == 'click'
      // 首次加载 _type == 'init'
      var count = 0; // 单个商品
      var aCount = 0; // 店铺下计数
      var tCount = 0; // 购物车计数
      var sCount = 0; // 选框个数
      this.cartlist[cIndex].goodslist = this.cartlist[cIndex].goodslist.map(
        (value, key) => {
          sCount++;
          if (_type == "click") {
            if (gIndex == key) value.select = value.select == 1 ? 0 : 1;
          }
          if (value.select == 1) count++;
          if (value.select == 0) aCount++;
          // 获取已选中商品总金额
          if (_type == "click") this.getTotalMoney();
          return value;
        }
      );

      // 关联购物车全选
      this.cartlist = this.cartlist.map((value, key) => {
        if (value.select == 0) tCount++;
        return value;
      });

      // 关联当前店铺全选
      if (count >= sCount) {
        this.cartlist[cIndex].select = 1;
      } else {
        this.cartlist[cIndex].select = 0;
      }
      if (tCount > 0) this.selectTotal = 1;
      if (aCount > 0) this.selectTotal = 0;
    },
    // 编辑或者删除状态切换
    editOrDelete() {
      this.status = this.status == "edit" ? "delete" : "edit";
    },
    // 清空失效商品
    clearAction() {
      var detail_id = "";
      for (let i = 0; i < this.nouse_goods.length; i++) {
        detail_id += this.nouse_goods[i].detail_id + ",";
      }
      this.onDelete("清空失效商品", "是否确认清空？", detail_id);
    },
    // 结算
    onSubmit() {
      var detail_ids = this.getDetailIdsData();
      if (detail_ids == "") {
        this.$toast("请选择商品~");
        return;
      }
      this.$router.push({
        name: "orderconfirm",
        query: { detail_ids: detail_ids }
      });
    },
    // 删除
    deleteAction() {
      var detail_ids = this.getDetailIdsData();
      if (detail_ids == "") {
        this.$toast("请选择商品~");
        return;
      }
      this.onDelete("删除", "是否确认删除？", detail_ids);
    },
    // 获取 detail_ids
    getDetailIdsData() {
      var detail_id = "";
      for (let i = 0; i < this.cartlist.length; i++) {
        for (let j = 0; j < this.cartlist[i].goodslist.length; j++) {
          if (this.cartlist[i].goodslist[j].select == 1)
            detail_id += this.cartlist[i].goodslist[j].detail_id + ",";
        }
      }
      return detail_id;
    },
    onDelete(title, message, detail_id) {
      this.$dialog
        .confirm({
          title: title,
          message: message
        })
        .then(() => {
          // on confirm
          this.cartDeleteData(detail_id);
        })
        .catch(() => {
          // on cancel
        });
    },
    // 购物车删除当前商品
    onOverlimit(e,count, detail_id) {
      // console.log(7777,e)
      // if(count == 1) {
      //   this.onDelete("删除", "是否确认删除？", detail_id);
      // }
      if(e == 'minus'){
        this.onDelete("删除", "是否确认删除？", detail_id);
      }else if(e == 'plus'){
        this.$toast('超出库存~')
      }
    },
    // 计数 +
    addCount(cIndex, gIndex, detail_id) {
      // this.countType = "add";
      var count;
      this.cartlist[cIndex].goodslist = this.cartlist[cIndex].goodslist.map(
        (value, key) => {
          if (gIndex == key) {
            value.count++;
            count = value.count;
          }
          return value;
        }
      );
      // 获取已选中商品总金额
      this.getTotalMoney();
      // 数量加减
      this.productCountData(detail_id, count);
      // 关联购物车商品总件数
      this.goods_nums++;
    },
    // 计数 -
    subCount(cIndex, gIndex, detail_id) {
      // this.countType = "sub";
      var count;
      this.cartlist[cIndex].goodslist = this.cartlist[cIndex].goodslist.map(
        (value, key) => {
          if (gIndex == key) {
            value.count--;
            count = value.count;
          }
          return value;
        }
      );
      // 获取已选中商品总金额
      this.getTotalMoney();
      // 数量加减
      this.productCountData(detail_id, count);
      // 关联购物车商品总件数
      this.goods_nums--;
    },
    // 获取已选中商品总金额
    getTotalMoney() {
      var tmoney = 0;
      for (let i = 0; i < this.cartlist.length; i++) {
        for (let j = 0; j < this.cartlist[i].goodslist.length; j++) {
          // 获取选中总金额
          if (this.cartlist[i].goodslist[j].select == 1) {
            var amount = this.cartlist[i].goodslist[j].count;
            var price = this.cartlist[i].goodslist[j].price;
            var gtmp = price * amount;
            tmoney = tmoney + gtmp;
          }
        }
      }
      this.money = tmoney * 100;
    }
  }
};
</script>

