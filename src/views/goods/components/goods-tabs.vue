<template>
  <div class="goods-tabs">
    <nav>
      <a
        @click="activeName = 'GoodsDetial'"
        :class="{ active: activeName === 'GoodsDetial' }"
        href="javascript:;"
        >商品详情</a
      >
      <a
        @click="activeName = 'GoodsComment'"
        :class="{ active: activeName === 'GoodsComment' }"
        href="javascript:;"
        >商品评价<span>(500+)</span></a
      >
    </nav>
    <!-- 切换内容的地方 其实是两个组件-->
    <!-- 在vue中动态的去切换组件其实可以使用动态组件component组件 -->
    <!-- is属性用来决定component动态组件渲染为那个组件 is的值为组件的名称 -->
    <!-- <GoodsDetial v-if="activeName === 'GoodsDetial'"/>
    <GoodsComment v-if="activeName === 'GoodsComment'"/> -->
    <!-- activeName的值等于 要切换的组件的名称 -->
    <component :is="activeName"></component>
  </div>
</template>

<script>
import GoodsDetial from './goods-detail.vue'
import GoodsComment from './goods-comment.vue'
import { ref } from "vue";
export default {
  name: "GoodsTabs",
  components:{GoodsDetial, GoodsComment},
  setup() {
    // activeName = GoodsDetial -->激活商品详情
    // activeName = GoodsComment -->激活商品评价
    const activeName = ref("GoodsDetial");
    return { activeName };
  },
};
</script>

<style scoped lang='less'>
.goods-tabs {
  min-height: 600px;
  background: #fff;
  nav {
    height: 70px;
    line-height: 70px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    a {
      padding: 0 40px;
      font-size: 18px;
      position: relative;
      > span {
        color: @priceColor;
        font-size: 16px;
        margin-left: 10px;
      }
      &:first-child {
        border-right: 1px solid #f5f5f5;
      }
      &.active {
        &::before {
          content: "";
          position: absolute;
          left: 40px;
          bottom: -1px;
          width: 72px;
          height: 2px;
          background: @xtxColor;
        }
      }
    }
  }
}
</style>