<template>
  <div id="upload">
    <div class="flex-box" id="button">
      <div class="box">
        <div class="content">
          <van-uploader :after-read="onRead">
            <span>上传图片</span>
          </van-uploader>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
#upload {
  // 头像上传
  & {
    display: flex;
    flex-wrap: wrap;
    .flex-box {
      flex-basis: calc(25% - 10px);
      margin: 10px 0 0 10px;
      & .box {
        position: relative;
        & .content {
          @include ratioBox(100%, 100%, contain);
          border: 1px #eee solid;
          & .del {
            border: 1px #000 solid;
            @include position(absolute, "tr", 0, 0, 20px, 20px, 20px);
          }
          & .van-uploader {
            @include fullBox;
            @include verticalMiddle;
          }
        }
      }
    }
  }
}
</style>

<script>
export default {
  name: "upload",
  props: ["uploadData"],
  methods: {
    // 头像上传
    onRead(file) {
      var src = file.content;
      var maxlength = this.uploadData.maxlength;
      //   upload
      var upload = document.getElementById("upload");
      //   button
      var button = document.getElementById("button");
      //   flexbox
      var flexbox = document.createElement("div");
      //   box
      var box = document.createElement("div");
      //   content
      var content = document.createElement("div");
      //   del
      var del = document.createElement("div");
      del.classList.add("del");
      content.appendChild(del);
      content.classList.add("content");
      content.style.backgroundImage = "url(" + src + ")";

      box.appendChild(content);
      box.classList.add("box");

      flexbox.appendChild(box);
      flexbox.classList.add("flex-box");

      upload.insertBefore(flexbox, button);

      del.addEventListener("click", () => {
        var p = del.parentNode.parentNode.parentNode;
        p.parentNode.removeChild(p);
      });

      console.log(flexbox.length);
    }
  }
};
</script>

