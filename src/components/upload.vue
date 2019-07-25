<template>
  <div id="upload">
    <div class="flex-box" id="button">
      <div class="box" id="van">
        <div class="content">
          <van-uploader :after-read="onRead">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-photo-line"></use>
            </svg>
            <div class="text">最多三张图</div>
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
    // padding: 5px;

    .flex-box {
      @include flexBasis(80px);
      margin-right: 10px;

      & .box {
        position: relative;
        // padding: 5px;

        & .content {
          @include ratioBox(100%, 100%, null, contain, null, null);
          @include font(null, $fontSize - 2, #999);
          border: 1px #ccc dashed;
          border-radius: 2px;
          & .del {
            background-color: rgba($color: #000000, $alpha: 0.5);
            color: $white;
            text-align: center;
            @include position(absolute, "tr", 3px, 3px, 15px, 15px, 2px);

            & .icon {
              width: 13px;
              height: 13px;
            }
          }
          & .van-uploader {
            @include fullBox;
            @include displayFlex(flex, center, center);
            flex-wrap: wrap;
            text-align: center;

            & .icon {
              width: 20px;
              height: 20px;
              position: relative;
              top: 5px;
            }
            & div {
              @include flexBasis(100%);
              font-size: 11px;
              position: relative;
              color: $cl9;
              line-height: 1;
              top: -5px;
            }
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
  mounted() {
    this.content;
  },
  computed: {
    content() {
      var text = this.uploadData.text;
      return $("#upload .text").text(text);
    }
  },
  methods: {
    // 头像上传
    // onRead(file) {
    //   var src = file.content;
    //   var maxlength = this.uploadData.maxlength;
    //   //   upload
    //   var upload = document.getElementById("upload");
    //   //   button
    //   var button = document.getElementById("button");
    //   //   flexbox
    //   var flexbox = document.createElement("div");
    //   //   box
    //   var box = document.createElement("div");
    //   //   content
    //   var content = document.createElement("div");
    //   //   del
    //   var del = document.createElement("div");

    //   del.classList.add("del");
    //   content.appendChild(del);
    //   content.classList.add("content");
    //   content.style.backgroundImage = "url(" + src + ")";

    //   box.appendChild(content);
    //   box.classList.add("box");

    //   flexbox.appendChild(box);
    //   flexbox.classList.add("flex-box");

    //   upload.insertBefore(flexbox, button);

    //   del.addEventListener("click", () => {
    //     var p = del.parentNode.parentNode.parentNode;
    //     p.parentNode.removeChild(p);
    //   });

    //   // 提示最多上传图片张数
    //   var tmp = document.querySelectorAll("#upload .flex-box .box");
    //   var count = tmp.length;
    //   if (count >= maxlength + 1) {
    //     var msg = "最多上传" + maxlength + "张图片！";
    //     this.$toast(msg);
    //     // van
    //     var van = document.getElementById("van");
    //     van.parentNode.removeChild(van);
    //   }
    // },
    // 头像上传

    onRead(file) {
      var src = file.content;

      var maxlength = this.uploadData.maxlength;
      var text = this.uploadData.text;
      var box = $("#upload .flex-box .box");
      var length = box.length;
      var van = $("#van");

      // $('.text').text(text);
      $("#upload").prepend(
        '<div class="flex-box">' +
          '<div class="box">' +
          '<div class="content set" data-src="' +
          src +
          '" style="background-image: url(' +
          src +
          ');">' +
          '<div class="del">' +
          '<svg class="icon" aria-hidden="true">' +
          '<use xlink:href="#icon-close-line"></use>' +
          "</svg>" +
          "</div>" +
          "</div>" +
          "</div>" +
          "</div>"
      );

      $("#upload .del").on("click", function() {
        length = box.length;
        $(this)
          .parents(".flex-box")
          .remove();

        van.css("display", "block");
      });

      // 提示最多上传图片张数
      if (length >= maxlength) {
        var msg = "最多上传" + maxlength + "张图片！";
        // this.$toast(msg);
        van.css("display", "none");
      }
    }
  }
};
</script>



