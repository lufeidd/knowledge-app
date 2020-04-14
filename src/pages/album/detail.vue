<template>
  <div id="albumdetailPage" class="page">
    <div class="nullBox" v-if="onsale == 0">
      <img src="./../../assets/null/product.png" width="100%" />
      <div>该商品已下架~</div>
    </div>

    <div v-if="onsale == 1">
      <!-- 不属于专辑 -->
      <van-row class="actionPatch" v-if="!pid">
        <van-col class="title" span="18">{{ baseData.title }}</van-col>
        <van-col span="6">
          <div
            @click="collectAction(baseData.collect_id, baseData.goods_id)"
            style="text-align:right;"
          >
            <svg class="icon" aria-hidden="true" v-if="baseData.collect_id > 0">
              <use xlink:href="#icon-collect-block" />
            </svg>
            <svg class="icon" aria-hidden="true" v-else>
              <use xlink:href="#icon-collect-line" />
            </svg>
            <span>
              <template v-if="baseData.collect_id > 0">已</template>收藏
            </span>
          </div>
        </van-col>
      </van-row>
      <!-- 属于专辑 -->
      <div class="ratioBox banner">
        <!-- goodsType区分商品类型，音频1/视频2/专辑9/文章6/图书 -->
        <!-- 音频 -->
        <div v-if="baseData.goods_type == 1">
          <div @click="gotoPlayer('external')" class="box layer">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-play-line" />
            </svg>
          </div>
          <!-- 遮罩 -->
          <div class="box">
            <img :src="baseData.pic[0]" />
          </div>
        </div>
        <!-- 视频 -->
        <div v-if="baseData.goods_type == 2">
          <!-- 需要支付 -->
          <div v-if="baseData.is_free == 0 && baseData.is_payed == 0">
            <!-- 需要支付 但 不含试听 -->
            <div @click="gotoPlayer('external')" class="box layer" v-if="baseData.free_path == ''">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-video-play" />
              </svg>
            </div>
            <div class="box">
              <video
                id="myVideo"
                @play="videoPlay"
                :src="baseData.file_path"
                controls
                width="100%"
                height="100%"
                :poster="baseData.pic[0]"
              ></video>
            </div>
          </div>
          <!-- 不需要支付 -->
          <div v-else class="box">
            <video
              id="myVideo"
              @play="videoPlay"
              :src="baseData.file_path"
              controls
              width="100%"
              height="100%"
              :poster="baseData.pic[0]"
            ></video>
          </div>
        </div>
      </div>

      <!-- 专辑 -->
      <div class="albumBox" v-if="pid">
        <router-link :to="{ name: 'album', query: {goods_id: pid}}" class="ratioBox">
          <div class="box">
            <img :src="baseData.pic[0]" />
          </div>
        </router-link>
        <router-link :to="{ name: 'album', query: {goods_id: pid}}" class="issue">
          <div class="title">{{ albumInfo.title }}</div>
          <div class="info">已有{{ albumInfo.collection_num }}人收藏</div>
        </router-link>
        <div
          class="action"
          style="text-align:right;"
          @click="collectAction(albumInfo.collect_id, pid)"
        >
          <van-tag plain type="danger" text-color="#f05654">
            <svg class="icon" aria-hidden="true" v-if="albumInfo.collect_id > 0">
              <use xlink:href="#icon-collect-block" />
            </svg>
            <svg class="icon" aria-hidden="true" v-else>
              <use xlink:href="#icon-collect-line" />
            </svg>
            <span>
              <template v-if="albumInfo.collect_id > 0">已</template>收藏
            </span>
          </van-tag>
        </div>
      </div>
      <!-- 不属于专辑的商品显示关注公号 -->
      <div class="publish" v-else>
        <router-link :to="{name: 'brand', query: {brand_id: brandInfoData.brand_id}}" class="from">
          <div class="icon">
            <img v-lazy="brandInfoData.header_pic" />
          </div>
          <div class="publishInfo">
            <p class="publishName">{{ brandInfoData.name }}</p>
            <p class="focusNumber">已有{{ brandInfoData.fans }}人关注</p>
          </div>
        </router-link>
        <span class="focus add" v-if="brandInfoData.is_followed == 0" @click="focusAction">+关注</span>
        <span class="focus" v-else @click="focusAction">已关注</span>
      </div>

      <!-- 介绍 - 评论 -->
      <van-tabs v-model="tabModel" @click="tabChange">
        <van-tab v-for="(item, key) in tabData" :title="item.title" :key="key">
          <template v-if="activeKey == 0">
            <div
              v-html="baseData.desc"
              style="background-color: #fff;padding: 10px;"
            >{{ baseData.desc }}</div>
          </template>
          <template v-if="activeKey == 1"></template>
        </van-tab>
      </van-tabs>

      <!-- 优惠券 -->
      <van-cell
        title
        is-link
        value
        @click="showCoupon"
        style="margin:5px 0;"
        class="couponCell"
        v-if="Object.keys(couponInfo.ticket).length>0"
      >
        <template slot="title">
          <span style="margin-right:10px;" v-if="isReceived">已领券</span>
          <span style="margin-right:10px;" v-else>领券</span>
          <span class="toMall" v-for="(item,index) in couponInfo.ticket.list" :key="index">{{item}}</span>
        </template>
      </van-cell>

      <!-- 推荐 -->
      <!-- 商品类型, 1=> 音频, 2=> 视频, 3=> 纸书, 4=> 电子书, 5=> 文创用品, 6=> 图文, 9=> 专辑 -->
      <template v-if="recommendList.length > 0">
        <van-cell title="听了本节目的也在听" value />
        <van-row gutter="20" class="booklist">
          <van-col span="8" v-for="(item, key) in recommendList" :key="key">
            <div class="ratioBox" @click="gotoLink(item)">
              <div class="box">
                <img :src="item.pic[0]" />
              </div>
            </div>
            <div class="title" style="height: 40px;">{{ item.title }}</div>
          </van-col>
        </van-row>
      </template>

      <!-- 评论 -->
      <div id="comment" class="commentBox">
        <div id="commentTitle">
          <van-cell :title="totalCount" is-link value="我要评论" @click="openAnswer('comment', null)" />
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

      <CopyRight></CopyRight>
      <div v-if="baseData.is_free == 0 && baseData.is_payed == 0" style="height: 60px;"></div>
      <!-- <div v-if="myAudioData.src" style="height: 60px;"></div> -->
      <div v-if="this.isIphx" style="height: 34px;"></div>

      <!-- 试听 - 购买 -->
      <van-goods-action
        :class="{ iphx: this.isIphx }"
        v-if="baseData.is_free == 0 && baseData.is_payed == 0 && (couponInfo.groupbuy == undefined || Object.keys(couponInfo.groupbuy).length == 0)"
      >
        <van-goods-action-mini-btn
          icon="play-circle-o"
          text="试听"
          @click="gotoPlayer('preListen')"
          v-if="baseData.free_path != '' && baseData.goods_type == 1"
        />
        <van-goods-action-mini-btn
          icon="play-circle-o"
          text="试听"
          @click="gotoPlayer('video')"
          v-if="baseData.free_path != '' && baseData.goods_type == 2"
        />
        <van-goods-action-big-btn
          primary
          :text="'¥ '+baseData.price.toFixed(2) + ' 购买'"
          @click="buyAction(goodsId)"
        />
      </van-goods-action>
      <van-goods-action
        :class="{ iphx: this.isIphx }"
        v-if="baseData.is_free == 0 && baseData.is_payed == 0 && couponInfo.groupbuy && Object.keys(couponInfo.groupbuy).length > 0"
      >
        <van-goods-action-mini-btn
          icon="play-circle-o"
          text="试听"
          @click="gotoPlayer('preListen')"
          v-if="baseData.free_path != '' && baseData.goods_type == 1"
        />
        <van-goods-action-mini-btn
          icon="play-circle-o"
          text="试听"
          @click="gotoPlayer('video')"
          v-if="baseData.free_path != '' && baseData.goods_type == 2"
        />
        <van-goods-action-big-btn :text="'¥ '+baseData.price + ' 购买'" @click="buyAction(goodsId)" />
        <van-goods-action-big-btn
          primary
          :text="'¥ '+couponInfo.groupbuy.groupbuy_price + ' 拼团'"
          @click="buyAction(goodsId)"
        />
      </van-goods-action>

      <!-- 音频缩略 -->
      <miniAudio
        :class="{isShow: myAudioData.src}"
        :audioData="myAudioData"
        :rank="rankType"
        :loginStatus="isLogin"
        :showBuyButton="showBuyButton"
        ref="control"
        @setType="typeAction"
        @setMiniAudio="miniAudioData"
        @setProgress="audioProgressData"
        @showAudioList="audioListShow"
        @linkToPlayer="gotoPlayer"
        @getAllProgram="getAllProgramData"
      ></miniAudio>

      <!-- 播放列表 -->
      <audioList
        :goodsId="goodsId"
        :albumInfo="baseData"
        :goodsNo="activeGoodNo"
        :audioStatus="audioPlaying"
        @audioChange="audioAction"
        ref="controlList"
      ></audioList>

      <!-- 评论 -->
      <van-popup v-model="commentModel" position="bottom">
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
      <!-- 优惠券 -->
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
              disabled
              v-if="couponInfo.groupbuy.can_open_nums == 0"
            >一键开团</van-button>
            <van-button type="danger" size="small" round @click="group" v-else>一键开团</van-button>
          </div>
        </div>
      </van-popup>
    </div>
    <EazyNav type="brand" ref="nav" :isShow="true"></EazyNav>
  </div>
</template>

<style src="@/style/scss/pages/album/detail.scss" lang="scss"></style>
<style lang="scss">
#albumdetailPage {
  .van-button {
    border-radius: 0;
  }
  .couponCell .van-cell__value {
    display: none;
  }
  .van-goods-action {
    .van-goods-action-mini-btn {
      border-color: #d2d2d2;
      border-width: 1px 0 0 0;
      border-style: solid;
    }
    .van-button--warning {
      background-color: #fff;
      color: $redLight;
      border-color: #d2d2d2;
      border-width: 1px 0 0 1px;
    }
  }
}
</style>

<script>
import miniAudio from "./../../components/miniAudio";
import audioList from "./../../pages/album/list";
import { ALBUM, ALBUM_DETAIL } from "../../apis/album.js";
import { GOODS_TICKET_GETS, TICKET_LINK } from "../../apis/coupon.js";
import {
  COLLECT_ADD,
  COLLECT_CANCEL,
  FOCUS_ADD,
  FOCUS_CANCEL,
  COMMENT,
  COMMENT_ADD,
  RECOMMEND
} from "../../apis/public.js";

export default {
  components: {
    miniAudio,
    audioList
  },
  data() {
    return {
      showBuyButton: true,
      activeKey: 0,
      onsale: null,
      /*
       * ----------------------------------节目----------------------------------
       */
      showHistory: true,
      programList: [],
      programPage: 1,
      // 分页
      programLoading: false,
      programFinished: false,
      // 节目总数
      programTotalCount: 0,
      // 迷你音频当前节目信息
      myAudioData: {},
      // 存放当前播放音频key值
      activeGoodNo: null,
      // 存放当前播放器播放状态
      audioPlaying: false,
      // 排序
      rankType: 0, // 默认0倒序, 1正序
      // 记录节目播放进度
      progressList: [],
      /*
       * ----------------------------------介绍----------------------------------
       */
      // 专辑id
      pid: null,
      // 商品id
      goodsId: null,
      // 账号信息，是否登录
      isLogin: null,
      // 专辑基础信息
      albumInfo: {},
      // 基础信息
      baseData: {
        title: "",
        sub_title: "",
        pic: [],
        goods_type: null,
        collection_num: 0,
        collect_id: null
      },
      // 所属媒体信息
      brandInfoData: {
        header_pic: "",
        name: "",
        fans: 0,
        is_followed: null
      },
      // 选项卡
      tabData: [
        {
          title: "介绍"
        },
        {
          title: "评论"
        }
      ],
      tabModel: 2,
      // 评论
      discussData: [],
      commentPage: 1,
      totalCount: "评论 (" + 0 + ")",
      // 发布评论
      commentModel: false,
      contentModel: "",
      contentTotal: 30,
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
      // 推荐
      recommendList: [],
      // 优惠券信息
      couponInfo: null,
      couponList: [],
      couponModel: false,
      isReceived: false,
      requestState: true,
      remain_time: []
    };
  },
  beforeDestroy() {
    // $(window).off("scroll");
  },
  mounted() {
    // 跳转评论锚点
    // $(window).on("scroll", function() {
    //   if ($(window).scrollTop() >= $("#comment").offset().top) {
    //     $("#commentTitle").css({
    //       position: "fixed",
    //       "border-bottom-width": "1px"
    //     });
    //   } else {
    //     $("#commentTitle").css({
    //       position: "relative",
    //       "border-bottom-width": 0
    //     });
    //   }
    // });

    this.pid = parseInt(this.$route.query.pid);
    this.goodsId = parseInt(this.$route.query.goods_id);
    this.activeGoodNo = parseInt(this.$route.query.goods_no);

    // 基础信息
    this.albumData();
    // 推荐
    this.recommendData();
    this.getCouponList();
  },
  updated() {
    // console.log(7474,$('.van-goods-action-big-btn .van-button__text'))
    if (this.baseData.single_activity_id) {
      $(".van-goods-action-big-btn .van-button__text").html(
        '<div style="line-height:1;font-size:16px;">限时促销价￥' +
          this.baseData.price +
          '</div><div style="line-height:1;font-size:12px;margin-top:5px;"><del style="color:#e1e1e1;">原价￥' +
          this.baseData.market_price +
          "</del> 购买专辑</div>"
      );
    }
    if (
      this.couponInfo.groupbuy &&
      Object.keys(this.couponInfo.groupbuy).length > 0
    ) {
      $(".van-goods-action-big-btn.van-button--warning .van-button__text").html(
        '<div style="line-height:1;font-size:15px;">￥' +
          this.baseData.price +
          '</div><div style="line-height:1;font-size:15px;margin-top:5px;"> 直接购买</div>'
      );
      $(".van-goods-action-big-btn.van-button--danger .van-button__text").html(
        '<div style="line-height:1;font-size:15px;">￥' +
          this.couponInfo.groupbuy.groupbuy_price +
          '</div><div style="line-height:1;font-size:15px;margin-top:5px;"> ' +
          this.couponInfo.groupbuy.groupbuy_num +
          "人拼团价</div>"
      );
    }
  },
  methods: {
    // 判断视频播放是否收费
    videoPlay() {
      // 含有试听视频，播放该试听视频
      if (this.baseData.free_path != "") {
        this.$refs.control.pauseAudio();
        return;
      }
      // 需要收费
      if (this.baseData.is_free == 0 && this.baseData.is_payed == 0) {
        var _goodsId = null;
        if (this.baseData.sale_style == 1) {
          _goodsId = parseInt(this.$route.query.pid);
        } else {
          _goodsId = parseInt(this.$route.query.goods_id);
        }
        this.$router.push({
          name: "payaccount",
          query: { goods_id: _goodsId }
        });
        return;
      } else {
        this.$refs.control.pauseAudio();
      }
    },
    // --------------------------------迷你缩略音频----------------------------------
    // 点击播放，子组件关联父页面 - 切换miniAudio组件播放状态
    typeAction(__type) {
      /*
       * __type == true; 播放
       * __type == false; 暂停
       */
      // 关联节目列表播放状态
      this.myAudioData.type = __type;
      this.audioPlaying = !__type;
      // console.log('节目列表:',this.programList);
    },
    // 播放/暂停音频
    audioAction(item) {
      // 未支付
      if (item.goods_id != null && item.is_payed == 0 && item.is_free == 0) {
        var _goodsId = null;
        if (item.sale_style == 1) {
          _goodsId = parseInt(this.$route.query.pid);
        } else {
          _goodsId = item.goods_id;
        }
        this.$router.push({
          name: "payaccount",
          query: { goods_id: _goodsId }
        });
        return;
      }

      var goods_no = item.goods_no;

      let __goodsNo = item.goods_no;
      let __pid = JSON.parse(localStorage.getItem("miniAudio"))[1];
      let __pic = item.pic;
      let __src = item.file_path;
      let __duration = item.duration;
      // 获取当前节目播放进度
      let __currentTime = 0;
      // let __currentTime = this.getAudioProgress(item);
      let __program = item.title;
      let __album = JSON.parse(localStorage.getItem("miniAudio"))[7];
      let __goodsId = item.goodsId;

      // 存放当前音频信息
      for (let i = 0; i < this.programList.length; i++) {
        if (this.programList[i].goods_no == goods_no) {
          __goodsNo = this.programList[i].goods_no;
          __src = this.programList[i].file_path;
          __program = this.programList[i].title;
          __duration = this.programList[i].duration;
        }
      }

      // 判断是否点击当前或者第一次点击
      if (this.activeGoodNo == goods_no || this.activeGoodNo == null) {
        this.audioPlaying = !this.audioPlaying;
      } else {
        this.audioPlaying = true;
      }

      // 父页面关联子组件
      setTimeout(() => {
        if (this.audioPlaying) {
          // this.$refs.control.pauseAudio();
          this.$refs.control.playAudio(__currentTime);
        } else {
          this.$refs.control.pauseAudio();
        }
      }, 600);

      // 管理子组件播放状态
      this.activeGoodNo = goods_no;

      var info = [
        __goodsNo,
        __pid,
        __pic,
        __src,
        __duration,
        __currentTime,
        __program,
        __album,
        __goodsId
      ];
      this.miniAudioData(info);

      // 解决子组件数据实时刷新问题
      this.$refs.control.audioData.type = !this.audioPlaying;
      // console.log(info)
    },
    // 获取当前节目播放进度
    getAudioProgress(item) {
      var pid = this.baseData.goods_id;
      var goods_no = item.goods_no;
      var goods_id = item.goods_id;
      var result = JSON.parse(localStorage.getItem("audioProgress"));
      // 默认从0播放,如果localStorage有播放进度记录则从记录处播放
      var __currentTime = 0;

      if (result != null && result.length > 0) {
        // 遍历localStorage中记录进度的数组，获取当前节目当前进度
        for (let i = 0; i < result.length; i++) {
          if (goods_id == result[i].goods_id && pid == result[i].pid) {
            __currentTime = result[i].progress;
          }
        }
      }

      // 如果当前节目有播放记录，跳到当前记录位置继续播放
      return __currentTime;
    },
    // 将当前音频播放信息存放到localStorage: miniAudio
    miniAudioData(info) {
      /*
       * __goodsNo节目编号
       * __pid当前节目对应专辑id，单个节目时pid为0
       * __pic专辑封面
       * __src音频地址
       * __duration音频时长，单位s
       * __currentTime音频当前播放位置，单位s
       * __program节目标题
       * __album专辑标题
       * __goodsId商品id
       * __albumPic专辑图片，无专辑为null
       */
      if (info != null && info.length != 0) {
        let __goodsNo = info[0];
        let __pid = info[1];
        let __pic = info[2];
        let __src = info[3];
        let __duration = info[4];
        let __currentTime = info[5];
        let __program = info[6];
        let __album = info[7];
        let __goodsId = info[8];
        let __albumPic = info[9];

        // 设置音频信息
        this.$set(this.myAudioData, "goodsNo", __goodsNo);
        this.$set(this.myAudioData, "pid", __pid);
        this.$set(this.myAudioData, "pic", __pic);
        this.$set(this.myAudioData, "src", __src);
        this.$set(this.myAudioData, "duration", __duration);
        this.$set(this.myAudioData, "currentTime", __currentTime);
        this.$set(this.myAudioData, "program", __program);
        this.$set(this.myAudioData, "album", __album);
        this.$set(this.myAudioData, "goodsId", __goodsId);
        this.$set(this.myAudioData, "albumPic", __albumPic);

        // localStorage存储
        // info = JSON.parse(localStorage.getItem('miniAudio'));
        localStorage.setItem("miniAudio", JSON.stringify(info));

        // 当前专辑与localStorage一致时,关联播放列表当前播放状态
        if (info[8] == this.goodsId) this.activeGoodNo = info[0];

        // console.log('存储迷你音频信息:', info);

        // 解决父页面子组件实时刷新问题
        setTimeout(() => {
          if (this.$refs.control && this.myAudioData) {
            this.$refs.control.audioData.pic = __pic;
            this.$refs.control.audioData.src = __src;
            this.$refs.control.audioData.currentTime = __currentTime;
            this.$refs.control.audioData.duration = __duration;
            this.$refs.control.audioData.program = __program;
            this.$refs.control.audioData.album = __album;
            this.$refs.control.audioData.albumPic = __albumPic;
          }

          // this.$refs.control.audiobindtoslider(info[5]);
          // 设置当前播放进度
          // this.$refs.control.audioData.sliderValue = (info[5] / audio.duration) * 100;
          // this.$refs.control.audioSliderChange();
        }, 600);

        if (!__src) {
          $("#miniAudio").css("display", "none");
        } else {
          $("#miniAudio").css("display", "block");
        }
      }
    },
    // 将当前专辑节目列表播放进度信息存放到localStorage
    audioProgressData(result) {
      /*
       * __goodsId商品id
       * __goodsNo节目编号
       * __progress节目当前播放进度
       * __duration节目时长，单位s
       */

      // localStorage存储
      localStorage.setItem("audioProgress", JSON.stringify(result));

      // console.log('result:', this.progressList);
    },
    audioListShow(__type) {
      this.$refs.controlList.popupModel = true;
      // 关联list.vue播放列表
      this.$refs.controlList.goodsNo = this.activeGoodNo;
      this.$refs.controlList.goodsId = this.goodsId;
    },
    // 跳转到音乐播放器
    gotoPlayer(__type) {
      var queryTmp = {};
      if (this.pid != NaN) queryTmp.pid = this.pid;
      queryTmp.goods_id = this.goodsId;
      queryTmp.ad = parseInt(this.$route.query.ad) == 1 ? 1 : 0;
      if (this.$route.query.goods_no != "undefined")
        queryTmp.goods_no = this.$route.query.goods_no;

      // 点击迷你播放音频
      if (__type == "mini") {
        this.$router.push({ name: "player", query: queryTmp });
        return;
      }
      // 视频试听
      if (__type == "video") {
        document.getElementById("myVideo").play();
        return;
      }

      var info = JSON.parse(localStorage.getItem("miniAudio"));

      var _info0 = parseInt(this.$route.query.goods_no);
      var _info1 = parseInt(this.$route.query.pid);
      var _info2 = this.baseData.pic[0];
      var _info3 = this.baseData.file_path;
      var _info4 = this.baseData.duration_str;
      var _info5 = 0;
      var _info6 = this.baseData.title;
      var _info7 = this.albumInfo.title;
      var _info8 = parseInt(this.$route.query.goods_id);
      var _info9 = this.albumInfo.pic;

      // 试听
      if (__type == "preListen") {
        _info3 = this.baseData.free_path;
      }

      if (__type == "external") {
        // console.log(this.baseData)
        // 未支付
        if (
          this.baseData.goods_id != null &&
          this.baseData.is_free == 0 &&
          this.baseData.is_payed == 0
        ) {
          var _goodsId = null;
          if (this.baseData.sale_style == 1) {
            _goodsId = parseInt(this.$route.query.pid);
          } else {
            _goodsId = parseInt(this.$route.query.goods_id);
          }
          this.$router.push({
            name: "payaccount",
            query: { goods_id: _goodsId }
          });
          return;
        }

        _info3 = this.baseData.file_path;
      }

      if (info == null) {
        info = [];
      }
      // 更新迷你缩放音频播放信息
      info[0] = _info0;
      info[1] = _info1;
      info[2] = _info2;
      info[3] = _info3;
      info[4] = _info4;
      info[5] = _info5;
      info[6] = _info6;
      info[7] = _info7;
      info[8] = _info8;
      info[9] = _info9;

      // localStorage存储
      localStorage.setItem("miniAudio", JSON.stringify(info));
      // 外链至音乐播放器，设置info

      this.$router.push({ name: "player", query: queryTmp });
    },
    // 当前节目播放结束，获取当前播放节目的专辑下所有节目（不分页）
    getAllProgramData(info) {
      this.allProgramData(info, "end");
    },
    async allProgramData(info, actionType) {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        goods_id: info[8],
        goods_no: this.rankType,
        page_size: 1000000000000000,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await ALBUM_DETAIL(data);
      // 存储当前节目的下一项
      var next;

      if (res.hasOwnProperty("response_code")) {
        var type1 = 0;
        var type2 = 0;
        var type3 = 0;
        // 异步更新数据
        var result = res.response_data.result;

        for (let i = 0; i < res.response_data.result.length; i++) {
          var type = result[i].goods_type;
          // console.log('type:', type);
          if (type == 1) type1 = 1;
          if (type == 2) type2 = 1;
          if (type == 6) type3 = 1;
          // 不包含文章类型
          if (result[i].goods_type != 6) {
            this.allProgramList.push(result[i]);
          }
          if (result[i].goods_no == info[0]) {
            next = i + 1;
          }
        }

        // 专辑is_payed:0未支付；1已支付，未支付不能自动播放
        if (
          eval(type1 + type2 + type3) > 1 ||
          (this.baseData.is_free == 0 && this.baseData.is_payed == 0)
        ) {
          this.autoPlay = false;
        } else {
          this.autoPlay = true;
        }

        if (this.allProgramList && this.allProgramList.length > 0) {
          var count = this.allProgramList.length;
          next = next > count - 1 ? 0 : next;
        } else {
          next = 0;
        }

        // 当点击全部播放，从第一条开始播放
        if (actionType == "all") next = 0;
      } else {
        this.$toast(res.error_message);
      }

      if (this.autoPlay) {
        // 单一类型，自动播放
        this.updateLocalStorage(this.allProgramList[next]);
        // console.log("当前播放的下一项：", this.allProgramList[next]);
        // console.log("单一类型，自动播放");
      } else {
        // 含多种类型，不自动播放
        this.$toast("含多种类型或者专辑未支付，不自动播放");
        this.$refs.control.pauseAudio();
      }
    },
    // 读取localStorage：miniAudio音频缩略播放器数据
    getMiniAudioData() {
      // 设置迷你音频信息
      var info = JSON.parse(localStorage.getItem("miniAudio"));

      if (info != null && info.length > 0) {
        // if (info[0] != "") this.activeGoodNo = info[0];
        // 将当前音频播放信息存放到localStorage: miniAudio
        this.miniAudioData(info);

        // 解决子组件数据实时刷新问题
        if (this.$refs.control)
          this.$refs.control.audioData.type = !this.audioPlaying;
        // 设置当前播放进度
        setTimeout(() => {
          var audio = document.getElementById("myMiniAudio");
          // currentTime关联slider进度
          if (audio && info[5] != null && info[5] != "")
            this.$refs.control.audioData.sliderValue =
              (info[5] / audio.duration) * 100;
          // 当无播放记录的时候
          if (info[4] != null && info[4] != "")
            this.$refs.control.audioSliderChange();
        }, 600);
      }
    },
    // ----------------------------------介绍------------------------------------
    // 获取专辑/商品接口信息
    async albumData() {
      var tStamp = this.$getTimeStamp();
      let data = {
        ad: parseInt(this.$route.query.ad) == 1 ? 1 : 0,
        timestamp: tStamp,
        pid: this.pid ? this.pid : null,
        goods_id: this.goodsId,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await ALBUM(data);
      // console.log(res);

      if (res.hasOwnProperty("response_code")) {
        //专辑基础信息
        this.albumInfo = res.response_data.album_info;
        // 当前商品基础信息
        this.baseData = res.response_data.base;
        // 公号信息
        this.brandInfoData = res.response_data.brand_info;
        // 账号信息，是否登录
        this.isLogin = res.response_data.user_info.is_login;
        document.title = "节目详情-" + res.response_data.base.title;
        // 优惠券
        this.couponInfo = res.response_data.activity;
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
              date: "",
            });
            this.$timeCountDown(this.remain_time[i]);
          }
        }

        // console.log(7474,$('.van-goods-action-big-btn .van-button__text'))

        // 所属媒体信息
        // this.brandInfoData = res.response_data.brand_info;

        // 获取页面分享信息
        // if (this.isWxLogin) this.wxShareData();
        var _pageName = "goods/detail";
        var _params = JSON.stringify({
          goods_id: this.$route.query.goods_id,
          album_id: this.$route.query.pid
        });
        if (this.isWxLogin) this.$getWxShareData(_pageName, _params);

        // 是否显示底部购买按钮
        this.showBuyButton = !(
          this.baseData.is_free == 0 && this.baseData.is_payed == 0
        );

        this.onsale = 1;
      } else {
        if (res.hasOwnProperty("error_code") && res.error_code == 401) {
          // 上下架状态, 1=> 在架, 0=> 下架
          this.onsale = 0;
        }
        this.$toast(res.error_message);
      }

      // 读取localStorage音频缩略播放器数据
      this.getMiniAudioData();
    },
    // 获取收藏接口信息
    collectAction(__collectId, __goodsId) {
      if (__collectId > 0) {
        this.collectData("cancel", __goodsId);
      } else {
        this.collectData("collect", __goodsId);
      }
    },
    async collectData(__status, __goodsId) {
      var data = {};
      var tStamp = this.$getTimeStamp();
      var res;
      // 出错提示
      switch (__status) {
        case "collect":
          data = {
            timestamp: tStamp,
            type: this.baseData.goods_type,
            target: __goodsId,
            version: "1.0"
          };
          data.sign = this.$getSign(data);
          res = await COLLECT_ADD(data);
          if (res.hasOwnProperty("response_code")) {
            // 专辑
            if (this.pid) {
              this.albumInfo.collect_id = 1;
            } else {
              this.baseData.collect_id = 1;
            }
            this.albumInfo.collection_num++;
          } else {
            this.$toast(res.error_message);
            if (res.hasOwnProperty("error_code") && res.error_code == 100) {
              this.$router.push({ name: "login", params: {} });
            }
          }
          // this.$toast("已收藏~");
          break;
        case "cancel":
          data = {
            timestamp: tStamp,
            goods_id: __goodsId,
            version: "1.0"
          };
          data.sign = this.$getSign(data);
          res = await COLLECT_CANCEL(data);

          if (res.hasOwnProperty("response_code")) {
            this.albumInfo.collection_num--;
            // 专辑
            if (this.pid) {
              this.albumInfo.collect_id = 0;
            } else {
              this.baseData.collect_id = 0;
            }
            this.$toast("已取消收藏~");
          } else {
            this.$toast(res.error_message);
            if (res.hasOwnProperty("error_code") && res.error_code == 100) {
              this.$router.push({ name: "login", params: {} });
            }
          }
          break;
      }
    },
    // 获取关注接口信息
    async focusData(__type) {
      var tStamp = this.$getTimeStamp();
      var data = {};
      var res;
      switch (__type) {
        case "focus":
          data = {
            timestamp: tStamp,
            brand_id: this.baseData.brand_id,
            version: "1.0"
          };
          data.sign = this.$getSign(data);
          res = await FOCUS_ADD(data);
          if (res.hasOwnProperty("response_code")) {
            this.brandInfoData.is_followed = 1;
            this.brandInfoData.fans++;
            // this.$toast('已关注~');
          } else {
            this.$toast(res.error_message);
            if (res.hasOwnProperty("error_code") && res.error_code == 100) {
              this.$router.push({ name: "login", params: {} });
            }
          }
          break;
        case "cancel":
          data = {
            timestamp: tStamp,
            brand_id: this.baseData.brand_id,
            version: "1.0"
          };
          data.sign = this.$getSign(data);
          res = await FOCUS_CANCEL(data);
          if (res.hasOwnProperty("response_code")) {
            this.brandInfoData.is_followed = 0;
            this.brandInfoData.fans--;
            this.$toast("已取消关注~");
          } else {
            this.$toast(res.error_message);
            if (res.hasOwnProperty("error_code") && res.error_code == 100) {
              this.$router.push({ name: "login", params: {} });
            }
          }
          break;
      }
    },
    focusAction() {
      if (this.brandInfoData.is_followed > 0) {
        this.focusData("cancel");
      } else {
        this.focusData("focus");
      }
    },
    // 拼团
    openGroup() {
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
      var _goodsId = this.baseData.goods_id;
      if (this.$refs.nav.is_Login) {
        if (this.baseData.sale_style == 1) {
          _goodsId = this.pid;
        }
        this.$router.push({
          name: "payaccount",
          query: {
            goods_id: _goodsId,
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
        goods_id: parseInt(this.$route.query.goods_id),
        timestamp: tStamp,
        page: this.commentPage,
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
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        comment_pid: comment_id,
        page: this.replyPage[key],
        page_size: 10,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await COMMENT(data);

      if (res.hasOwnProperty("response_code")) {
        // 异步更新数据
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
      this.replyData(comment_id, key);
      // this.replyPage[key] = 2;
      console.log("当前页数组：", this.replyPage, "key:", key);
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
            goods_id: this.baseData.goods_id,
            content: this.contentModel,
            goods_pid: this.$route.query.pid?Number(this.$route.query.pid):0,
            version: "1.0"
          };
          break;
        case "reply":
          data = {
            timestamp: tStamp,
            goods_id: this.baseData.goods_id,
            comment_pid: this.commentId,
            content: this.contentModel,
            goods_pid: this.$route.query.pid?Number(this.$route.query.pid):0,
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
    // 评论锚点
    tabChange(index, title) {
      this.activeKey = index;
      // this.$toast(index);
      if (index == 1 && $("#comment").length == 1)
        $(window).scrollTop($("#comment").offset().top);
    },
    // 购买
    buyAction(goodsId) {
      var _goodsId = goodsId;
      if (this.$refs.nav.is_Login) {
        // 根据专辑购买
        if (this.baseData.sale_style == 1) {
          _goodsId = this.pid;
        }
        if (goodsId != null)
          this.$router.push({
            name: "payaccount",
            query: { goods_id: _goodsId }
          });
      } else {
        this.$router.push({ name: "login" });
      }
    },
    // --------------------------------相似----------------------------------
    // 推荐
    async recommendData() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        goods_id: this.goodsId,
        page: 1,
        page_size: 6,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await RECOMMEND(data);

      if (res.hasOwnProperty("response_code")) {
        // 异步更新数据
        var result = res.response_data.result;

        for (let i = 0; i < res.response_data.result.length; i++) {
          this.recommendList.push(result[i]);
        }

        // console.log(this.recommendList)
      } else {
        this.$toast(res.error_message);
      }
    },
    // 点击相似推荐
    gotoLink(item) {
      var goodsType = item.goods_type;

      // 音频/视频
      if (goodsType == 1 || goodsType == 2) {
        this.pid = null;
        this.activeGoodNo = null;

        this.$router.replace({
          name: "albumdetail",
          query: { goods_id: item.goods_id }
        });
        location.reload();
      } else if (goodsType == 6) {
        // 文章
        this.$router.push({
          name: "article",
          query: { goods_id: item.goods_id }
        });
      } else if (goodsType == 9) {
        // 专辑
        this.$router.push({
          name: "album",
          query: { goods_id: item.goods_id }
        });
      } else if (goodsType == 4) {
        //电子书
        this.$router.push({
          name: "ebookdetail",
          query: { goods_id: item.goods_id }
        });
      }
    },
    // 优惠券
    showCoupon() {
      this.couponModel = true;
    },
    closePopup() {
      this.couponModel = false;
    },
    async getCouponList() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        goods_id: this.pid ? this.pid : this.goodsId,
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
        this.ticketLink(item.ticket_id,index);
      }
    },
    async ticketLink(ticket_id,index) {
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
    }
  }
};
</script>

