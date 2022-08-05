<template>
  <Form class="xtx-form" :validation-schema='mySchema' v-slot='{errors}' autocomplete="off" ref="formCom">
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field :class="{err:errors.account}" name="account" v-model="form.account" class="input" type="text" placeholder="请输入用户名" />
      </div>
      <div class="error" v-if='errors.account'>{{errors.account}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field :class="{err:errors.mobile}" name="mobile" v-model="form.mobile" class="input" type="text" placeholder="请输入手机号" />
      </div>
       <div class="error" v-if='errors.mobile'>{{errors.mobile}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field :class="{err:errors.code}" name="code" v-model="form.code" class="input" type="text" placeholder="请输入验证码" />
        <span @click="send()" class="code">
          {{ time === 0 ? "发送验证码" : `${time}秒后发送` }}
        </span>
      </div>
      <div class="error" v-if='errors.code'>{{errors.code}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field :class="{err:errors.password}" name="password" v-model="form.password" class="input" type="password" placeholder="请输入密码" />
      </div>
       <div class="error" v-if='errors.password'>{{errors.password}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field :class="{err:errors.rePassword}" name="rePassword" v-model="form.rePassword" class="input" type="password" placeholder="请确认密码" />
      </div>
       <div class="error" v-if='errors.rePassword'>{{errors.rePassword}}</div>
    </div>
    <a @click="submit()" href="javascript:;" class="submit">立即提交</a>
  </Form>
</template>

<script>
import { ref, reactive, onUnmounted} from 'vue'
import { Form, Field } from 'vee-validate'
import schema  from '@/utils/vee-validate-schema'
import { useIntervalFn } from '@vueuse/core'
import Message from '@/components/library/Message'
import { userQQPatchCode, userQQPatchLogin } from '@/api/user'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
export default {
  name: 'CallbackPatch',
  components:{Form, Field},
  props:{
    unionId:{
      type:String,
      default:''
    }
  },
  setup(props){
    // 1.表单校验 多两个校验：用户名是否存在 再次输入密码是否一致
    // 2.发送短信验证码：发送的接口API定义
    // 3.完善信息
    // 表单数据对象
    const form = reactive({
      account:null,
      mobile:null,
      code:null,
      password:null,
      rePassword:null
    })
    // 表单校验对象
    const mySchema = {
      account:schema.accountApi,
      mobile:schema.mobile,
      code:schema.code,
      password:schema.password,
      rePassword:schema.rePassword
    }

    //----------------------------------------------------------------------
    // 
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
          await userQQPatchCode(form.mobile);
          Message({ type: "success", text: "短信验证码已发送" });
          time.value = 60;
          resume();
        }
      } else {
        // 失败 触发 vee的错误函数 显示错误信息 setFieldError(字段名称，错误信息)
        formCom.value.setFieldError("mobile", valid);
      }
    }; 

    // 立即提交------------------------------------------------------------------------------------
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    // 立即绑定
    const submit = async () =>{
      // Form组件提供了一个 validate 函数作为整体表单校验但是返回的是一个Promoise
      const valid = formCom.value.validate()
      // 校验通过
      if(valid){
      userQQPatchLogin({ 
          unionId:props.unionId, 
          ...form
        }).then(data=>{
          // 绑定成功
          // 实现与之前登陆一样的逻辑
          // 1.存储用户信息
          // 解构出请求结果
          const { id, account, avatar, mobile, nickname, token } = data.result;
          // 存储用户信息
          store.commit("user/setUser", {id,account,avatar,mobile,nickname,token});
          store.dispatch('cart/mergeCart').then(()=>{
          // 2.进行跳转   跳转至来源页route.query.redirectUrl 或 首页
          router.push(store.state.user.redirectUrl);
          // 3.消息提示
          Message({ type: "success", text: "登陆成功" });
          })
        }).catch(e=>{
          Message({type:'error',text:'完善信息失败'})
        })
      }

    }


    return { Form, Field, form, mySchema, send, formCom, time, submit, }
  }
}
</script>

<style scoped lang='less'>
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
