// 提供复用逻辑的函数（勾子）

import { useIntersectionObserver } from '@vueuse/core'
import { ref, onUnmounted } from 'vue'
import dayjs from 'dayjs'
import { useIntervalFn } from '@vueuse/core'


/**
 * 数据懒加载函数
 * @param {Element} target -Dom对象 
 * @param {Function} apiFn -API函数
 */
export const useLazyData = (target, apiFn) => {
    const result = ref([])
    // const target = ref(null)
    // stop 停止观察
    const { stop } = useIntersectionObserver(
        // 监听的目标元素
        target,
        ([{ isIntersecting }], observerElement) => {
            // isIntersecting 是否进入可视区
            if (isIntersecting) {
                stop()
                // 调用传进来的api函数 获取数据
                apiFn().then(data => {
                    result.value = data.result
                })
            }
        },
        //  threshold: 0   只要dom盒子与可视区相交就触发加载数据
        {
            threshold: 0.05
        }
    )
    return result
}

/**
 * 支付倒计时函数
 * @param {Integer} countdown -倒计时的秒数
 */
export const usePayTime = () => {
    // 倒计时逻辑
    const time = ref(0);
    const timeText = ref('')
    const { pause, resume } = useIntervalFn(
        () => {
            time.value--;
            timeText.value = dayjs.unix(time.value).format('mm分ss秒')
            // console.log(time.value);
            if (time.value <= 0) {
                pause();
            }
        },1000,false);
    onUnmounted(() => {
        pause()
    })
    // 开启定时器  countdown倒计时时间
    const start = (countdown) => {
        time.value = countdown
        timeText.value = dayjs.unix(time.value).format('mm分ss秒')
        resume()
    }
    return {
        start,timeText
    }
} 