<template>
  <div class="xtx-goods-page" v-if="goods">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem :to="`/category/${goods.categories[1].id}`">{{
          goods.categories[1].name
        }}</XtxBreadItem>
        <XtxBreadItem :to="`/category/sub/${goods.categories[0].id}`">{{
          goods.categories[0].name
        }}</XtxBreadItem>
        <XtxBreadItem>{{ goods.name }}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <GoodsImage :images="goods.mainPictures" />
          <GoodsSales />
        </div>
        <div class="spec">
          <GoodName :goods="goods" />
          <!-- sku组件 
          skuId="1482368625853726723"-->
          <GoodsSku :goods="goods" @change="changeSku" />
          <!-- 数量选择组件 -->
          <XtxNumbox v-model="num" :max="goods.inventory" label="数量" />
          <XtxButton @click="insertCart()" size="middle" type="primary" style="margin-top: 20px">加入购物车</XtxButton>
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <GoodsTabs />
          <!-- 注意事项 -->
          <div class="goods-warn">
            <GooodsWarn />
          </div>
        </div>
        <!-- 24热榜+周榜 -->
        <div class="goods-aside">
          <GooodsHot />
          <GooodsHot :type="2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsRelevant from "./components/goods-relevant";
import GoodsImage from "./components/goods-image.vue";
import GoodsSales from "./components/goods-sales.vue";
import GoodName from "./components/goods-name.vue";
import GoodsSku from "./components/goods-sku.vue";
import GoodsTabs from "./components/goods-tabs.vue";
import GooodsHot from "./components/goods-hot.vue";
import GooodsWarn from "./components/goods-warn.vue";
import { findGoods } from "@/api/product";
import { nextTick, provide, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from 'vuex';
import Message from '@/components/library/Message';
export default {
  name: "XtxGoodsPage",
  components: {
    GoodsRelevant,
    GoodsImage,
    GoodsSales,
    GoodName,
    GoodsSku,
    GoodsTabs,
    GooodsHot,
    GooodsWarn,
  },
  setup() {
    //   1.获取商品详情，进行渲染
    const goods = useGoods();
    const changeSku = (sku) => {
      // 修改商品现价 原价 库存信息
      if (sku.skuId) {
        goods.value.price = sku.price;
        goods.value.oldPrice = sku.oldPrice;
        goods.value.inventory = sku.inventory;
      }
      // 记录选择后的sku  可能有数据 可能没有数据{}
      currSku.value = sku
    };

    // 提供goods数据给后代组件使用
    // provide 参数 数据的key 具体数据
    provide("goods", goods);

    // 选择的数量
    const num = ref(1);


    // 加入购物车
    const store = useStore()
    const currSku = ref(null)
    const insertCart = ()=>{
      // 是否选规格
      if(currSku.value && currSku.value.skuId){
        const { skuId, specsText:attrsText, inventory:stock } = currSku.value
        const { id, name, price, mainPictures } = goods.value
        store.dispatch('cart/insertCart',{
          // id skuId name attrsText	picture price nowPrice selected stock count isEffective 
          skuId,
          attrsText,
          stock,
          id,
          name,
          price,
          nowPrice:price,
          picture:mainPictures[0],
          selected:true,
          isEffective:true,
          count:num.value,   
        }).then(()=>{
          // then的原因是cart.js中调用了resolve()
          Message({type:'success',text:'添加购物车成功'})
        })
      }else{
        Message({text:'请选择完整的规格'})
      }
      

    }
    return { goods, changeSku, num, insertCart };
  },
};
// 获取商品详情v
const useGoods = () => {
  const goods = ref(null);
  const route = useRoute();
  // 考虑到 出现路由地址的商品id发送变化  但是不会重新初始化组件的情况 所以watch
  watch(
    () => route.params.id,
    (newVal) => {
      if (newVal && `/product/${newVal}` === route.path) {
        //会出现从product页跳会首页时id为空 会报错 进行判断
        findGoods(route.params.id).then((data) => {
          //   console.log(data);
          //   让商品数据为空 让使用v-if的组件可以重新销毁和创建 代码根据新的商品id做事情 不用每次都监听
          goods.value = null; //置空 让组件销毁
          nextTick(() => {
            goods.value = data.result; //下次在赋值
          });
        });
      }
    },
    { immediate: true }
  );
  return goods;
};
</script>

<style scoped lang='less'>
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
// .goods-tabs {
//   min-height: 600px;
//   background: #fff;
// }
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>