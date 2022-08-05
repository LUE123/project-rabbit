<script>
import { h } from 'vue'
export default {
  name: "XtxBread",
  render(){
    // 用法
    // 1.template 标签去除 单文件组件
    // 2.返回值就是组件内容
    // 3.0vue2.0的h函数传参进来的 vue3.0的h函数需要导入进来
    // 4.h 的第一个参数 标签名  第二个 标签属性对象  第三个 子节点
    // 需求
    // 1.创建 xtx-bread 父容器
    // 2.获取默认插槽内容
    // 3.去除xtx-bread-item组件的i标签 应该由render函数创建
    // 4.遍历插槽中的item 得到一个动态创建的节点 最后一个item不加i标签
    // 5.把动态创建的节点渲染在xtx-bread标签中 
    const items = this.$slots.default() //默认插槽内容 
    // console.log(items);   结构[{},{},{}...]
    const dymanicItems = []
    items.forEach((item,i) =>{
        dymanicItems.push(item)
        if(i < (items.length - 1)){  //最后一个item不加i标签
        dymanicItems.push(h('i',{class:'iconfont icon-angle-right'}))  //h()创建一个i标签（箭头）
        }
    })
    // return 返回的在页面渲染
    return h('div',{class:'xtx-bread'},dymanicItems)  //h() 创建一个元素
  }
};
</script>

<style lang='less'>
// 去除scoped 属性 目的：让样式也作用于xtx-bread-item组件
// ul li:last-child(){}
// 先找到父元素 找到所有的子元素 找到最后一个 判断是不是LI 是就选中 不是就是无效选择器
// ul li:last-of-type(){}
// 先找到父元素 找到所有的类型为li的元素 选中最后一个
.xtx-bread {
  display: flex;
  padding: 25px 10px;
  &-item {
    a {
      color: #666;
      transition: all 0.4s;
      &:hover {
        color: @xtxColor;
      }
    }
  }
  i {
    font-size: 12px;
    margin-left: 5px;
    margin-right: 5px;
    line-height: 22px;
    // &:last-child{
    //     display: none;
    // }
  }
}
</style>