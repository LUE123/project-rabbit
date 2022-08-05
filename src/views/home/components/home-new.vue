<template>
  <div class="home-new">
    <HomePanel title="新鲜好物" subTitle="新鲜出炉 品质靠谱">
      <template #right>
        <XtxMore path="/" />
      </template>
      <div ref="target" style="position: relative; height: 426px">
        <!-- 默认插槽 面板内容-->
        <transition name="fade">
          <ul v-if="goods.length" class="goods-list">
            <li v-for="item in goods" :key="item.id">
              <RouterLink :to="`/product/${item.id}`">
                <img :src="item.picture" alt="" />
                <p class="name ellipsis">{{ item.name }}</p>
                <p class="price">&yen;{{ item.price }}</p>
              </RouterLink>
            </li>
          </ul>
          <HomeSkeleton v-else bg="#f0f9f4" />
        </transition>
      </div>
    </HomePanel>
  </div>
</template>

<script>
import {ref} from 'vue'
import HomePanel from "./home-panel.vue";
import HomeSkeleton from "./home-skeleton.vue";
import { findNew } from "@/api/home";
import { useLazyData } from "@/hooks";
export default {
  name: "HomeNew",
  components: { HomePanel, HomeSkeleton },
  setup() {
    // const goods = ref([]);
    // findNew().then((data) => {
    //   goods.value = data.result;
    // });
    // 数据将来不知道是什么类型  ref(null)
    // 使用方法：
    // 1.target 去绑定一个监听对象，最好是DOM
    // 2.传入API函数，内部获取调用，返回的就是响应式数据
    const target = ref(null)
    const reslut  = useLazyData(target,findNew);
    return { goods: reslut, target };
  },
};
</script>

<style scoped lang="less">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }
    .price {
      color: @priceColor;
    }
  }
}
</style>