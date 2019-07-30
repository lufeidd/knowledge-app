<template>
  <!-- <div id="easyNav">
    <div class="button" @click="foldAction">
      <svg class="icon" aria-hidden="true" v-if="navData.fold">
        <use xlink:href="#icon-more-line"></use>
      </svg>
      <svg class="icon" aria-hidden="true" v-else>
        <use xlink:href="#icon-open-line"></use>
      </svg>
      <div>
        快速
        <br>导航
      </div>
    </div>
    <div class="route" v-if="navData.fold">
      <router-link :to="navData.homeLink" class="link" v-if="navData.home">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-home-line"></use>
        </svg>
        <div>首页</div>
      </router-link>

      <router-link
        v-if="navData.type == 'brand' && navData.search"
        :to="{path:navData.searchLink,query:{type:navData.type}}"
        class="link"
      >
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-littleSearch-line"></use>
        </svg>
        <div>搜索</div>
      </router-link>
      <router-link
        v-if="navData.type == 'order' && navData.search"
        :to="{path:navData.searchLink,query:{type:navData.type}}"
        class="link"
      >
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-littleSearch-line"></use>
        </svg>
        <div>搜索</div>
      </router-link>
      <router-link
        v-if="navData.type == 'mall' && navData.search"
        :to="{path:navData.searchLink,query:{type:navData.type, supplier_id: navData.supplier_id}}"
        class="link"
      >
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-littleSearch-line"></use>
        </svg>
        <div>搜索</div>
      </router-link>

      <router-link :to="navData.personalLink" class="link" v-if="navData.personal">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-personal-line"></use>
        </svg>
        <div>我的</div>
      </router-link>
    </div>
  </div>-->
  <div id="easyNav">
    <div class="button" @click="foldAction">
      <svg class="icon" aria-hidden="true" v-if="navData.fold">
        <use xlink:href="#icon-more-line" />
      </svg>
      <svg class="icon" aria-hidden="true" v-else>
        <use xlink:href="#icon-open-line" />
      </svg>
      <div>
        快速
        <br />导航
      </div>
    </div>
    <div class="route" v-if="navData.fold">
      <router-link :to="navData.homeLink" class="link" v-if="navData.home">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-home-line" />
        </svg>
        <div>首页</div>
      </router-link>

      <router-link
        v-if="type == 'brand' && navData.search"
        :to="{path:navData.searchLink,query:{type:type}}"
        class="link"
      >
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-littleSearch-line" />
        </svg>
        <div>搜索</div>
      </router-link>
      <router-link
        v-if="type == 'order' && navData.search"
        :to="{path:navData.searchLink,query:{type:type}}"
        class="link"
      >
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-littleSearch-line" />
        </svg>
        <div>搜索</div>
      </router-link>
      <router-link
        v-if="navData.type == 'mall' && navData.search"
        :to="{path:navData.searchLink,query:{type:navData.type, supplier_id: navData.supplier_id}}"
        class="link"
      >
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-littleSearch-line" />
        </svg>
        <div>搜索</div>
      </router-link>

      <router-link :to="navData.personalLink" class="link" v-if="navData.personal">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-personal-line" />
        </svg>
        <div>我的</div>
      </router-link>
    </div>
  </div>
</template>

<style lang="scss">
#easyNav {
  @include position(fixed, "br", 60px, 0, null, 60px, null);
  @include displayFlex(flex, center, center);
  z-index: 101;

  & .button {
    background-color: rgba(0, 0, 0, 0.6);
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
    padding: 4px 6px 4px 6px;
    line-height: 1.4;
    @include font(null, $fontSize - 2, $white);
    @include displayFlex(flex, center, center);

    & .icon {
      margin-right: 5px;
    }
  }

  & .route {
    border: 1px #dfdfdf solid;
    border-width: 1px 0 1px 1px;
    padding: 10px 0;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
    text-align: center;
    background-color: $white;
    z-index: 1;
    @include displayFlex(flex, center, center);

    & .link {
      @include font(null, $fontSize - 2, #333);
      padding: 0 10px;

      & .icon {
        width: 16px;
        height: 16px;
      }
    }
  }
}
</style>

<script>
export default {
  // name: "easyNav",
  // props: ["navData"],
  props: ["type"],
  data() {
    return {
      navData: {
        fold: false,
        home: true,
        homeLink: "/brand/index",
        search: true,
        searchLink: "/search",
        personal: true,
        personalLink: "/personal/index",
        type: "brand"
      }
    };
  },
  mounted() {
    if (this.type === undefined) {
      this.type = this.navData.type;
    }
  },
  methods: {
    foldAction() {
      this.navData.fold = !this.navData.fold;
    }
  }
};
</script>

