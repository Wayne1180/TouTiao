<template>
  <div>
    <van-nav-bar title="登录"></van-nav-bar>
    <div>
      <van-form @submit="onSubmit">
        <van-field
          v-model="user.mobile"
          required
          name="mobile"
          label="手机号"
          placeholder="请输入11位手机号"
          :rules="[
            {
              required: true,
              message: '请填写手机号',
              pattern: /^1[3-9]\d{9}$/,
            },
          ]"
        />
        <van-field
          v-model="user.code"
          required
          type="password"
          name="code"
          label="密码"
          placeholder="请输入6位密码"
          :rules="[
            { required: true, message: '请填写密码', pattern: /^\d{6}$/ },
          ]"
        />
        <div style="margin: 16px">
          <van-button
            round
            block
            type="info"
            native-type="submit"
            :loading="isLoading"
            loading-text="正在登录ing..."
            :disabled="isLoading"
            >登录</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { loginAPI } from "@/api";
import { setToken } from "@/utils/token";
import Notify from "@/ui/Notify.js";
import { setStorage } from "@/utils/storage";
export default {
  data() {
    return {
      user: {
        mobile: "13888888888",
        code: "246810", //验证码(密码)246810
      },
      isLoading: false, //登录按钮-加载状态
    };
  },
  methods: {
    async onSubmit(values) {
      this.isLoading = true;
      try {
        const res = await loginAPI(this.user);
        // console.log(res);
        Notify({ type: "success", message: "登录成功!" });
        setToken(res.data.data.token);
        setStorage("refresh_token", res.data.data.refresh_token);
        // 跳转一定要写在最后，尽量最后执行
        this.$router.replace({
          path: this.$route.query.path || "/layout/home", //因为我们路由规则里layout没有重定向，所以直接在这写全
        });
      } catch (error) {
        Notify({ type: "danger", message: "账号或密码错误" });
      }
      this.isLoading = false;
    },
  },
};
</script>

<style scoped lang="less">
// .van-nav-bar {
//   background-color: rgb(251, 51, 64);
// }
// /deep/ .van-nav-bar__title {
//   color: #fff !important;
// }
</style>
