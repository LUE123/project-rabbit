<template>
  <div class="home-banner">
    <!-- 将轮博数据传递给XtxCarousel -->
    <XtxCarousel :autoPlay=true :sliders='sliders' />
  </div>
</template>
<script>
import {ref} from 'vue'
import {findBanner} from '@/api/home'
export default {
  name: 'HomeBanner',
  setup(){
    // 获取轮播图数据
    const sliders = ref([])
    findBanner().then(data=>{
      sliders.value = data.result
    })
    return {sliders}
  }
}
</script>
<style scoped lang="less">
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98
}
// 覆盖样式（不修改轮播图组件 通过在轮播图父盒子中覆盖样式完成轮播图样式修改 ）
.xtx-carousel {
  ::v-deep .carousel-btn.prev {
    left: 270px;
  }
  ::v-deep .carousel-indicator {
    padding-left: 250px;
  }
}
</style>