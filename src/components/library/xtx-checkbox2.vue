<template>
  <div class="xtx-checkbox" @click="changeChecked()">
    <i v-if="checked" class="iconfont icon-checked"></i>
    <i v-else class="iconfont icon-unchecked"></i>
    <!-- 默认插槽内容 $slots.default -->
    <span v-if="$slots.default"><slot /></span>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useVModel } from '@vueuse/core';
// v-model：  :modelValue + @update:modelValue   
export default {
    name:'XtxCheckBox2',
    props:{
        modelValue:{
            type:Boolean,
            default:false
        }
    },
    setup(props,{emit}){
        const checked = useVModel(props,'modelValue',emit)
        const changeChecked = ()=>{
            const newVal = !checked.value
            // 通知父组件
            checked.value = newVal
        }
        return{ checked, changeChecked }
    }
};
</script>

<style scoped lang="less">
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>