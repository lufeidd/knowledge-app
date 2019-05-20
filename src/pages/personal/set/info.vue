<template>
  <div id="infoPage">
    <!-- 头像 -->
    <div class="listBox" @click="showAction('pictrue')" style="margin-top: 5px;">
      <div class="center">
        <div class="title">头像</div>
      </div>
      <div class="left">
        <div class="ratioBox">
          <div class="box">
            <img :src="infoList.header_pic">
          </div>
        </div>
      </div>
      <div class="right">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-next-line"></use>
        </svg>
      </div>

      <input id="files" type="file" accept="image/*" @change="picChange">
    </div>

    <van-cell title="账号" :value="infoList.mobile"/>
    <!-- 昵称 -->
    <van-row style="background-color: #fff;padding: 10px 15px;border-bottom: 1px solid #f5f5f5;">
      <van-col span="12">昵称</van-col>
      <van-col span="12">
        <input
          type="text"
          placeholder="还是空的，快去写吧~"
          v-model="infoList.nickname"
          style="text-align: right;font-size: 13px;color: #999;height: 100%;width: 100%;border: none;"
        >
      </van-col>
    </van-row>

    <!-- 生日 -->
    <van-cell
      title="生日"
      is-link
      :value="infoList.birthday ? infoList.birthday : '还是空的，快去写吧~'"
      @click="showAction('birthday')"
    />

    <!-- 性别 -->
    <van-cell title="性别" is-link :value="infoList.sex == 1 ? '男' : '女'" @click="showAction('sex')"/>

    <!-- 头像裁切，异步组件 -->
    <!-- 性别 -->
    <van-actionsheet
      v-model="sexModel"
      :actions="sexActions"
      cancel-text="取消"
      @select="sexSelect"
      @cancel="sexModel=false"
    />
    <!-- 生日 -->
    <van-popup v-model="birthdayModel" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatter"
        @confirm="birthdayConfirm"
        @change="dateChange"
        @cancel="birthdayModel=false"
        title="请选择时间"
        confirm-button-text="完成"
      />
    </van-popup>

    <div style="margin-top: 5px;">
      <van-button size="large" @click="save">保存</van-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.van-button {
  border-radius: 0;
}
#infoPage {
  min-height: 100%;
  background-color: $greyLight;
  & .listBox {
    padding: 10px 15px;
    background-color: $white;
    border-bottom: 1px $greyLight solid;
    position: relative;
    @include displayFlex(flex, flex-start, center);

    & input[type="file"] {
      @include fullBox;
      opacity: 0;
    }

    & .left {
      @include textOverflow;
      @include clearfix;
      @include font(null, $fontSize - 1, #999);
      flex-grow: 1;
      text-align: right;

      & .ratioBox {
        @include ratioBox(28px, 28px, 1px #e7e7e7 solid, contain, null, null);
        float: right;
        border-radius: 28px;
        overflow: hidden;
        position: relative;

        & .box {
          @include position(absolute, "tl", 0, 0, 100%, 100%, null);
          @include displayFlex(flex, center, center);

          & img {
            max-width: 100%;
            max-height: 100%;
          }
        }
      }
    }

    & .center {
      line-height: 1.8;
      flex-shrink: 0;

      & .title {
        @include font(null, $fontSize + 1, #333);
        @include textOverflow;
      }
    }

    & .right {
      @include flexBasis(15px);
      flex-shrink: 0;
      text-align: right;

      & .icon {
        width: 14px;
        height: 14px;
        color: #999;
      }
    }
  }
}
</style>

<script>
//  引入接口
import { USER_INFO, USER_INFO_EDIT } from "../../../apis/user.js";

export default {
  data() {
    return {
      // 账户信息
      infoList: {
        header_pic: "",
        mobile: "",
        nickname: "",
        birthday: "",
        sex: 1
      },
      // 生日
      birthdayModel: false,
      minDate: new Date(1919, 1, 1),
      maxDate: new Date(),
      currentDate: new Date(),
      formatter(type, value) {
        if (type === "year") {
          return `${value}年`;
        } else if (type === "month") {
          return `${value}月`;
        } else {
          return `${value}日`;
        }
        return value;
      },
      // 性别
      sexModel: false,
      sexActions: [
        {
          name: "男"
        },
        {
          name: "女"
        }
      ]
    };
  },
  mounted() {
    this.getInfoData();
  },
  methods: {
    // 头像
    showAction(type) {
      if (type) {
        switch (type) {
          // 头像
          case "picture":
            break;
          // 生日
          case "birthday":
            this.birthdayModel = true;
            break;
          // 性别
          case "sex":
            this.sexModel = true;
            break;
        }
      }
    },
    picChange() {
      var self = this;
      //获取input file的files文件数组;
      //$('#files')获取的是jquery对象，.get(0)转为原生对象;
      //这边默认只能选一个，但是存放形式仍然是数组，所以取第一个元素使用[0];
      var file = $("#files").get(0).files[0];
      //创建用来读取此文件的对象
      var reader = new FileReader();
      //使用该对象读取file文件
      reader.readAsDataURL(file);
      //读取文件成功后执行的方法函数
      var data = "";
      reader.onload = function(e) {
        //读取成功后返回的一个参数e，整个的一个进度事件
        // console.log(e);
        //选择所要显示图片的img，要赋值给img的src就是e中target下result里面
        //的base64编码格式的地址
        data = e.target.result;

        // const AsyncComponent = () => ({
        //   // 需要加载的组件 (应该是一个 `Promise` 对象)
        //   component: import("./cropper.vue"),
        //   // 异步组件加载时使用的组件
        //   loading: LoadingComponent,
        //   // 加载失败时使用的组件
        //   error: ErrorComponent,
        //   // 展示加载时组件的延时时间。默认值是 200 (毫秒)
        //   delay: 200,
        //   // 如果提供了超时时间且组件加载也超时了，
        //   // 则使用加载失败时使用的组件。默认值是：`Infinity`
        //   timeout: 3000
        // });

        // $(".cropper-box-canvas img[data-v-ebaf968c]").get(0).src = data;

        // 图片裁切后加载组件
        // this.cropperShow = true;

        // 跳转到裁切页面
        self.$router.push({ name: "cropper", params: { data: data } });
        // console.log(data);
      };
    },
    // 获取账号接口信息
    async getInfoData() {
      let data = {
        version: "1.0"
      };
      let res = await USER_INFO(data);
      // console.log(res.response_data);
      if (res.hasOwnProperty("response_code")) {
        this.$set(this.infoList, "header_pic", res.response_data.header_pic);
        this.$set(this.infoList, "mobile", res.response_data.mobile);
        this.$set(this.infoList, "nickname", res.response_data.nickname);
        this.$set(this.infoList, "birthday", res.response_data.birthday);
        this.$set(this.infoList, "sex", res.response_data.sex);
        // 裁切后的图片
        if (this.$route.params.img)
          this.$set(this.infoList, "header_pic", this.$route.params.img);
        console.log(789, this.infoList.header_pic);
      } else {
        this.$toast(res.error_message);
      }
    },
    // 生日
    birthdayConfirm(e) {
      var date =
        e.getFullYear() +
        "年" +
        eval(e.getMonth() + 1) +
        "月" +
        e.getDate() +
        "日";

      this.infoList.birthday = date;
      this.birthdayModel = false;
    },
    dateChange(e) {
      this.infoList.birthday =
        e.getValues()[0] + e.getValues()[1] + e.getValues()[2];
      // console.log(e.getValues());
    },
    // 性别
    sexSelect(item, index) {
      // 点击选项时默认不会关闭菜单，可以手动关闭
      this.sexModel = false;
      this.infoList.sex = index + 1;
      // console.log(index)
    },
    // 保存
    save() {
      this.editInfoData();
    },
    // 修改账号接口信息
    async editInfoData() {
      let data = {
        nickname: this.infoList.nickname,
        sex: this.infoList.sex,
        header_pic: this.infoList.header_pic,
        birthday: this.infoList.birthday,
        version: "1.0"
      };
      if (!this.infoList.nickname) {
        this.$toast("请输入昵称~");
        return;
      }
      if (!this.infoList.birthday) {
        this.$toast("请输入生日~");
        return;
      }
      if (!this.infoList.sex) {
        this.$toast("请输入性别~");
        return;
      }
      let res = await USER_INFO_EDIT(data);
      if (res.hasOwnProperty("response_code")) {
        this.$toast("信息修改成功~");
        this.$router.push({name: 'set'});
      } else {
        this.$toast(res.error_message);
      }
    }
  }
};
</script>
