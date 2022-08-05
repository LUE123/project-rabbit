// 提供一个能够显示xtx-message组件的函数
// 可带入直接使用 或 挂载在vue实例原型上
// import Message from 'Message.js'  使用 Message({type:'erroe',text:'提示文字'})
// 如果已经挂载  使用 this.$Message({type:'erroe',text:'提示文字'})

import { createVNode, render } from 'vue'
import XtxMessage from './xtx-message.vue'

// 装载消息提示组件的DOM容器
const div = document.createElement('div')
div.setAttribute('class', 'xtx-message-container')
document.body.appendChild(div)

// 定时器标识
let timer = null

//调用xtxmessage的函数 通过这个函数调组件
export default ({ type,text }) => {
    // 渲染组件
    // 1.导入消息提示组件
    // 2.将消息提示组件编译为虚拟节点(dom节点)
    // createVNode(组件，属性对象（props）)
    const vnode = createVNode(XtxMessage, { type, text })
    // 3.准备一个装载消息提示组件的DOM容器
    // 4.将虚拟节点渲染在容器中
    // render(虚拟节点，DOM容器)
    render(vnode, div)
    //  5. 2秒后销毁组件
    clearTimeout(timer)
    timer = setTimeout(() => {
        render(null,div)
    },2000)
}