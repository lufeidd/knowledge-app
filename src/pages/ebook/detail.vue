<template>
  <div id="ebookDetailPage">
    <div class="goodsInfo">
      <div class="info">
        <div class="ratiobox">
          <div class="bookImg" :style="{'background-image':'url('+baseData.pic[0]+')'}"></div>
        </div>
        <div class="right">
          <div class="title">{{baseData.title}}</div>
          <div class="author">{{baseData.author}}</div>
          <div class="category">{{baseData.category_path}}</div>
          <!-- 促销活动 -->
          <div v-if="baseData.single_activity_id">
            <div class="price">
              促销价：￥{{baseData.price.toFixed(2)}}
              <span class="original">
                原价
                <del>￥{{baseData.market_price.toFixed(2)}}</del>
              </span>
            </div>
            <div v-if="showTime">
              <span class="promotion" v-if="showDay">{{timeDataDesc}}</span>
              <span v-else>
                <span class="promotion">距活动结束还剩</span>
                {{timeDataDesc}}
              </span>
            </div>
          </div>
          <div v-else>
            <div class="price" v-if="baseData.price">￥{{baseData.price.toFixed(2)}}</div>
            <div class="price" v-else>免费阅读</div>
          </div>
        </div>
      </div>
      <div class="descript" @click="showDetail">{{baseData.goods_desc}}</div>
    </div>

    <!-- 优惠券 -->
    <!-- v-if="Object.keys(couponInfo.ticket).length>0" -->
    <div style="margin:5px 0;padding:0 15px;background-color:#FFF;">
      <van-cell
        title
        is-link
        value
        @click="showCoupon"
        style="margin:5px 0;"
        v-if="Object.keys(couponInfo.ticket).length>0"
      >
        <template slot="title">
          <span style="margin-right:10px;" v-if="isReceived">已领券</span>
          <span style="margin-right:10px;" v-else>领券</span>
          <span class="toMall" v-for="(item,index) in couponInfo.ticket.list" :key="index">{{item}}</span>
        </template>
      </van-cell>
    </div>

    <div class="watchCatalog">
      <van-cell value is-link @click="showDetail">
        <template slot="title">
          <span class="custom-text">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-category-line" />
            </svg>
          </span>
          <span style="margin-left:10px;">查看目录 · 版权信息</span>
        </template>
      </van-cell>
      <van-cell value is-link @click="toDetail" v-if="baseData.book_info">
        <template slot="title">
          <span class="custom-text">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-paperbook-line" />
            </svg>
          </span>
          <span style="margin-left:10px;">纸书购买</span>
        </template>
      </van-cell>
    </div>
    <!-- 公号信息 -->
    <div class="brand_info">
      <div class="left" @click="toBrand">
        <div class="ratiobox">
          <div class="bookImg" v-lazy:background-image="brandInfo.header_pic"></div>
        </div>
        <span class="name">{{brandInfo.name}}</span>
      </div>
      <div class="toMall" @click="focusAction" v-if="brandInfo.is_followed">已关注</div>
      <div class="toMall foucs" @click="focusAction" v-else>关注</div>
    </div>
    <!-- 推荐 -->
    <!-- 相关推荐模块 -->
    <div class="recommend" v-if="recommendList.length>0">
      <div class="text">推荐电子书</div>
      <swiper class="swiperTags" :options="swiperOption3" ref="mySwiper">
        <swiper-slide v-for="(item,index) in recommendList" :key="index">
          <div class="recommendInfo">
            <div class="ratiobox" @click="toEbook(item,index)">
              <a class="bookImg" v-lazy:background-image="item.pic"></a>
            </div>
            <div class="content">
              <div class="recommendName">{{item.goods_title}}</div>
              <div class="nickname">{{item.author}}</div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <!-- 领取优惠券 -->
    <van-popup v-model="couponModel" position="bottom" style="max-height:65%;min-height:65%;">
      <div class="header">
        <span class="catalogWord">可用优惠券（满足条件后可用于当前商品）</span>
        <span>
          <svg class="icon" aria-hidden="true" @click="closePopup">
            <use xlink:href="#icon-close-line" />
          </svg>
        </span>
      </div>
      <div class="content">
        <div
          style="margin-top:10px;overflow:hidden;border-radius:0 6px 6px 0;box-shadow:0 0 10px rgba(0,0,0,0.06);"
          v-for="(item,index) in couponList"
          :key="index"
        >
          <!-- 可领取 -->
          <div class="toUse" v-if="item.state == 1 || item.state == 3">
            <div class="left"></div>
            <div class="mid">
              <div>
                ￥
                <span class="price">{{item.money}}</span>
              </div>
              <div class="condition">{{item.use_time_desc}}</div>
              <span class="circle top"></span>
              <span class="circle bottom"></span>
            </div>
            <div class="right">
              <div>
                <span class="shopCoupon">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-coupon-block" />
                  </svg>
                  <span class="dianpu" v-if="item.brand_id">店铺券</span>
                  <span class="dianpu" v-else>平台券</span>
                </span>
                <span class="shop">{{item.brand_name}}</span>
              </div>
              <div class="desc">
                {{item.use_range_desc}}
                <span
                  class="toMall btn red"
                  v-if="item.state == 1 && requestState"
                  @click="receive(item,index)"
                >点击领取</span>
                <span class="toMall btn red" v-if="item.state == 1 && !requestState">点击领取</span>
                <span class="toMall btn" v-if="item.state == 3" @click="toResult(item,index)">可用商品</span>
              </div>
              <div class="time">
                <span
                  v-if="item.state == 3"
                >{{item.use_stime.replace(/-/g,'.').substring(0,10)}}-{{item.use_etime.replace(/-/g,'.').substring(0,10)}}</span>
                <span v-else>
                  <span v-if="item.use_time_type == 2">领取后{{item.use_time_day}}天有效</span>
                  <span
                    v-else
                  >{{item.use_stime.replace(/-/g,'.').substring(0,10)}}-{{item.use_etime.replace(/-/g,'.').substring(0,10)}}</span>
                </span>
              </div>
              <span class="used" v-if="item.state == 3">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-yilingqu" />
                </svg>
              </span>
            </div>
          </div>
          <!-- 已领完 -->
          <div class="toUse overdue" v-if="item.state == 2">
            <div class="left"></div>
            <div class="mid">
              <div>
                ￥
                <span class="price">{{item.money}}</span>
              </div>
              <div class="condition">{{item.use_time_desc}}</div>
              <span class="circle top"></span>
              <span class="circle bottom"></span>
            </div>
            <div class="right">
              <div>
                <span class="shopCoupon">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-coupon-block" />
                  </svg>
                  <span class="dianpu" v-if="item.brand_id">店铺券</span>
                  <span class="dianpu" v-else>平台券</span>
                </span>
                <span class="shop">{{item.brand_name}}</span>
              </div>
              <div class="desc">{{item.use_range_desc}}</div>
              <span class="used">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-received-line" />
                </svg>
              </span>
              <div class="time" v-if="item.use_time_type == 2">领取后{{item.use_time_day}}天有效</div>
              <div
                class="time"
                v-else
              >{{item.use_stime.replace(/-/g,'.').substring(0,10)}}-{{item.use_etime.replace(/-/g,'.').substring(0,10)}}</div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
    <!-- 评论 -->
    <div class="commentBox">
      <div class="commentWord">{{totalCount}}</div>
      <div class="foot">
        <div class="comment" @click="openAnswer('comment', null)">
          <span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-edit-line" />
            </svg>
          </span>
          <span style="margin-left:10px;">爱发言的人运气不会差！</span>
        </div>
      </div>

      <van-list
        v-model="commentLoading"
        :finished="commentFinished"
        finished-text="没有更多了"
        @load="commentLoad"
      >
        <div class="listBox" v-for="(item, key) in discussData" :key="key">
          <div class="left">
            <div class="ratioBox">
              <div class="box">
                <img :src="item.user_header" />
              </div>
            </div>
          </div>
          <div class="center">
            <div class="title">
              <div class="text">{{ item.nick_name }}</div>
            </div>
            <div class="subTitle">{{ item.content }}</div>

            <div class="messageBox" v-if="answerData[key].length > 0">
              <!-- 回复 -->

              <!-- <div
                        class="message active"
                        v-for="(replyItem, key) in item.reply_list"
                        :key="key"
                      >
                        <span class="name">{{ replyItem.nick_name }}</span>
                        <span class="dialog">{{ replyItem.content }}</span>
              </div>-->

              <div class="message active" v-for="(replyItem, key) in answerData[key]" :key="key">
                <span class="name">{{ replyItem.nick_name }}</span>
                <span class="dialog">{{ replyItem.content }}</span>
              </div>

              <div
                class="message active"
                v-if="item.reply_num > 2 && replyPage[key] <= item.reply_total_page"
              >
                <!-- <van-pagination v-model="item.reply_current_page" :page-count="item.reply_total_page" mode="simple" @change="pageChange(item.comment_id, key)" /> -->

                <span class="name" @click="pageChange(item.comment_id, key)">
                  共{{ item.reply_num }}条回复
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-fold-line" />
                  </svg>
                  <!-- <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-unfold-line"></use>
                  </svg>-->
                </span>
              </div>
            </div>

            <!-- 回复 -->
            <div class="answerBox">
              <span class="date">{{ item.create_time }}</span>
              <span class="action" @click="openAnswer('reply', item.comment_id)">回复</span>
            </div>
          </div>
        </div>
      </van-list>
    </div>
    <!-- 评论 -->
    <van-popup v-model="commentModel" position="bottom" style="max-height:70%;">
      <div class="audioList">
        <div class="title">
          <div class="action" @click="commentClose">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-fold-line" />
            </svg>
          </div>
          <div>发表评论</div>
          <div class="punish" @click="punishComment">发布</div>
        </div>
        <!-- 音频列表 -->
        <div class="content">
          <textarea v-model="contentModel" placeholder="快来写评论吧!" @input="inputChange"></textarea>
          <div class="count">
            <span :class="{ active: contentLength > contentTotal }">{{ contentLength }}</span>
            /{{ contentTotal }}
          </div>
        </div>
      </div>
    </van-popup>
    <!-- 详细信息 -->
    <van-popup v-model="detailShow" position="bottom" style="min-height:70%;max-height:70%;">
      <div class="detailList">
        <div class="head">
          <svg class="icon" aria-hidden="true" @click="closePopup">
            <use xlink:href="#icon-close-line" />
          </svg>
        </div>
        <div class="content">
          <div class="word">简介</div>
          <div class="descript">{{baseData.goods_desc}}</div>
          <div class="word">出版信息</div>
          <div class="publish">
            <div>
              出版社
              <span style="margin-left:20px;">{{baseData.publisher}}</span>
            </div>
            <div>
              ISBN
              <span style="margin-left:30px;">{{baseData.isbn}}</span>
            </div>
          </div>
          <div class="word">目录</div>
          <!-- 章节目录 -->
          <div class="list">
            <ul>
              <li v-for="(item,index) in ebookList" :key="index" @click="read(item,index)">
                <div class="left">
                  <!-- <div>第{{index+1}}章</div> -->
                  <div class="title">{{item.chapter_name}}</div>
                </div>
                <span>
                  <svg
                    class="icon"
                    aria-hidden="true"
                    v-if="item.chapter_free == 0 && item.chapter_try == 0"
                  >
                    <use xlink:href="#icon-lock-line" />
                  </svg>
                  <span v-if="item.chapter_free == 0 && item.chaprer_try == 1">试读</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </van-popup>
    <CopyRight></CopyRight>
    <div style="height: 60px;"></div>
    <div class="bottom">
      <div
        class="isbuy"
        v-if="baseData.is_payed == 0 && baseData.is_free == 0 && baseData.has_free == 1"
      >
        <div v-if="baseData.is_sbookshelf == 0" class="shelf" @click="shelfAction">加入书架</div>
        <div v-else class="shelf" @click="shelfAction">已加入书架</div>
        <div @click="buyNow">立即购买</div>
        <div class="read" @click="toreader">免费阅读</div>
      </div>
      <div class="nobuy" v-if="baseData.is_free == 1 || baseData.is_payed == 1">
        <div v-if="baseData.is_sbookshelf == 0" @click="shelfAction">加入书架</div>
        <div class="shelf" v-else @click="shelfAction">已加入书架</div>
        <div class="read" @click="toreader">立即阅读</div>
        <!-- <div class="read" @click="toreader" v-else>免费阅读</div> -->
      </div>
      <div
        class="nobuy"
        v-if="baseData.is_free == 0 && baseData.is_payed == 0 && baseData.has_free == 0"
      >
        <div v-if="baseData.is_sbookshelf == 0" @click="shelfAction">加入书架</div>
        <div class="shelf" v-else @click="shelfAction">已加入书架</div>
        <div class="read" @click="buyNow">立即购买</div>
      </div>
    </div>
    <!-- 支付购买弹层 -->
    <ebookpay
      :goods_id="goods_id"
      ref="pay"
      :info="info"
      :isgroup="isgroup"
      :isSuccessPay="isSuccessPay"
      @rechargeBuy="payrecharge"
      @payMoney="payMoney"
      @chooseCouponChangePrice="chooseCouponChangePrice"
    ></ebookpay>
    <!-- 充值余额并支付 -->
    <ebookrecharge ref="recharge" :info="info" :goods_id="goods_id" @return="returnUp"></ebookrecharge>
    <!-- 数字键盘 -->
    <van-number-keyboard
      :show="showKeyboard"
      @input="onInput"
      @delete="onDelete"
      @blur="showKeyboard = false"
    />
    <van-dialog
      v-model="showDialog"
      title="请输入手机验证码"
      show-cancel-button
      cancelButtonText="放弃支付"
      @cancel="reflesh"
    >
      <div class="codeBox">
        <div class="price">
          ¥
          <span class="money">{{ pay_money }}</span>
        </div>
        <div class="code">
          <van-row>
            <van-col span="14" style="text-align:left;">手机号:{{ pay_mobilephone }}</van-col>
            <van-col span="10" style="text-align: right;">
              <template v-if="codeData.disabled">
                <van-button size="small" round disabled type="danger">{{ codeData.timeMsg }}</van-button>
              </template>
              <template v-else>
                <van-button size="small" round type="danger" @click="getCode">{{ codeData.timeMsg }}</van-button>
              </template>
            </van-col>
          </van-row>
        </div>
        <!-- 密码输入框 -->
        <van-password-input :value="passvalue" :mask="false" @focus="keyboardShow" />
      </div>
    </van-dialog>
    <!-- 拼团 -->
    <div
      class="groupBuy"
      @click="toGoodsGroup"
      v-if="couponInfo.groupbuy && Object.keys(couponInfo.groupbuy).length>0 && baseData.is_payed == 0"
    >
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-left-arrow" />
      </svg>
      <span style="margin-left:5px;">拼团价：￥{{couponInfo.groupbuy.groupbuy_price.toFixed(2)}}</span>
    </div>
    <!-- 拼团 -->
    <van-popup
      v-model="groupModel"
      v-if="couponInfo.groupbuy && Object.keys(couponInfo.groupbuy).length > 0"
      style="width:95%;height:60%;border-radius:6px;"
    >
      <div class="group">
        <div class="top">
          <div class="ratiobox">
            <div class="bookImg" :style="{'background-image':'url('+baseData.pic[0]+')'}"></div>
          </div>
          <div class="right">
            <div class="title">{{baseData.title}}</div>
            <div class="sign">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-huo" />
              </svg>
              {{couponInfo.groupbuy.join_desc}}
            </div>
            <div
              class="desc"
            >{{couponInfo.groupbuy.groupbuy_num}}人团：￥{{couponInfo.groupbuy.groupbuy_price.toFixed(2)}}</div>
          </div>
        </div>
        <div class="list" v-if="couponInfo.groupbuy.open_list.length>0">
          <div class="content" v-for="(item,index) in couponInfo.groupbuy.open_list" :key="index">
            <!-- 2人团 -->
            <div class="left" v-if="item.nums == 2">
              <img
                :src="item.user_head_list[0]"
                width="30px"
                height="30px"
                alt
                style="left:0;z-index:1;"
              />
              <span class="add" style="left:50px;z-index:4;">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-renshu" />
                </svg>
              </span>
            </div>
            <!-- 三人团剩2人 -->
            <div class="left" v-if="item.nums == 3">
              <img
                :src="item.user_head_list[0]"
                width="30px"
                height="30px"
                alt
                style="left:0;z-index:1;"
              />
              <span class="add" style="left:30px;z-index:3;">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-renshu" />
                </svg>
              </span>
              <span class="add" style="left:50px;z-index:4;">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-renshu" />
                </svg>
              </span>
            </div>
            <!-- 三人团剩1人 -->
            <div class="left" v-if="item.nums == 3">
              <img
                :src="item.user_head_list[0]"
                width="30px"
                height="30px"
                alt
                style="left:0;z-index:1;"
              />
              <img
                :src="item.user_head_list[1]"
                width="30px"
                height="30px"
                alt
                style="left:25px;z-index:3;"
              />
              <span class="add" style="left:50px;z-index:4;">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-renshu" />
                </svg>
              </span>
            </div>
            <!-- 三人团剩1人 -->
            <div class="left" v-if="item.nums == 3">
              <img
                :src="item.user_head_list[0]"
                width="30px"
                height="30px"
                alt
                style="left:0;z-index:1;"
              />
              <img
                :src="item.user_head_list[1]"
                width="30px"
                height="30px"
                alt
                style="left:25px;z-index:3;"
              />
              <span class="add" style="left:50px;z-index:4;">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-renshu" />
                </svg>
              </span>
            </div>
            <!-- 四人团剩3人 -->
            <div class="left" v-if="item.nums == 4">
              <img
                :src="item.user_head_list[0]"
                width="30px"
                height="30px"
                alt
                style="left:0;z-index:1;"
              />
              <span class="add" style="left:15px;z-index:2;">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-renshu" />
                </svg>
              </span>
              <span class="add" style="left:30px;z-index:3;">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-renshu" />
                </svg>
              </span>
              <span class="add" style="left:50px;z-index:4;">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-renshu" />
                </svg>
              </span>
            </div>
            <!-- 四人团剩2人 -->
            <div class="left" v-if="item.nums == 4">
              <img
                :src="item.user_head_list[0]"
                width="30px"
                height="30px"
                alt
                style="left:0;z-index:1;"
              />
              <img
                :src="item.user_head_list[1]"
                width="30px"
                height="30px"
                alt
                style="left:15px;z-index:2;"
              />
              <span class="add" style="left:30px;z-index:3;">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-renshu" />
                </svg>
              </span>
              <span class="add" style="left:50px;z-index:4;">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-renshu" />
                </svg>
              </span>
            </div>
            <!-- 四人团剩1人 -->
            <div class="left" v-if="item.nums == 4">
              <img
                :src="item.user_head_list[0]"
                width="30px"
                height="30px"
                alt
                style="left:0;z-index:1;"
              />
              <img
                :src="item.user_head_list[1]"
                width="30px"
                height="30px"
                alt
                style="left:15px;z-index:2;"
              />
              <img
                :src="item.user_head_list[2]"
                width="30px"
                height="30px"
                alt
                style="left:30px;z-index:3;"
              />
              <span class="add" style="left:50px;z-index:4;">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-renshu" />
                </svg>
              </span>
            </div>
            <!-- 多人团剩n-1人 -->
            <div class="left" v-if="item.nums > 4 && item.remain_nums == item.nums - 1">
              <img
                :src="item.user_head_list[0]"
                width="30px"
                height="30px"
                alt
                style="left:0;z-index:1;"
              />
              <span class="add" style="left:15px;z-index:2;">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-renshu" />
                </svg>
              </span>
              <span class="over" style="left:30px;z-index:3;">...</span>
              <span class="add" style="left:50px;z-index:4;">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-renshu" />
                </svg>
              </span>
            </div>
            <!-- 多人团剩小于n-1人 -->
            <div class="left" v-if="item.nums > 4 && item.remain_nums < item.nums - 1">
              <img
                :src="item.user_head_list[0]"
                width="30px"
                height="30px"
                alt
                style="left:0;z-index:1;"
              />
              <img
                :src="item.user_head_list[1]"
                width="30px"
                height="30px"
                alt
                style="left:15px;z-index:2;"
              />
              <span class="over" style="left:30px;z-index:3;">...</span>
              <span class="add" style="left:50px;z-index:4;">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-renshu" />
                </svg>
              </span>
            </div>
            <div class="mid">
              <div>还差{{item.remain_nums}}人成团</div>
              <div class="time">剩余{{remain_time[index].date}}</div>
            </div>
            <div class="right">
              <van-button
                round
                size="small"
                type="danger"
                disabled
                v-if="couponInfo.groupbuy.my_open_ids.length>0 || couponInfo.groupbuy.user_remain_nums == 0"
              >去参团</van-button>
              <van-button round size="small" type="danger" @click="addgroup(item)" v-else>去参团</van-button>
            </div>
          </div>
        </div>
        <div class="groupbottom" v-if="couponInfo.groupbuy.my_open_ids.length>0">
          <div class="text">您正在参加该商品的拼团哦~</div>
          <van-button type="danger" size="small" round @click="togroupDetail">去看看</van-button>
        </div>
        <div class="groupbottom" v-else>
          <div class="text">开团/参团 - 邀请好友 - 满员发货/不满员退款</div>
          <van-button
            type="danger"
            size="small"
            round
            @click="group"
            v-if="couponInfo.groupbuy.can_open_nums > 0"
          >一键开团</van-button>
          <van-button type="danger" size="small" round disabled v-else>一键开团</van-button>
        </div>
      </div>
    </van-popup>
    <EazyNav type="brand" :isShow="true"></EazyNav>
  </div>
</template>

<style src="@/style/scss/pages/ebook/detail.scss" scoped lang="scss"></style>
<style lang="scss">
#ebookDetailPage {
  .van-cell {
    padding: 10px 0;
    .van-cell__value {
      display: none;
    }
  }
  .van-dialog__confirm {
    display: none;
  }
  .groupBuy {
    width: 126px;
    height: 30px;
    line-height: 30px;
    color: $white;
    background: linear-gradient(to right, #f72d3e 100%, #f35636 100%);
    border-radius: 15px 0 0 15px;
    font-size: $fontSize - 2;
    position: absolute;
    z-index: 99;
    top: 130px;
    right: 0;
    text-align: center;
    .icon {
      position: absolute;
      left: 5px;
      top: 50%;
      margin-top: -6px;
    }
  }
}
</style>
<script>
import {
  ORDER_VIRTUAL_ADD,
  ORDER_VIRTUAL_ADD_SENDCODE,
  ORDER_VIRTUAL_ADD_PAY,
  ORDER_VIRTUAL_ADDINFO
} from "../../apis/shopping.js";
import ebookpay from "../ebook/pay";
import ebookrecharge from "../ebook/recharge";
import { ALBUM } from "../../apis/album.js";
import {
  EBOOK_RECOMMEND,
  EBOOK_CATALOG,
  EBOOK_INFO,
  EBOOK_SHELF_ADD,
  EBOOK_SHELF_CANCEL
} from "../../apis/ebook.js";
import {
  FOCUS_ADD,
  FOCUS_CANCEL,
  COMMENT,
  COMMENT_ADD,
  RECOMMEND
} from "../../apis/public.js";
import { GOODS_TICKET_GETS, TICKET_LINK } from "../../apis/coupon.js";
export default {
  components: { ebookpay, ebookrecharge },
  data() {
    return {
      onsale: null,
      isLogin: null,
      goods_id: null,
      brandInfo: {},
      baseData: {
        pic: []
      },
      info: {},
      bookshelf_id: null,
      swiperOption3: {
        slidesPerView: 3.5
      },
      // 评论
      discussData: [],
      commentPage: 1,
      totalCount: "评论 (" + 0 + ")",
      // 发布评论
      commentModel: false,
      contentModel: "",
      contentTotal: 500,
      contentLength: 0,
      // 分页
      commentLoading: false,
      commentFinished: false,
      // 回复
      replyPage: [],
      answerData: [],
      // 存放回复评论comment_id
      commentId: null,
      // 存放发布按钮类型，comment为发布评论，reply为发布回复
      punishType: "comment",
      recommendList: [],
      detailShow: false,
      ebookList: [],
      minChapter: null,
      currenChapterTitle: "",

      // 密码输入框
      showDialog: false,
      passvalue: "",
      showKeyboard: false,
      mobile: "",
      code: "",
      pay_mobilephone: "",
      pay_money: "",
      // 验证码
      codeData: {
        disabled: false,
        timeMsg: "获取验证码",
        time: 120
      },
      // 订单号
      order_id: "",
      pay_id: "",
      timer: null,
      isSuccessPay: null,
      // 优惠券信息
      couponInfo: {
        ticket: {},
        single: {},
        groupbuy: {}
      },
      couponList: [],
      couponModel: false,
      isReceived: false,
      requestState: true,
      // 倒计时
      timeData: "2019-10-16 17:28:00",
      timeDataDesc: "",
      showTime: false,
      showDay: true,
      groupModel: false,
      isgroup: false,
      remain_time: [],
      groupbuy_id: null
    };
  },
  mounted() {
    this.goods_id = this.$route.query.goods_id;
    this.isSuccessPay = this.$route.query.isSuccessPay;
    this.getData();
    this.getRecommendData();
    this.getList();
    this.getebookInfo();
    // this.ebookCoupon();
    this.getCouponList();
  },
  methods: {
    closePopup() {
      this.detailShow = false;
      this.couponModel = false;
    },
    toDetail() {
      this.$router.push({
        name: "detail",
        query: { goods_id: this.baseData.book_info.goods_id }
      });
    },
    //跳转公号主页
    toBrand() {
      this.$router.push({
        name: "brand",
        query: {
          brand_id: this.brandInfo.brand_id
        }
      });
    },
    //获取电子书基本信息
    async getebookInfo() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        goods_id: this.goods_id,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await EBOOK_INFO(data);
      if (res.hasOwnProperty("response_code")) {
        // console.log(res);
        this.info = res.response_data;
        this.$refs.pay.price = this.info.price;
        this.$refs.recharge.price = this.info.price;
      } else {
        this.$toast(res.error_message);
      }
    },
    //获取页面基本信息
    async getData() {
      var tStamp = this.$getTimeStamp();
      var data = {
        ad: parseInt(this.$route.query.ad) == 1 ? 1 : 0,
        goods_id: this.goods_id,
        version: "1.0",
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await ALBUM(data);
      if (res.hasOwnProperty("response_code")) {
        this.baseData = res.response_data.base;
        this.brandInfo = res.response_data.brand_info;
        this.isLogin = res.response_data.user_info.is_login;
        this.bookshelf_id = res.response_data.base.is_sbookshelf;
        document.title = "电子书详情-" + res.response_data.base.title;
        // 优惠券
        this.couponInfo = res.response_data.activity;
        if (this.couponInfo.single.remain_time > 0) {
          this.$countTime(this.couponInfo.single.remain_time);
        }
        if (
          this.couponInfo.groupbuy &&
          Object.keys(this.couponInfo.groupbuy).length > 0 &&
          this.couponInfo.groupbuy.open_list.length > 0
        ) {
          if (this.couponInfo.groupbuy.open_list.length > 2) {
            this.couponInfo.groupbuy.open_list = this.couponInfo.groupbuy.open_list.slice(
              0,
              2
            );
          }
          for (var i = 0; i < this.couponInfo.groupbuy.open_list.length; i++) {
            this.remain_time.push({
              time: this.couponInfo.groupbuy.open_list[i].remain_time,
              date: ""
            });
            this.$timeCountDown(this.remain_time[i]);
          }
        }

        // 获取页面分享信息
        // if(this.isWxLogin) this.wxShareData();
        var _pageName = "goods/detail";
        var _params = JSON.stringify({
          goods_id: this.$route.query.goods_id
          // album_id: this.$route.query.pid
        });
        if (this.isWxLogin) this.$getWxShareData(_pageName, _params);

        this.onsale = 1;
      } else {
        if (res.hasOwnProperty("error_code") && res.error_code == 401) {
          // 上下架状态, 1=> 在架, 0=> 下架
          this.onsale = 0;
        }
        this.$toast(res.error_message);
      }
    },
    // 促销活动结束回复原价
    async returnPrice() {
      var tStamp = this.$getTimeStamp();
      let data = {
        ad: parseInt(this.$route.query.ad) == 1 ? 1 : 0,
        timestamp: tStamp,
        goods_id: this.baseData.goods_id,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await ALBUM(data);

      if (res.hasOwnProperty("response_code")) {
        this.baseData.price = res.response_data.base.price;
        this.baseData.market_price = res.response_data.base.market_price;
        this.baseData.single_activity_id =
          res.response_data.base.single_activity_id;
      } else {
        if (res.hasOwnProperty("error_code") && res.error_code == 401) {
          // 上下架状态, 1=> 在架, 0=> 下架
          this.onsale = 0;
        }
        this.$toast(res.error_message);
      }

      // console.log("商品基础信息:", res.response_data);
    },
    // 获取电子书相关推荐
    async getRecommendData() {
      var tStamp = this.$getTimeStamp();
      var data = {
        goods_id: this.goods_id,
        version: "1.0",
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await EBOOK_RECOMMEND(data);
      if (res.hasOwnProperty("response_code")) {
        this.recommendList = res.response_data;
      } else {
        this.$toast(res.error_message);
      }
    },
    // 电子书相关推荐跳转
    toEbook(item, index) {
      console.log(item);
      this.$router.push({
        name: "ebookdetail",
        query: { goods_id: item.goods_id }
      });
      $(window).scrollTop(0);
      location.reload();
    },
    // 获取电子书章节
    async getList() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        goods_id: this.goods_id,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await EBOOK_CATALOG(data);
      if (res.hasOwnProperty("response_code")) {
        // console.log(res);
        // this.ebookList = res.response_data;
        for (var i = 0; i < res.response_data.length; i++) {
          if (res.response_data[i].chapter_hidden == 0) {
            this.ebookList.push(res.response_data[i]);
          }
        }
        // console.log(333, this.ebookList);
        this.minChapter = this.ebookList[0].chapter_id;
      } else {
        this.$toast(res.error_message);
      }
    },
    // 关注公众号
    focusAction() {
      // 未登录跳转至登录页
      if (this.isLogin == 0) {
        this.$router.push({ name: "login", params: {} });
        this.$toast("用户未登录!");
        return;
      }
      if (this.brandInfo.is_followed > 0) {
        this.focusData("cancel");
      } else {
        this.focusData("focus");
      }
    },
    // 加入书架
    shelfAction() {
      // 未登录跳转至登录页
      if (this.isLogin == 0) {
        this.$router.push({ name: "login", params: {} });
        this.$toast("用户未登录!");
        return;
      }
      if (this.baseData.is_sbookshelf > 0) {
        this.shelfData("cancel");
      } else {
        this.shelfData("add");
      }
    },
    // 获取加入或移出书架
    async shelfData(__type) {
      var data = {};
      var res;
      var tStamp = this.$getTimeStamp();
      switch (__type) {
        case "add":
          data = {
            timestamp: tStamp,
            goods_id: this.goods_id,
            schedule: 0.0,
            version: "1.0"
          };
          data.sign = this.$getSign(data);
          res = await EBOOK_SHELF_ADD(data);

          this.baseData.is_sbookshelf = 1;
          this.$toast("已加入书架~");
          this.bookshelf_id = res.response_data.bookshelf_id;
          break;
        case "cancel":
          data = {
            timestamp: tStamp,
            bookshelf_id: this.bookshelf_id,
            version: "1.0"
          };
          data.sign = this.$getSign(data);
          res = await EBOOK_SHELF_CANCEL(data);
          this.baseData.is_sbookshelf = 0;
          this.$toast("已移出书架~");
          break;
      }
      // 出错提示
      if (res.hasOwnProperty("response_code")) {
      } else {
        this.$toast(res.error_message);
      }
    },
    // 获取关注接口信息
    async focusData(__type) {
      var data = {};
      var res;
      var tStamp = this.$getTimeStamp();
      switch (__type) {
        case "focus":
          data = {
            timestamp: tStamp,
            brand_id: this.brandInfo.brand_id,
            version: "1.0"
          };
          data.sign = this.$getSign(data);
          res = await FOCUS_ADD(data);

          this.brandInfo.is_followed = 1;
          this.$toast("已关注~");
          break;
        case "cancel":
          data = {
            timestamp: tStamp,
            brand_id: this.brandInfo.brand_id,
            version: "1.0"
          };
          data.sign = this.$getSign(data);
          res = await FOCUS_CANCEL(data);
          this.brandInfo.is_followed = 0;
          this.$toast("已取消关注~");
          break;
      }
      // 出错提示
      if (res.hasOwnProperty("response_code")) {
      } else {
        this.$toast(res.error_message);
      }
    },
    showDetail() {
      this.detailShow = true;
      // this.getList();
    },
    read(item, index) {
      console.log(item);
      this.currenChapterTitle = index + 1;
      this.$router.push({
        name: "ebookreader",
        query: {
          goods_id: this.goods_id,
          chapter_id: item.chapter_id,
          currenChapterTitle: this.currenChapterTitle
        }
      });
    },
    // 支付
    buyNow() {
      if (this.isLogin) {
        this.groupbuy_id = 0;
        this.$refs.pay.price = this.info.price;
        this.$refs.recharge.price = this.info.price;
        this.$refs.recharge.groupbuy_id = 0;
        this.$refs.pay.buyShow = true;
        this.isgroup = false;
        this.ebookCoupon();
      } else {
        this.$router.push({ name: "login" });
      }
    },
    payrecharge() {
      this.$refs.pay.buyShow = false;
      this.$refs.recharge.rechargeShow = true;
      this.$refs.recharge.order_ticket_id = this.$refs.pay.order_ticket_id;
    },
    returnUp() {
      this.$refs.recharge.rechargeShow = false;
      this.$refs.pay.buyShow = true;
    },
    // 免费阅读
    toreader() {
      this.$router.push({
        name: "ebookreader",
        query: {
          goods_id: this.goods_id,
          chapter_id: this.minChapter,
          currenChapterTitle: 1
        }
      });
    },
    // 数字键盘支付
    payMoney() {
      this.passvalue = "";
      this.showDialog = true;
      // 重置倒计时
      clearInterval(this.clock);
      this.clock = null;
      this.codeData.disabled = false;
      this.codeData.timeMsg = "获取验证码";
      this.addOrderData(this.activeIndex);
    },
    // 新增虚拟订单
    async addOrderData(_index) {
      var tStamp = this.$getTimeStamp();
      var data = {};
      data.timestamp = tStamp;
      data.goods_id = this.goods_id;
      data.version = "1.0";
      if (this.$refs.pay.order_ticket_id)
        data.ticket_id = this.$refs.pay.order_ticket_id;
      if (this.groupbuy_id) data.groupbuy_id = this.couponInfo.groupbuy.id;
      data.sign = this.$getSign(data);
      let res = await ORDER_VIRTUAL_ADD(data);
      if (res.hasOwnProperty("response_code")) {
        this.pay_mobilephone = res.response_data.pay_mobilephone;
        this.pay_money = res.response_data.pay_money;
        this.order_id = res.response_data.order_id;
        this.pay_id = res.response_data.pay_id;

        // 交易支付请求发起
        // this.cashierPayData(this.pay_id);
      } else {
        this.$toast(res.error_message);
      }
    },
    // 订单余额支付手机验证码发送
    getCode() {
      this.$countDown(this.codeData);
      this.sms();
    },
    async sms() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        order_id: this.order_id,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await ORDER_VIRTUAL_ADD_SENDCODE(data);
      if (res.hasOwnProperty("response_code")) {
        // console.log(123, res);
      } else {
        this.$toast(res.error_message);
      }
    },
    keyboardShow() {
      this.showKeyboard = true;
      $(".van-number-keyboard").css("z-index", 10000);
    },
    onInput(key) {
      this.passvalue = (this.passvalue + key).slice(0, 6);
      if (this.passvalue.length == 6) {
        this.payData(this.passvalue);
      }
    },
    onDelete() {
      this.passvalue = this.passvalue.slice(0, this.passvalue.length - 1);
    },
    // 输完验证码获取支付接口
    async payData(__code) {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        pay_id: this.pay_id,
        type: "NORMAL",
        code: __code,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await ORDER_VIRTUAL_ADD_PAY(data);
      if (res.hasOwnProperty("response_code")) {
        this.showDialog = false;
        this.showKeyboard = false;
        clearInterval(this.clock);
        this.clock = null;
        this.codeData.disabled = false;
        this.codeData.timeMsg = "获取验证码";
        location.reload();
        this.$toast("支付成功");
      } else {
        this.$toast(res.error_message);
      }
    },
    // 电子书优惠券
    async ebookCoupon() {
      var tStamp = this.$getTimeStamp();
      var data = {};
      data.timestamp = tStamp;
      data.version = "1.0";
      data.goods_id = this.goods_id;
      // if(this.groupbuy_id) data.groupbuy_id = this.couponInfo.groupbuy.id;
      data.sign = this.$getSign(data);
      let res = await ORDER_VIRTUAL_ADDINFO(data);
      if (res.hasOwnProperty("response_code")) {
        this.$refs.pay.ticketList = res.response_data.ticket_lists;
      } else {
        this.$toast(res.error_message);
      }
    },
    // 选择优惠券改变价格
    chooseCouponChangePrice(price) {
      this.$refs.recharge.price = price;
    },
    // 拼团
    toGoodsGroup() {
      this.groupModel = true;
    },
    // 参团
    addgroup(item) {
      this.$router.push({
        name: "groupdetail",
        query: {
          open_id: item.open_id
        }
      });
    },
    group() {
      if (this.isLogin) {
        // this.groupbuy_id = this.couponInfo.groupbuy.id;
        // this.$refs.pay.price = this.couponInfo.groupbuy.groupbuy_price;
        // this.$refs.recharge.price = this.couponInfo.groupbuy.groupbuy_price;
        // this.$refs.recharge.groupbuy_id = this.couponInfo.groupbuy.id;
        // this.groupModel = false;
        // this.isgroup = true;
        // this.$refs.pay.buyShow = true;
        this.$router.push({
          name: "payaccount",
          query: {
            goods_id: this.goods_id,
            groupbuy_id: this.couponInfo.groupbuy.id
          }
        });
      } else {
        this.$router.push({ name: "login" });
      }
    },
    togroupDetail() {
      this.$router.push({
        name: "groupdetail",
        query: {
          open_id: this.couponInfo.groupbuy.my_open_ids[0]
        }
      });
    },
    // ----------------------------------评论------------------------------------
    commentLoad() {
      this.commentData();
    },
    async commentData() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        page: this.commentPage,
        goods_id: this.goods_id,
        page_size: 10,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await COMMENT(data);

      if (res.hasOwnProperty("response_code")) {
        // 异步更新数据
        var result = res.response_data.result;
        setTimeout(() => {
          for (let i = 0; i < res.response_data.result.length; i++) {
            this.discussData.push(result[i]);
            this.answerData.push(result[i].reply_list);
            this.replyPage.push(1);
            // console.log('评论：', result[i]);
          }
          // 加载状态结束
          this.commentLoading = false;
          this.commentPage++;

          // 数据全部加载完成
          if (this.commentPage > res.response_data.total_page) {
            this.commentFinished = true;
            this.commentPage = 1;
          }
        }, 600);

        // 设置总评论数
        this.totalCount = "评论 (" + res.response_data.total_count + ")";
        // console.log("当前页数组：", this.replyPage);
        // console.log("评论列表：", result);
      } else {
        this.$toast(res.error_message);
      }
    },
    // 回复
    async replyData(comment_id, key) {
      this.timer = 0;
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        comment_pid: comment_id,
        page: this.replyPage[key],
        page_size: 10,
        version: "1.0"
      };
      let res = await COMMENT(data);

      if (res.hasOwnProperty("response_code")) {
        // 异步更新数据
        // var _length = this.answerData[key].length;
        var result = res.response_data.result;
        for (let i = 0; i < result.length; i++) {
          this.answerData[key].push(result[i]);
        }
        if (this.replyPage[key] > res.response_data.total_page) {
          this.replyPage[key] = res.response_data.total_page + 1;
        } else {
          this.replyPage[key]++;
        }
      } else {
        this.$toast(res.error_message);
      }
    },
    // 回复展开更多
    pageChange(comment_id, key) {
      var _this = this;
      if (this.timer) {
        // console.log(111,this.timer);
        this.timer = 0;
      } else {
        this.timer = setTimeout(function() {
          // console.log(222,_this.timer)
          _this.replyData(comment_id, key);
        }, 200);
      }
      // console.log("当前页数组：", this.replyPage, 'key:', key);
    },
    // 关闭评论弹窗
    commentClose() {
      this.commentModel = false;
    },
    /*
     * __type = 'comment'; 新增评论
     * __type = 'reply';   新增回复
     */
    async addComment(__type) {
      var tStamp = this.$getTimeStamp();
      var data = {};
      switch (__type) {
        case "comment":
          data = {
            timestamp: tStamp,
            goods_id: this.goods_id,
            content: this.contentModel,
            version: "1.0"
          };
          break;
        case "reply":
          data = {
            timestamp: tStamp,
            goods_id: this.goods_id,
            comment_pid: this.commentId,
            content: this.contentModel,
            version: "1.0"
          };
          break;
        default:
          break;
      }
      data.sign = this.$getSign(data);
      let res = await COMMENT_ADD(data);
      if (res.hasOwnProperty("response_code")) {
        this.commentPage = 1;
        // 本地存储最新的数据，展示
        this.answerData = [];
        this.discussData = [];
        this.replyPage = [];
        this.contentModel = "";
        this.commentData();
      } else {
        this.$toast(res.error_message);
      }
    },
    punishComment() {
      if (this.contentLength > this.contentTotal) {
        this.$toast("你发布的字数超出，请修改后再发布!");
        return;
      }
      if (this.contentLength == 0) {
        this.$toast("请输入你要发布的内容!");
        return;
      }
      this.commentModel = false;
      // this.discussData = [];
      this.addComment(this.punishType);
    },
    /*
     * __type: 'comment'; 评论，comment_id: null;
     * __type: 'reply'; 回复评论，comment_id: 必填;
     */
    openAnswer(__type, comment_id) {
      // 未登录跳转至登录页
      if (this.isLogin == 0) {
        this.$router.push({ name: "login", params: {} });
        this.$toast("用户未登录!");
        return;
      }
      this.punishType = __type;
      if (__type == "reply") this.commentId = comment_id;
      this.commentModel = true;
    },
    // 编辑评论触发
    inputChange() {
      this.contentLength = this.contentModel.length;
    },
    showCoupon() {
      this.couponModel = true;
    },
    async getCouponList() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        goods_id: this.goods_id,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await GOODS_TICKET_GETS(data);
      if (res.hasOwnProperty("response_code")) {
        // console.log(res);
        this.couponList = res.response_data;
        for (var i = 0; i < this.couponList.length; i++) {
          if (this.couponList[i].state == 3) {
            this.isReceived = true;
          }
        }
      } else {
        this.$toast(res.error_message);
      }
    },
    // 领取优惠券
    receive(item, index) {
      if (this.isLogin == 0) {
        this.$router.push({ name: "login", params: {} });
        this.$toast("用户未登录!");
      } else {
        this.ticketLink(item.ticket_id, index);
      }
    },
    async ticketLink(ticket_id, index) {
      this.requestState = false;
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        version: "1.0",
        ticket_id: ticket_id
      };
      data.sign = this.$getSign(data);
      let res = await TICKET_LINK(data);
      if (res.hasOwnProperty("response_code")) {
        // console.log(res);
        this.$toast("领取成功！");
        this.requestState = true;
        this.couponList = this.couponList.map((value, key) => {
          if (key == index) {
            value.state = 3;
            value.use_stime = res.response_data.use_stime;
            value.use_etime = res.response_data.use_etime;
          }
          return value;
        });
      } else {
        this.$toast(res.error_message);
        this.requestState = true;
      }
    },
    toResult(item, index) {
      this.$router.push({
        name: "couponresult",
        query: {
          ticket_id: item.ticket_id
        }
      });
    },
    reflesh() {
      this.ebookCoupon();
    }
  }
};
</script>
