<template>
  <div class="member-order-detail" v-if="order">
    <!-- 头部 -->
    <DetailAction :order='order' />
    <!-- 进度 -->
    <DetailStep :order='order' />
    <!-- 物流 -->
    <suspense>
     <template v-slot:default>
       <!-- 渲染组件的内容 -->
        <DetailLogistics v-if='[3,4,5].includes(order.orderState)' :order='order' />
     </template>
     <template v-slot:fallback>
       <!-- 等待时显示的内容 -->
       <div class="loading">loading</div>
     </template>
    </suspense>
    <!-- 信息 -->
    <OrderInfo :order='order' />
  </div>
</template>

<script>
import DetailAction from "./components/detail-action.vue";
import DetailStep from './components/detail-step.vue'
import DetailLogistics from './components/detail-logistics.vue'
import OrderInfo from './components/detail-info.vue'
import { ref } from 'vue'
import { findOrderDetail } from '@/api/order';
import { useRoute } from 'vue-router';
export default {
  name: "MemberDetail",
  components: { DetailAction, DetailStep, DetailLogistics, OrderInfo },
  setup() {
    const order = ref(null)
    const route = useRoute()
    findOrderDetail(route.params.id).then(data=>{
      order.value = data.result
    })
    return { order }
  },
};
</script>

<style lang="less" scoped>
.member-order-detail {
  background: #fff;
  height: 100%;
}
.loading{
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
}
</style>>


