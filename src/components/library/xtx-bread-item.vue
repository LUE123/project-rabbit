<template>
  <div class="xtx-bread-item">
      <!-- 文字 -->
    <RouterLink v-if="to" :to="to"><slot /></RouterLink>
    <!-- 箭头 -->
    <span v-else><slot /></span>
    <!-- <i class="iconfont icon-angle-right"></i> -->
  </div>
</template>
<script>
export default {
  name: 'XtxBreadItem',
  props: {
    to: {
      type: [String, Object],
      default:'/'
    }
  }
}
</script>