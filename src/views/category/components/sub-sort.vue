<template>
  <div class="sub-sort">
    <div class="sort">
      <a href="javascript:;" @click="changeSort(null)" :class="{active:sortParams.sortField === null}">默认排序</a>
      <a href="javascript:;" @click="changeSort('publishTime')" :class="{active:sortParams.sortField === 'publishTime'}">最新商品</a>
      <a href="javascript:;" @click="changeSort('orderNum')" :class="{active:sortParams.sortField === 'orderNum'}">最高人气</a>
      <a href="javascript:;" @click="changeSort('evaluateNum')" :class="{active:sortParams.sortField === 'evaluateNum'}">评论最多</a>
      <a href="javascript:;" @click="changeSort('price')">
        价格排序
        <i class="arrow up" :class="{active:sortParams.sortField === 'price' && sortParams.sortMethod==='asc'}"/>
        <i class="arrow down" :class="{active:sortParams.sortField === 'price' && sortParams.sortMethod==='desc'}"/>
      </a>
    </div>
    <div class="check">
      <XtxCheckbox v-model="sortParams.inventory" @change="changeCheck">仅显示有货商品</XtxCheckbox>
      <XtxCheckbox v-model="sortParams['onlyDiscount']" @change="changeCheck">仅显示特惠商品</XtxCheckbox>
    </div>
  </div>
</template>
<script>
import { reactive } from 'vue';
export default {
  name: "SubSort",
  setup(props,{emit}) {
    //   实现交互(实现交互的数据和后台保持一致)
    // 1.明确交互所产生的数据
    const sortParams = reactive({
        inventory:false,
        onlyDiscount:false,
        // sortField   可选值[publishTime,orderNum,price,evaluateNum]
        sortField:null,
        // sortMethod	可选值 asc为正序，desc为倒序，默认为desc
        sortMethod:null
    })
    // 2.提供模板使用
    // 3.提供绑定按钮的点击事件  修改排序字段 排序方式 
    const changeSort = (sortField)=>{
        // 逻辑
        // 排序按钮
        if(sortField === 'price'){
            // 将sortField改成price
            sortParams.sortField = sortField
            // 处理排序
            if(sortParams.sortMethod === null){ //第一次点击
                sortParams.sortMethod = 'desc'
            }else{
                sortParams.sortMethod = sortParams.sortMethod === 'desc' ? 'asc' : 'desc'
            }
        }else{
            // 如果已经选中 阻止运行 
            if(sortParams.sortField === sortField) return
            sortParams.sortField = sortField
            sortParams.sortMethod = null
        }
        // 触发sort-change事件
        emit('sort-change',sortParams)
    }   

    const changeCheck = () =>{
        // 触发sort-change事件
        emit('sort-change',sortParams)
    }

    return{sortParams,changeSort,changeCheck}
  },
};
</script>
<style scoped lang='less'>
.sub-sort {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .sort {
    display: flex;
    a {
      height: 30px;
      line-height: 28px;
      border: 1px solid #e4e4e4;
      padding: 0 20px;
      margin-right: 20px;
      color: #999;
      border-radius: 2px;
      position: relative;
      transition: all 0.3s;
      &.active {
        background: @xtxColor;
        border-color: @xtxColor;
        color: #fff;
      }
      .arrow {
        position: absolute;
        border: 5px solid transparent;
        right: 8px;
        &.up {
          top: 3px;
          border-bottom-color: #bbb;
          &.active {
            border-bottom-color: @xtxColor;
          }
        }
        &.down {
          top: 15px;
          border-top-color: #bbb;
          &.active {
            border-top-color: @xtxColor;
          }
        }
      }
    }
  }
  .check {
    .xtx-checkbox {
      margin-left: 20px;
      color: #999;
    }
  }
}
</style>