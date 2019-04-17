<template>
  <div id="infoPage">
    <div v-for="item in listData">
      <div class="listBox" :class="{ active: item.isActive }" @click="showAction(item.type)">
        <div class="center">
          <div class="title">{{ item.title }}</div>
        </div>
        <div class="left">
          <div class="ratioBox" v-if="item.imgSrc">
            <div class="box">
              <img :src="item.imgSrc">
            </div>
          </div>

          <template v-if="item.text">{{ item.text }}</template>
        </div>
        <div class="right">
          <svg class="icon" aria-hidden="true" v-if="item.arrow">
            <use xlink:href="#icon-next-line"></use>
          </svg>
        </div>

        <input
          id="files"
          type="file"
          accept="image/*"
          v-if="item.type === 'picture'"
          @change="input"
        >
      </div>
    </div>
    <!-- 头像裁切，异步组件 -->
    <!-- 性别 -->
    <van-actionsheet
      v-model="sexModel"
      :actions="actions"
      cancel-text="取消"
      @select="onSelect"
      @cancel="onCancel"
    />
    <!-- 生日 -->
    <van-popup v-model="birthdayModel" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :max-date="maxDate"
        :formatter="formatter"
        confirm-button-text="完成"
        @cancel="show=false"
        title="请选择时间"
      />
    </van-popup>
    <!--  -->
  </div>
</template>

<style src="@/style/scss/pages/personal/set/info.scss" lang="scss"></style>

<script>
export default {
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
      ],
      listData: [
        {
          type: "picture",
          isActive: true,
          title: "头像",
          imgSrc:
            "https://bnmppic.bookuu.com/topic/20161108/1478612622195756.jpg",
          arrow: true
        },
        {
          text: "134****3931",
          title: "账号"
        },
        {
          text: "小姐姐二号",
          title: "昵称"
        },
        {
          type: "birthday",
          text: "还是空的，快去写吧",
          title: "生日",
          arrow: true
        },
        {
          type: "sex",
          text: "男",
          title: "性别",
          arrow: true
        }
      ]
    };
  },
  mounted() {},
  methods: {
    // 性别
    onSelect(item) {
      // 点击选项时默认不会关闭菜单，可以手动关闭
      this.sexModel = false;
      this.listData[4].text = item.name;
      //   this.$toast(item.name);
    },
    onCancel() {},
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

        // $(".cropper-box-canvas img[data-v-ebaf968c]").get(0).src = data;

        console.log(data);
      };

      //   this.$router.push("/personal/set/cropper");
      this.iframeState = true;
    }
  }
};
</script>
