<template>
  <div id="infoPage">
    <div class="listBox" @click="showAction('pictrue')" style="margin-top: 5px;">
      <div class="center">
        <div class="title">头像</div>
      </div>
      <div class="left">
        <div class="ratioBox">
          <div class="box">
            <img src="https://bnmppic.bookuu.com/topic/20161108/1478612622195756.jpg">
          </div>
        </div>
      </div>
      <div class="right">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-next-line"></use>
        </svg>
      </div>

      <input id="files" type="file" accept="image/*" @change="input">
    </div>

    <van-cell title="账号" value="13200025452"/>
    <van-cell title="昵称" value="是否"/>
    <van-cell title="生日" is-link value="还是空的，快去写吧~" @click="showAction('birthday')"/>
    <van-cell title="性别" is-link value="男" @click="showAction('sex')"/>

    <!-- 头像裁切，异步组件 -->
    <!-- 性别 -->
    <van-actionsheet
      v-model="sexModel"
      :actions="actions"
      cancel-text="取消"
      @select="onSelect"
      @cancel="sexModel=false"
    />
    <!-- 生日 -->
    <van-popup v-model="birthdayModel" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :max-date="maxDate"
        :formatter="formatter"
        @confirm="birthdayConfirm"
        @change="getValues()"
        confirm-button-text="完成"
        @cancel="birthdayModel=false"
        title="请选择时间"
      />
    </van-popup>
    <!--  -->
  </div>
</template>

<style lang="sass">
html {
  background-color: $greyLight;
}

#infoPage {
    
  & .listBox {
    padding: 10px 15px;
    background-color: $white;
    border-bottom: 1px $greyLight solid;
    position: relative;
    @include displayFlex (flex, flex-start, center);

    & input[type=file] {
        @include fullBox;
    }

    & .left {
      @include textOverflow;
      @include clearfix;
      @include font(null, $fontSize - 1, #999);
      flex-grow: 1;
      text-align: right;

      & .ratioBox {
        @include ratioBox (28px, 28px, 1px #e7e7e7 solid, contain, null, null);
        float: right;
        border-radius: 28px;
        overflow: hidden;
        position: relative;

        & .box {
          @include position (absolute, 'tl', 0, 0, 100%, 100%, null);
          @include displayFlex (flex, center, center);

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
      @include flexBasis (15px);
      flex-shrink: 0;
      text-align: right;

      & .icon {
        width: 14px;
        height: 14px;
        color: #ccc;
      }
    }
  }
}
</style>

<script>
// import cropper from "./cropper";
export default {
  // components: {
  //   cropper
  // },
  data() {
    return {
      // 生日
      birthdayModel: false,
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
      actions: [
        {
          name: "女"
        },
        {
          name: "男"
        }
      ]
    };
  },
  mounted() {},
  methods: {
    // 生日
    birthdayConfirm() {
      this.listData[3].text = 1;
      this.birthdayModel = false;
    },
    getValues() {
      console.log(999);
      // this.getValues();
    },
    // 性别
    onSelect(item) {
      // 点击选项时默认不会关闭菜单，可以手动关闭
      this.sexModel = false;
      this.listData[4].text = item.name;
      //   this.$toast(item.name);
    },
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
    input() {
      //获取input file的files文件数组;
      //$('#files')获取的是jQuery对象，.get(0)转为原生对象;
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

        console.log(data);
      };

      //   this.$router.push("/personal/set/cropper");
    }
  }
};
</script>
