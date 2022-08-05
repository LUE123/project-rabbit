<template>
  <LoginHeader>联合登陆</LoginHeader>
  <section class="container"  v-if="isBind">
    <div class="unbind">
      <div class="loading"></div>
    </div>
  </section>
  <section class="container" v-else>
    <nav class="tab">
      <a
        @click="hasAccount = true"
        :class="{ active: hasAccount }"
        href="javascript:;"
      >
        <i class="iconfont icon-bind" />
        <span>已有小兔鲜账号，请绑定手机</span>
      </a>
      <a
        @click="hasAccount = false"
        :class="{ active: !hasAccount }"
        href="javascript:;"
      >
        <i class="iconfont icon-edit" />
        <span>没有小兔鲜账号，请完善资料</span>
      </a>
    </nav>
    <div class="tab-content" v-if="hasAccount">
      <CallbackBind :unionId='unionId' />
    </div>
    <div class="tab-content" v-else>
      <CallbackPatch :unionId='unionId' />
    </div>
  </section>
  <LoginFooter />
</template>

<script>
import LoginHeader from "./components/login-header.vue";
import LoginFooter from "./components/login-footer.vue";
import CallbackBind from "./components/callback-bind.vue";
import CallbackPatch from "./components/callback-patch.vue";
import { ref } from "vue";
import QC from "qc";
import { userQQLogin } from "@/api/user";
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import Message from '@/components/library/Message';
export default {
  name: "LoginCallback",
  components: { LoginHeader, LoginFooter, CallbackBind, CallbackPatch },
  setup() {
    const hasAccount = ref(true);

    // 首先：默认认为已经注册且已经绑定
    // 通过QQ的API获取openId就是后台需要的unionId然后进行登陆
    // 如果成功：登陆成功
    // 如果失败：该QQ未和小兔鲜进行绑定（有账号未绑定QQ，没有账号为绑定QQ）
    const isBind = ref(true);
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const unionId = ref(null)

        // 判断QQ是否登陆
    if (QC.Login.check()) {
      // 第三方唯一标识
      QC.Login.getMe((openId) => {
        // 请求后台，做QQ登陆
        unionId.value = openId
        userQQLogin(openId).then((data) => {
          // 登陆成功 data.result：用户信息对象
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
          }).catch((e) => {
            // 登陆失败：该QQ未和小兔鲜进行绑定（有账号未绑定QQ，没有账号为绑定QQ）
            isBind.value = false;
          });
      });
    }
    return { hasAccount, isBind, unionId};
  },
};
</script>

<style scoped lang='less'>
.container {
  padding: 25px 0;
    height: 730px;  
  position: relative;
    .unbind {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 25px 0;
    z-index: 99;
    .loading {
      height: 100%;
      background: #fff url(../../assets/images/load.gif) no-repeat center / 100px 100px;
    }
  }
}
.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;
  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 4px;
    }
    &.active {
      color: @xtxColor;
      border-color: @xtxColor;
    }
  }
}
.tab-content {
  min-height: 600px;
  background: #fff;
}
</style>