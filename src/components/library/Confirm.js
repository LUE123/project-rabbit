// 提供一个能够显示xtx-confirm确认框组件的函数

import XtxConfirm from './xtx-confirm.vue'
import { createVNode, render } from 'vue'

// dom
const div = document.createElement('div')
div.setAttribute('class', 'xtx-confirm-container')
document.body.appendChild(div)

// 返回的是promise对象，点取消 点确认都要销毁组件
// 调用这个方法 传入{ title, text }   在连着cancelCallback, submitCallback 一起传递给xtx-confirm组件
export default ({ title, text }) => {
    // 1.导入被创建的组件
    // 2.使用createVNode创建虚拟节点
    // 3.准备一个dom容器装载组件
    // 4.使用render函数渲染组件到容器
    // createVNode(组件，属性对象（props）)
    return new Promise((resolve, reject) => {
        // 点击取消触发的函数
        const cancelCallback = () => {
            render(null, div)
            reject(new Error('点击取消'))
        }
        // 点击确认触发的函数
        const submitCallback = () => {
            render(null, div)
            resolve()
        }
        const vnode = createVNode(XtxConfirm, { title, text, cancelCallback, submitCallback })
        render(vnode, div)
    })
}