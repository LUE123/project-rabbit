<template>
  <Form class="xtx-form" :validation-schema='mySchema' v-slot='{errors}' autocomplete="off" ref="formCom">
    <div class="user-info">
      <img :src="avatar" alt="" />
      <p>Hi，{{nickname}} 欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~</p>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field v-model="form.mobile" name="mobile" class="input" type="text" placeholder="绑定的手机号" />
      </div>
      <div class="error" :class="{err:errors.mobile}" v-if="errors.mobile">{{errors.mobile}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field v-model="form.code" name="code" class="input" type="text" placeholder="短信验证码" />
        <span @click="send()" class="code">
              {{ time === 0 ? "发送验证码" : `${time}秒后发送` }}
            </span>
      </div>
      <div class="error" :class="{err:errors.code}" v-if="errors.code">{{errors.code}}</div>
    </div>
    <a @click="submit()" href="javascript:;" class="submit">立即绑定</a>
  </Form>
</template>

<script>
import QC from 'qc'
import { ref, reactive, onUnmounted} from 'vue'
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import { useIntervalFn } from '@vueuse/core'
import Message from '@/components/library/Message'
import { userQQBindCode, userQQBindLogin } from '@/api/user'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
export default {
  name: 'CallbackBind',
  components:{Form,Field},
  props:{
    unionId:{
      type:String,
      default:''
    }
  },
  setup(props){
    // 1. 准备信息：unionId(openId)  头像 昵称
    // 2. 完成表单校验
    // 3. 发送验证码 （校验，再定义API，调用，完成倒计时）
    // 4. 进行绑定（绑定成功就是登陆成功）
    // 已经登陆
    const nickname = ref('null')
    const avatar = ref('null')
    if(QC.Login.check()){
      QC.api('get_user_info').success(res=>{
        // 头像 昵称
        avatar.value = res.data.figureurl
        nickname.value = res.data.nickname
      })
    }

    // 表单数据对象
    const form = reactive({
      mobile:null,
      code:null
    })

    // 校验规则对象
    const mySchema = {
      mobile:schema.mobile,
      code:schema.code
    }

    // 发送短信验证码
     // usevue中的定时器
    // pause暂停  resume开始
    // useIntervalFn(回调函数，执行间隔，是否立即开启)
    const formCom = ref(null)
    const time = ref(0);
    const { pause, resume } = useIntervalFn(
      () => {
        time.value--;
        if (time.value <= 0) {
          pause();
        }
      },
      1000,
      false
    );
    // 清除定时器
    onUnmounted(() => {
      pause();
    });

    // 发送短信
    // 1. 发送验证码
    // 1.1 绑定发送验证码按钮点击事件
    // 1.2 校验手机号 成功：发送短信（定义API） 成功后开启60秒的倒计时  期间不能再次点击
    // 1.3 失败：失败的校验样式显示
    const send = async () => {
      // 校验手机号 valid ===> true  ||  error
      const valid = mySchema.mobile(form.mobile);
      if (valid === true) {
        // 校验通过
        if (time.value === 0) {
          // 没有倒计时才可以发送请求
          await userQQBindCode(form.mobile);
          Message({ type: "success", text: "短信验证码已发送" });
          time.value = 60;
          resume();
        }
      } else {
        // 失败 触发 vee的错误函数 显示错误信息 setFieldError(字段名称，错误信息)
        formCom.value.setFieldError("mobile", valid);
      }
    };

    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    // 立即绑定
    const submit = async () =>{
      // Form组件提供了一个 validate 函数作为整体表单校验但是返回的是一个Promoise
      const valid = formCom.value.validate()
      // 校验通过
      if(valid){
      userQQBindLogin({ 
          unionId:props.unionId, 
          mobile:form.mobile, 
          code:form.code 
        }).then(data=>{
          // 绑定成功
          // 实现与之前登陆一样的逻辑
          // 1.存储用户信息
          // 解构出请求结果
          const { id, account, avatar, mobile, nickname, token } = data.result;
          // 存储用户信息
          store.commit("user/setUser", {id,account,avatar,mobile,nickname,token});
          console.log(route.query.redirectUrl);
          store.dispatch('cart/mergeCart').then(()=>{
          // 2.进行跳转   跳转至来源页route.query.redirectUrl 或 首页
          router.push(store.state.user.redirectUrl);
          // 3.消息提示
          Message({ type: "success", text: "登陆成功" });
          }).catch(e=>{
            console.log(e);
          })
        }).catch(e=>{
          Message({type:'error',text:'绑定失败'})
        })
      }

    }

    return { avatar, nickname, form, mySchema, send, time, formCom, submit }
  }
}
</script>

<style scoped lang='less'>
.user-info {
    width: 320px;
    height: 70px;
    margin: 0 auto;
    display: flex;
    background: #f2f2f2;
    align-items: center;
    padding: 0 10px;
    margin-bottom: 25px;
    img {
      background: #f2f2f2;
      width: 50px;
      height: 50px;
    }
    p {
      padding-left: 10px;
    }
  }
  .code {
    position: absolute;
    right: 0;
    top: 0;
    line-height: 50px;
    width: 80px;
    color: #999;
    &:hover {
      cursor: pointer;
    }
  }
</style>