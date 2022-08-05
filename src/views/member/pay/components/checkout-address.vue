<template>
  <div class="checkout-address">
    <div class="text">
      <div v-if="!showAddress" class="none">您需要先添加收货地址才可提交订单。</div>
      <ul v-if="showAddress">
        <li><span>收<i/>货<i/>人：</span>{{showAddress.receiver}}</li>
        <!-- <li><span>联系方式：</span>{{showAddress.contact.replace(2,4,'****')}}</li> -->
        <li><span>联系方式：</span>{{showAddress.contact.replace(/^(\d{3})\d{4}(\d{4})$/,'$1****$2')}}</li>
        <li><span>收货地址：</span>{{showAddress.fullLocation.replace(/ /g,'')}}{{showAddress.address}}</li>
      </ul>
      <a @click="openAddressEdit(showAddress)" v-if="showAddress" href="javascript:;">修改地址</a>
    </div>
    <div class="action">
      <XtxButton @click="openDialog()" class="btn">切换地址</XtxButton>
      <XtxButton @click="openAddressEdit({})" class="btn">添加地址</XtxButton>
    </div>
  </div>
  <!-- 对话框组件 - 切换收货地址-->
  <XtxDialog title="切换收货地址" v-model:visible='visibleDialog'>
    <div @click="selectedAddress=item" :class="{ active: selectedAddress  && selectedAddress.id === item.id}" 
      class="text item" v-for="item in list" :key="item.id">
       <ul>
         <li><span>收<i/>货<i/>人：</span>{{item.receiver}}</li>
         <li><span>联系方式：</span>{{item.contact.replace(/^(\d{3})\d{4}(\d{4})$/,'$1****$2')}}</li>
         <li><span>收货地址：</span>{{item.fullLocation.replace(/ /g,'')+item.address}}</li>
       </ul>
    </div>
    <template v-slot:footer>
      <XtxButton @click="visibleDialog=false" type="gray" style="margin-right:20px">取消</XtxButton>
      <XtxButton @click="confirmAddressFn()" type="primary">确认</XtxButton>
    </template>
  </XtxDialog>
  <!-- 添加编辑组件 - 收货地址的添加和编辑组件-->
  <AddressEdit @on-success='successHander' ref="addressEditCom"  />
</template>
<script>
import { ref } from 'vue'
import AddressEdit from './address-edit.vue'
export default {
  name: 'CheckoutAddress',
  components:{ AddressEdit },
  props:{
    // 收货地址列表
    list:{
      type:Array,
      default:()=>[]
    }
  },
  // 1.在拥有根源素的组件中 触发自定义事件 有么有emits选项无所谓
  // 2.如果组件渲染的是代码片段 vue3规范 需要在emits中声明你所触发的自定义事件名
  // 3.提倡：你触发的自定义事件，需要在emits选项中声明，增加代码可读性
  emits:['change'],
  setup(props,{emit}){
    // 1.找到默认收货地址
    // 1.没有默认收货地址，使用第一条收获地址
    // 3.没有数据 提示添加‘需要添加一条地址’
    const showAddress = ref(null)
    const defaultAddress = props.list.find(item=>item.isDefault===0)
    if(defaultAddress){
      showAddress.value = defaultAddress
    }else{
      // props.list.length && props.list[0]
      // 如果props.list.length 有值   就取出props.list[0]
      if(props.list.length){
        showAddress.value = props.list[0]
      }
    }

    // 默认通知父组件一个收货地址ID
    // showAddress.value && showAddress.value.id  如果showAddress.value有值 就传 showAddress.value.id
    emit('change',showAddress.value && showAddress.value.id)

    // 切换地址对话框的显示隐藏
    const visibleDialog = ref(false)

    // 记录当前你选中的地址ID
    const selectedAddress = ref(null)

    const confirmAddressFn = ()=>{
      // 1.显示的地址换成选中的地址
      showAddress.value = selectedAddress.value
      // 2.把选中的地址的id通知给结算组件
      emit('change',selectedAddress.value?.id)
      visibleDialog.value = false
    }

    const openDialog = ()=>{
      visibleDialog.value = true
      // 将之前选中的地址置空
      selectedAddress.value = null
    }

    // 打开添加编辑收货地址组件 
    // AddressEdit组件实例 
    const addressEditCom = ref(null)
    const openAddressEdit = (address)=>{
      // console.log(address);
      // 用参数address的就是修改地址  只有空对象的就是添加地址
      addressEditCom.value.open(address)
    }

    const successHander = (formData)=>{
      // 根据formData的ID在地址列表中查找 找到就是修改 找不到就是添加
      const address = props.list.find(item=>item.id === formData.id)
      if(address){
        // 修改
        for(const key in address){
         address[key] = formData[key]
        }

      }else{
        // 添加
        // 如果是添加 往list里面追加   props.list是复杂数据 可以修改
        // 当修改formData的时候，数组中的数据也会更新，因为是同一个引用地址 （ props.list.unshift(formData) ）
        // 啥时候修改formData,当打开对话框添加地址时，需要清空之前的输入信息
        // 所以需要克隆formData数据
        const jsonStr = JSON.stringify(formData)
        props.list.unshift(JSON.parse(jsonStr))
      }
    }

    return { 
      showAddress,
      visibleDialog,
      selectedAddress,
      confirmAddressFn,
      openDialog,
      openAddressEdit,
      addressEditCom,
      successHander 
    }
  }
}
</script>
<style scoped lang="less">
.xtx-dialog {
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active,&:hover {
        border-color: @xtxColor;
        background: lighten(@xtxColor,50%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
}
.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
</style>