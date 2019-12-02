<template>
  <div id="cartPage">
    <div class="nullBox" v-if="show && cartlist.length == 0">
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
            <div class="right">
              <svg
                class="icon"
                aria-hidden="true"
                v-if="item.supplier_selected == 0"
                @click="selectAllAction(index,1)"
              >
                <use xlink:href="#icon-uncheck-line" />
              </svg>
              <svg
                class="icon active"
                aria-hidden="true"
                v-if="item.supplier_selected == 1"
                @click="selectAllAction(index,0)"
              >
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
          <div
            class="secondList"
            style="margin-bottom:5px;"
            v-for="(gItem, gIndex) in item.act_list"
            :key="gIndex"
          >
            <!-- 满减 -->
            <div class="capping" v-if="gItem.multi_id">
              <div class="capping_left">
                <span class="tags" v-if="gItem.tag">{{gItem.tag}}</span>
                <span class="desc" v-if="gItem.summary">{{gItem.summary}}</span>
              </div>
              <span
                class="capping_right"
                v-if="gItem.is_reach"
                @click.stop="collectBills(gItem,gIndex)"
              >
                再逛逛
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-next-line" />
                </svg>
              </span>
              <span class="capping_right" v-else @click.stop="collectBills(gItem,gIndex)">
                去凑单
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-next-line" />
                </svg>
              </span>
            </div>
            <div class="capping" v-else></div>
            <!-- 商品列表 -->
            <div
              class="listBox judge"
              v-if="litem.is_valid == 1"
              v-for="(litem,lindex) in gItem.goods_list"
              :key="lindex"
            >
              <div class="right">
                <svg
                  class="icon"
                  aria-hidden="true"
                  v-if="litem.selected == 0"
                  @click="selectAction(index,gIndex,lindex,1)"
                >
                  <use xlink:href="#icon-uncheck-line" />
                </svg>
                <svg
                  class="icon active"
                  aria-hidden="true"
                  v-if="litem.selected == 1"
                  @click="selectAction(index,gIndex,lindex,0)"
                >
                  <use xlink:href="#icon-checked-block" />
                </svg>
              </div>
              <div class="left">
                <div class="ratioBox">
                  <router-link
                    :to="{name: 'detail', query: {goods_id: litem.goods_id}}"
                    class="box"
                  >
                    <img :src="litem.pic" />
                    <div
                      class="tag"
                      v-if="litem.stores <= 10 && litem.stores > 0"
                    >仅剩{{ litem.stores }}件</div>
                    <!-- <div class="tag" v-if="litem.stores == 0">售罄</div> -->
                  </router-link>
                </div>
              </div>
              <div class="center">
                <div class="title">
                  <router-link
                    :to="{name: 'detail', query: {goods_id: litem.goods_id}}"
                    class="text"
                  >{{ litem.title }}</router-link>
                </div>
                <div class="subTitle">{{litem.goods_desc}}</div>
                <div class="info">
                  <span class="history">¥{{ litem.price }}</span>
                  <div class="action">
                    <van-stepper
                      v-model="litem.count"
                      integer
                      disable-input
                      @plus="addCount(index,gIndex, lindex, litem.detail_id,litem.count)"
                      @minus="subCount(index,gIndex, lindex, litem.detail_id)"
                      @overlimit="onOverlimit($event,litem.count, litem.detail_id)"
                      :min="1"
                      :max="litem.stores"
                      @click="editNumber(index,gIndex,lindex,litem.count,litem.stores,litem.detail_id)"
                    />
                  </div>
                </div>
              </div>
            </div>
            <!-- 失效商品 -->
            <div
              class="listBox judge"
              v-if="litem.is_valid == 0"
              v-for="(litem,lindex) in gItem.goods_list"
              :key="lindex"
            >
              <div class="right" v-if="status == 'delete'">
                <svg
                  class="icon"
                  aria-hidden="true"
                  v-if="litem.selected == 0"
                  @click="selectAction(index,gIndex,lindex,1)"
                >
                  <use xlink:href="#icon-uncheck-line" />
                </svg>
                <svg
                  class="icon active"
                  aria-hidden="true"
                  v-if="litem.selected == 1"
                  @click="selectAction(index,gIndex,lindex,0)"
                >
                  <use xlink:href="#icon-checked-block" />
                </svg>
              </div>
              <div class="right" v-if="status == 'edit'">
                <svg class="icon disabled" aria-hidden="true">
                  <use xlink:href="#icon-uncheck-line" />
                </svg>
                <!-- <svg class="icon active" aria-hidden="true" v-if="litem.selected == 1" @click="selectAction(index,gIndex,lindex,0)">
                  <use xlink:href="#icon-checked-block" />
                </svg>-->
              </div>
              <div class="left">
                <div class="ratioBox">
                  <router-link
                    :to="{name: 'detail', query: {goods_id: litem.goods_id}}"
                    class="box"
                  >
                    <img :src="litem.pic" />
                    <!-- <div
                      class="tag"
                      v-if="litem.stores <= 10 && litem.stores > 0"
                    >仅剩{{ litem.stores }}件</div>-->
                    <!-- <div class="tag" v-if="litem.stores == 0">售罄</div> -->
                    <div class="lost_radio">已失效</div>
                  </router-link>
                </div>
              </div>
              <div class="center">
                <div class="title">
                  <router-link
                    :to="{name: 'detail', query: {goods_id: litem.goods_id}}"
                    class="text"
                  >{{ litem.title }}</router-link>
                </div>
                <!-- <div class="subTitle">{{litem.goods_desc}}</div> -->
                <div class="info">
                  <span class="lost">{{litem.valid_desc}}</span>
                  <div class="action">
                    <van-stepper
                      disabled
                      v-model="litem.count"
                      @overlimit="onOverlimit($event,litem.count,litem.detail_id)"
                    />
                  </div>
                </div>
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
          button-text="结算"
          @submit="onSubmit"
        >
          <template slots="default">
            <div style="position:absolute;right:120px;">
              <div>
                合计:
                <span class="price">￥{{money.toFixed(2)}}</span>
              </div>
              <div
                style="font-size:12px;"
                v-if="(total_money - money) > 0"
              >已减：{{(total_money-money).toFixed(2)}}元</div>
            </div>
          </template>
          <div class="totalBox">
            <svg
              class="icon"
              aria-hidden="true"
              v-if="selectTotal == 0"
              @click="selectTotalAction(1)"
            >
              <use xlink:href="#icon-uncheck-line" />
            </svg>
            <svg
              class="icon active"
              aria-hidden="true"
              v-if="selectTotal == 1"
              @click="selectTotalAction(0)"
            >
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
          <div class="totalBox">
            <svg
              class="icon"
              aria-hidden="true"
              v-if="selectTotal == 0"
              @click="selectTotalAction(1)"
            >
              <use xlink:href="#icon-uncheck-line" />
            </svg>
            <svg
              class="icon active"
              aria-hidden="true"
              v-if="selectTotal == 1"
              @click="selectTotalAction(0)"
            >
              <use xlink:href="#icon-checked-block" />
            </svg>
            <span>全选</span>
          </div>
          <template slots="default">
            <div style="position:absolute;right:120px;" @click.stop="clearLost">
              <svg class="icon active" aria-hidden="true">
                <use xlink:href="#icon-brom-line" />
              </svg>
              清空失效宝贝
            </div>
          </template>
        </van-submit-bar>
        <van-number-keyboard
          :show="showkeyboard"
          @input="keyboardonInput"
          @delete="keyboardonDelete"
          :z-index="10000"
        />
        <van-dialog
          v-model="showDialog"
          title="修改购买数量"
          show-cancel-button
          @confirm="confirmEdit"
          @cancel="cancelEdit"
        >
          <div style="padding:20px 15px;margin:15px 0;position:relative;">
            <van-stepper
              v-model="editCount"
              integer
              disable-input
              @plus="editaddCount"
              @minus="editsubCount"
              @overlimit="editonOverlimit($event)"
              :min="1"
              :max="editstores"
              style="width:92px;position:absolute;left:50%;margin-left:-46px;top:0;"
            />
          </div>
        </van-dialog>
      </div>
      <!-- <CopyRight></CopyRight> -->
    </div>
    <EazyNav type="brand" ref="nav"></EazyNav>
  </div>
</template>
<style src="@/style/scss/pages/cart.scss" scoped lang="scss"></style>
<style lang="scss">
#cartPage {
  .van-stepper__input {
    color: #333;
  }
  .van-dialog .van-stepper__input {
    background-color: rgba(54, 133, 206, 0.16);
    color: $cl6;
  }
}
</style>
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
      total_money: null,
      goods_nums: null,
      selectTotal: 0,
      status: "edit",
      // 有效的购物车商品列表
      cartlist: [],
      // 无效的购物车商品列表
      nouse_goods: [],
      show: false,
      cartDatas: {},
      showDialog: false,
      oldCount: 0,
      editCount: 0,
      editDetail_id: null,
      editstores: 0,
      showkeyboard: false,
      editIndex: 0,
      editgIndex: 0,
      editlindex: 0
    };
  },
  mounted() {
    this.cartData();
  },
  updated() {
    var self = this;
    $("body")
      .find("input")
      .removeAttr("disabled");
    $("body")
      .find("input")
      .attr("readonly", "readonly");
    $("body").on("click", ".cardBox .secondList .listBox.judge input", function(
      e
    ) {
      e.stopPropagation();
      var index =
        $(this)
          .parents(".cardBox")
          .index() - 1;
      var gIndex =
        $(this)
          .parents(".secondList")
          .index() - 1;
      var lIndex =
        $(this)
          .parents(".listBox.judge")
          .index() - 1;
      var count =
        self.cartlist[index].act_list[gIndex].goods_list[lIndex].count;
      var stores =
        self.cartlist[index].act_list[gIndex].goods_list[lIndex].stores;
      var detail_id =
        self.cartlist[index].act_list[gIndex].goods_list[lIndex].detail_id;
      var is_valid =
        self.cartlist[index].act_list[gIndex].goods_list[lIndex].is_valid;
      console.log(index, gIndex, lIndex, count, stores, detail_id, is_valid);
      if (is_valid) {
        self.editNumber(index, gIndex, lIndex, count, stores, detail_id);
      }
    });
  },
  methods: {
    cancelEdit() {
      this.showkeyboard = false;
    },
    confirmEdit() {
      console.log(this.goods_nums - this.oldCount + this.editCount);
      if (this.goods_nums - this.oldCount + this.editCount <= 120) {
        this.productCountData(this.editDetail_id, this.editCount);
        this.cartlist[this.editIndex].act_list[
          this.editgIndex
        ].goods_list = this.cartlist[this.editIndex].act_list[
          this.editgIndex
        ].goods_list.map((value, key) => {
          if (this.editlindex == key) value.count = this.editCount;
          return value;
        });
      } else {
        this.$toast("购物车商品总数量不能超过120件~");
      }
      this.showkeyboard = false;
    },
    keyboardonDelete() {
      this.editCount = 0;
    },
    keyboardonInput(value) {
      var _num = this.editCount + value.toString();
      if (Number(_num) > this.editstores) {
        this.$toast("超出库存~");
      } else {
        this.editCount = _num;
      }
    },
    openKeyboard() {
      this.showkeyboard = true;
    },
    // 编辑无效
    editonOverlimit(e) {
      if (e == "plus") {
        this.$toast("超出库存~");
      }
    },
    // 编辑减少
    editsubCount() {
      this.editCount--;
    },
    // 编辑增加
    editaddCount() {
      this.editCount++;
    },
    // 编辑打开
    editNumber(index, gIndex, lindex, count, stores, detail_id) {
      this.editIndex = index;
      this.editgIndex = gIndex;
      this.editlindex = lindex;
      this.oldCount = count;
      this.editCount = count;
      this.editstores = stores;
      this.editDetail_id = detail_id;
      this.showDialog = true;
      this.openKeyboard();
    },
    // 去凑单
    collectBills(gItem, gIndex) {
      this.$router.push({
        name: "multiresult",
        query: {
          multi_id: gItem.multi_id
        }
      });
    },
    // 清空失效宝贝
    clearLost() {
      var detail_ids = "";
      for (let i = 0; i < this.cartlist.length; i++) {
        for (let j = 0; j < this.cartlist[i].act_list.length; j++) {
          for (
            let k = 0;
            k < this.cartlist[i].act_list[j].goods_list.length;
            k++
          ) {
            if (this.cartlist[i].act_list[j].goods_list[k].is_valid == 0)
              detail_ids +=
                this.cartlist[i].act_list[j].goods_list[k].detail_id + ",";
          }
        }
      }
      if (detail_ids == "") {
        this.$toast("购物车中没有失效宝贝~");
        return;
      }
      this.onDelete(
        "删除",
        "是否确认清空失效宝贝？",
        "我再想想",
        "清空",
        detail_ids
      );
    },
    // 改变数量
    async productCountData(detail_id, count) {
      var tStamp = this.$getTimeStamp();
      let data = {
        detail_id: detail_id,
        count: count,
        timestamp: tStamp,
        opt_type: "count",
        version: "1.1"
      };
      data.sign = this.$getSign(data);
      let res = await CART_EDIT(data);

      if (res.hasOwnProperty("response_code")) {
        this.cartDatas = res.response_data.info;
        // this.cartlist = res.response_data.info.cart_list;
        this.goods_nums = res.response_data.info.goods_nums;
        this.$refs.nav.navData.goods_nums = res.response_data.info.goods_nums;
        this.money = res.response_data.info.real_money;
        this.total_money = res.response_data.info.cart_money;
        for (let i = 0; i < res.response_data.info.cart_list.length; i++) {
          for (
            let j = 0;
            j < res.response_data.info.cart_list[i].act_list.length;
            j++
          ) {
            this.cartlist[i].act_list[j].is_reach =
              res.response_data.info.cart_list[i].act_list[j].is_reach;
            this.cartlist[i].act_list[j].summary =
              res.response_data.info.cart_list[i].act_list[j].summary;
            for (
              let k = 0;
              k <
              res.response_data.info.cart_list[i].act_list[j].goods_list.length;
              k++
            ) {
              this.cartlist[i].act_list[j].goods_list[k].price =
                res.response_data.info.cart_list[i].act_list[j].goods_list[
                  k
                ].price;
              this.cartlist[i].act_list[j].goods_list[k].goods_desc =
                res.response_data.info.cart_list[i].act_list[j].goods_list[
                  k
                ].goods_desc;
            }
          }
        }
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
        opt_type: "delete",
        version: "1.1"
      };
      data.sign = this.$getSign(data);
      let res = await CART_EDIT(data);

      if (res.hasOwnProperty("response_code")) {
        this.cartDatas = res.response_data.info;
        this.cartlist = res.response_data.info.cart_list;
        this.goods_nums = res.response_data.info.goods_nums;
        this.$refs.nav.navData.goods_nums = res.response_data.info.goods_nums;
        this.money = res.response_data.info.real_money;
        this.total_money = res.response_data.info.cart_money;
      } else {
        this.$toast(res.error_message);
      }
    },
    //改变选中
    async changeGoodSelect(detail_id, _state) {
      var tStamp = this.$getTimeStamp();
      let data = {
        detail_id: detail_id,
        timestamp: tStamp,
        opt_type: "check",
        selected: _state,
        version: "1.1"
      };
      data.sign = this.$getSign(data);
      let res = await CART_EDIT(data);

      if (res.hasOwnProperty("response_code")) {
        // this.cartDatas = {}
        // this.cartlist = [];
        this.cartDatas = res.response_data.info;

        // this.cartlist = res.response_data.info.cart_list;
        this.goods_nums = res.response_data.info.goods_nums;
        this.money = res.response_data.info.real_money;
        this.total_money = res.response_data.info.cart_money;
      } else {
        this.$toast(res.error_message);
      }
    },
    // 获取购物车信息
    async cartData() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        version: "1.1"
      };
      data.sign = this.$getSign(data);
      let res = await CART_INFO(data);

      if (res.hasOwnProperty("response_code")) {
        this.cartDatas = res.response_data;
        this.selectTotal = res.response_data.cart_selected;
        this.goods_nums = res.response_data.goods_nums;
        this.cartlist = res.response_data.cart_list;
        this.money = res.response_data.real_money;
        this.total_money = res.response_data.cart_money;
        this.show = true;
      } else {
        this.$toast(res.error_message);
      }
    },
    // 购物车全选
    selectTotalAction(isselect) {
      // 关联购物车全选
      this.selectTotal = isselect;
      for (let i = 0; i < this.cartlist.length; i++) {
        this.selectAllAction(i, isselect);
      }
    },
    // 店铺全选
    selectAllAction(index, isselect) {
      var detail_id = "";
      this.cartlist = this.cartlist.map((value, key) => {
        if (index == key) value.supplier_selected = isselect;
        return value;
      });
      for (let i = 0; i < this.cartlist[index].act_list.length; i++) {
        for (
          let j = 0;
          j < this.cartlist[index].act_list[i].goods_list.length;
          j++
        ) {
          if (detail_id) {
            detail_id +=
              "," + this.cartlist[index].act_list[i].goods_list[j].detail_id;
          } else {
            detail_id += this.cartlist[index].act_list[i].goods_list[j]
              .detail_id;
          }
        }
        this.selectAllMulti(index, i, isselect);
      }
      this.aboutSelectAll();
      console.log(detail_id);
      this.changeGoodSelect(detail_id, isselect);
    },
    // 活动全选
    selectAllMulti(index, gIndex, isselect) {
      this.cartlist[index].act_list[gIndex].goods_list = this.cartlist[
        index
      ].act_list[gIndex].goods_list.map((value, key) => {
        value.selected = isselect;
        return value;
      });
    },
    // 选择商品
    selectAction(index, gIndex, lIndex, isselect) {
      var detail_id = this.cartlist[index].act_list[gIndex].goods_list[lIndex]
        .detail_id;
      this.cartlist[index].act_list[gIndex].goods_list = this.cartlist[
        index
      ].act_list[gIndex].goods_list.map((value, key) => {
        if (lIndex == key) value.selected = isselect;
        return value;
      });
      //关联店铺选择
      var m_list = [];
      var _length = 0;
      for (let i = 0; i < this.cartlist[index].act_list.length; i++) {
        for (
          let j = 0;
          j < this.cartlist[index].act_list[i].goods_list.length;
          j++
        ) {
          if (this.status == "delete") {
            m_list.push(this.cartlist[index].act_list[i].goods_list[j]);
          } else {
            if (this.cartlist[index].act_list[i].goods_list[j].is_valid) {
              m_list.push(this.cartlist[index].act_list[i].goods_list[j]);
            }
          }
          if (this.cartlist[index].act_list[i].goods_list[j].selected) {
            _length++;
          }
        }
      }
      if (_length == m_list.length) {
        this.cartlist = this.cartlist.map((value, key) => {
          if (index == key) value.supplier_selected = 1;
          return value;
        });
      } else {
        this.cartlist = this.cartlist.map((value, key) => {
          if (index == key) value.supplier_selected = 0;
          return value;
        });
      }
      this.aboutSelectAll();
      console.log(m_list);
      this.changeGoodSelect(detail_id, isselect);
    },
    // 关联全选
    aboutSelectAll() {
      var c_length = 0;
      for (let i = 0; i < this.cartlist.length; i++) {
        if (this.cartlist[i].supplier_selected) {
          c_length++;
        }
      }
      console.log(555, c_length);
      if (c_length == this.cartlist.length) {
        this.selectTotal = 1;
      } else {
        this.selectTotal = 0;
      }
      console.log(666, this.selectTotal);
    },
    // 编辑或者删除状态切换
    editOrDelete() {
      this.status = this.status == "edit" ? "delete" : "edit";
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
      this.onDelete("删除", "是否确认删除？", "我再想想", "删除", detail_ids);
    },
    // 获取 detail_ids
    getDetailIdsData() {
      var detail_id = "";
      for (let i = 0; i < this.cartlist.length; i++) {
        for (let j = 0; j < this.cartlist[i].act_list.length; j++) {
          for (
            let k = 0;
            k < this.cartlist[i].act_list[j].goods_list.length;
            k++
          ) {
            if (this.cartlist[i].act_list[j].goods_list[k].selected == 1)
              detail_id +=
                this.cartlist[i].act_list[j].goods_list[k].detail_id + ",";
          }
        }
      }
      return detail_id;
    },
    onDelete(title, message, cancelButtonText, confirmButtonText, detail_id) {
      this.$dialog
        .confirm({
          title: title,
          message: message,
          cancelButtonText: cancelButtonText,
          confirmButtonText: confirmButtonText
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
    onOverlimit(e, count, detail_id) {
      if (e == "minus") {
        this.onDelete(
          "删除",
          "确认删除这 1 件商品吗？",
          "我再想想",
          "删除",
          detail_id
        );
      } else if (e == "plus") {
        this.$toast("超出库存~");
      }
    },
    // 计数 +
    addCount(cIndex, gIndex, lindex, detail_id, count) {
      if (this.goods_nums + 1 <= 120) {
        var _count;
        this.cartlist[cIndex].act_list[gIndex].goods_list = this.cartlist[
          cIndex
        ].act_list[gIndex].goods_list.map((value, key) => {
          if (lindex == key) {
            value.count++;
            _count = value.count;
          }
          return value;
        });
        // 数量加减
        this.productCountData(detail_id, _count);
      } else {
        setTimeout(() => {
          this.cartlist[cIndex].act_list[gIndex].goods_list = this.cartlist[
            cIndex
          ].act_list[gIndex].goods_list.map((value, key) => {
            if (lindex == key) {
              value.count = count;
            }
            return value;
          });
          this.$toast("购物车商品总数量不能超过120件~");
        }, 1);
      }
      // console.log(count,this.cartlist[cIndex].act_list[gIndex].goods_list[lindex].count)
    },
    // 计数 -
    subCount(cIndex, gIndex, lindex, detail_id) {
      // this.countType = "sub";
      var count;
      this.cartlist[cIndex].act_list[gIndex].goods_list = this.cartlist[
        cIndex
      ].act_list[gIndex].goods_list.map((value, key) => {
        if (lindex == key) {
          value.count--;
          count = value.count;
        }
        return value;
      });
      // 数量加减
      this.productCountData(detail_id, count);
    }
  }
};
</script>
