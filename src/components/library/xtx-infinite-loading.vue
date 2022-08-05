<template>
  <div class="xtx-infinite-loading" ref="target">
    <div class="loading" v-if="loading">
      <span class="img"></span>
      <span class="text">正在加载...</span>
    </div>
    <div class="none" v-if="finished">
      <span class="img"></span>
      <span class="text">亲，没有更多了</span>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
export default {
  name: "XtxInfiniteLoading",
  props: {
    //   只有父组件才知道 现在是在加载 还是加载完毕了  所以需要暴露
    // 这两个组件 控制显示那个模块
    loading: {
      type: Boolean,
      default: false,
    },
    finished: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const target = ref(null);
    //   监听target 是否进入可视区
    const { stop } = useIntersectionObserver(
      target,
      ([{ isIntersecting }]) => {
        //   判断是否进入可视区
        if (isIntersecting) {
          //   console.log(123);
          // 触发加载事件：请求加载完成，数据加载完毕
          if (!props.loading && !props.finished) {
            // 触发自定义事件
            emit("infinite");
          }
        }
      },
      { threshold: 0 }
    );
    return { target };
  },
};
</script>

<style scoped lang='less'>
.xtx-infinite-loading {
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    .img {
      width: 50px;
      height: 50px;
      background: url(../../assets/images/load.gif) no-repeat center / contain;
    }
    .text {
      color: #999;
      font-size: 16px;
    }
  }
  .none {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    .img {
      width: 200px;
      height: 134px;
      background: url(../../assets/images/none.png) no-repeat center / contain;
    }
    .text {
      color: #999;
      font-size: 16px;
    }
  }
}
</style>
