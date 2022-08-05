<template>
  <div class="member-order">
    <XtxTabs v-model="activeName" @tab-click="tabClick">
      <XtxTabsPanel
        v-for="item in orderStatus"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      ></XtxTabsPanel>
    </XtxTabs>
    <!-- 订单列表 -->
    <div class="order-list">
      <div v-if="loading" class="loading"></div>
      <div class="none" v-if="!loading && orderList.length === 0">暂无数据</div>
      <OrderItem
        @on-logistics="handlerLogistics"
        @on-confirm="handlerConfirm"
        @on-delete="handlerDelete"
        @on-cancel="handlerCancel"
        v-for="item in orderList"
        :key="item.id"
        :order="item"
      />
    </div>
    <!-- 分页组件 -->
    <XtxPagination
      v-if="total > 0"
      :current-page="reqParams.page"
      :page-size="reqParams.pageSize"
      :total="total"
      @current-change="reqParams.page = $event"
    />
    <!-- 取消原因组件 -->
    <OrderCanel ref="orderCancelCom" />
    <!-- 查看物流组件 -->
    <OrderLogistics ref="orderLogisticsCom" />
  </div>
</template>
<script>
import { reactive, ref, watch } from "vue";
import { orderStatus } from "@/api/constants";
import OrderItem from "./components/order-item.vue";
import OrderCanel from "./components/order-cancel.vue";
import OrderLogistics from './components/order-logistics.vue'
import { confirmOrder, delteOrder, findOrderList } from "@/api/order";
import Confirm from "@/components/library/Confirm";
import Message from '@/components/library/Message'
export default {
  name: "MemberOrder",
  components: { OrderItem, OrderCanel, OrderLogistics },
  setup() {
    const activeName = ref("all");
    const loading = ref(false);
    const total = ref(0);
    // 筛选条件
    const reqParams = reactive({
      page: 1,
      pageSize: 5,
      orderState: 0,
    });

    // 获取列表  更新列表
    const getOrderList = () => {
      loading.value = true;
      findOrderList(reqParams).then((data) => {
        orderList.value = data.result.items;
        total.value = data.result.counts;
        // console.log(orderList);
        loading.value = false;
      });
    };

    const orderList = ref([]);
    // 筛选条件发送变化 从新加载
    watch(
      reqParams,
      () => {
        getOrderList();
      },
      { immediate: true }
    );

    // 点击选项卡
    const tabClick = ({ index }) => {
      // console.log(index);
      reqParams.page = 1;
      reqParams.orderState = index;
    };

    // 删除订单
    const handlerDelete = (order) => {
      Confirm({ text: "您确认删除订单吗" })
        .then(() => {
          delteOrder(order.id).then(() => {
            Message({ type: "success", text: "删除成功" });
            // 删除后  更新当前列表
            getOrderList();
          });
        })
        .catch(() => {});
    };

    return {
      activeName,
      orderStatus,
      orderList,
      tabClick,
      loading,
      total,
      reqParams,
      handlerDelete,
      ...useCancel(),
      ...useConfirm(),
      ...useLogistics()
    };
  },
};
// 取消订单逻辑
export const useCancel = () => {
  // 绑定取消原因组件实例
  const orderCancelCom = ref(null);
  // 点击取消
  const handlerCancel = (order) => {
    orderCancelCom.value.open(order);
  };
  return { handlerCancel, orderCancelCom };
};

// 确认收货逻辑
export const useConfirm = ()=>{
  const handlerConfirm = (order)=>{
    Confirm({text:'确认收货吗'}).then(()=>{
      confirmOrder(order.id).then(()=>{
        Message({ type: "success", text: "确认收货成功" });
        // 订单由待收获变成带评价
        order.orderState = 4
      })
    }).catch((e)=>{
      console.log(e);
    })
  }
  return{ handlerConfirm }
}

// 查看物流逻辑
const useLogistics = ()=>{
  const orderLogisticsCom = ref(null)
  const handlerLogistics = (order)=>{
    orderLogisticsCom.value.open(order)
  }
  return { handlerLogistics, orderLogisticsCom }
}
</script>
<style scoped lang="less">
.member-order {
  height: 100%;
  background: #fff;
}
.order-list {
  padding: 20px;
  position: relative;
  min-height: 400px;
}
.loading {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.9) url(../../../assets/images/loading.gif)
    no-repeat center;
}
.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
}
</style>