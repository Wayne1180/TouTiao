<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar
      title="编辑资料"
      left-arrow
      @click-left="$router.back()"
      fixed
    />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image
            round
            class="avatar"
            :src="profileObj.photo"
            @click="imageClickFn"
          />
          <!-- file 选择框 -->
          <input
            type="file"
            ref="iptFile"
            v-show="false"
            accept="image/*"
            @change="onFileChange"
          />
        </template>
      </van-cell>
      <van-cell
        title="名称"
        is-link
        :value="profileObj.name"
        @click="nameClickFn"
      />
      <van-cell
        title="生日"
        is-link
        :value="profileObj.birthday"
        @click="birthdayClickFn"
      />
    </van-cell-group>

    <!-- 姓名修改的弹窗 -->
    <van-dialog
      v-model="show"
      title="标题"
      show-cancel-button
      :before-close="beforeCloseFn"
    >
      <input type="text" v-focu v-model="inputUserName" />
    </van-dialog>

    <!-- 时间选择器 -->
    <van-popup
      round
      v-model="dateTimePickerShow"
      position="bottom"
      :style="{ height: '50%' }"
      ><van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="dateCancelFn"
        @confirm="confirmFn"
    /></van-popup>
  </div>
</template>

<script>
import {
  userProfileAPI,
  updateUserPhotoAPI,
  updateUserProfileAPI,
} from "@/api";
import Notify from "@/ui/Notify";
import { formatDate } from "@/utils/date";
export default {
  name: "UserEdit",
  data() {
    return {
      profileObj: {}, // 用户基本资料
      show: false, // 控制姓名修改输入框出现/隐藏
      inputUserName: "", // 修改名字弹出框绑定的值
      minDate: new Date(1950, 0, 1), // 最小范围
      maxDate: new Date(), // 最大范围(默认获取系统日期：今日)
      currentDate: new Date(), // 当前时间
      dateTimePickerShow: false, // 日期选择器-弹出层显示/隐藏
    };
  },
  async created() {
    const res = await userProfileAPI();
    this.profileObj = res.data.data;
  },
  methods: {
    // 文件选择改变-事件
    async onFileChange(e) {
      if (e.target.files.length === 0) return; // 用户可能没有选择图片文件，阻止代码往下
      // 创建FormData对象
      const theFd = new FormData();
      theFd.append("photo", e.target.files[0]); // 请求体里加入一对参数名和值
      const res = await updateUserPhotoAPI(theFd);
      this.profileObj.photo = res.data.data.photo;
    },
    // 图片点击事件
    imageClickFn() {
      this.$refs.iptFile.click(); // JS模拟标签的事件触发
    },
    // 姓名-点击事件
    nameClickFn() {
      this.show = true;
      this.inputUserName = this.profileObj.name;
    },
    // 姓名-确认框-关闭前回调函数
    async beforeCloseFn(action, done) {
      if (action === "confirm") {
        // 点击了确定
        let reg = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,7}$/;
        if (reg.test(this.inputUserName) === true) {
          // 通过了校验
          await updateUserProfileAPI({
            name: this.inputUserName,
          });
          this.profileObj.name = this.inputUserName;
          done();
        } else {
          // 没通过校验，给用户提示
          Notify({ type: "warning", message: "用户名只能是1-7位中英数字组合" });
          done(false);
        }
      } else {
        // 点击了取消
        done();
      }
    },
    // 生日的点击事件
    birthdayClickFn() {
      this.dateTimePickerShow = true; // 时间选择器出现
      // 数据和页面显示 年月日 格式的字符串    而组件要的是日期对象
      this.currentDate = new Date(this.profileObj.birthday);
    },
    // 日期选择器取消事件
    dateCancelFn() {
      this.dateTimePickerShow = false;
    },
    // 日期选择器完成确认事件
    async confirmFn() {
      // 日期选择器组件里currentdate是日期对象，而后端要的是字符串
      await updateUserProfileAPI({
        birthday: formatDate(this.currentDate),
      });
      this.profileObj.birthday = formatDate(this.currentDate); // 回写
      this.dateTimePickerShow = false;
    },
  },
};
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}

// ::v-deep .van-dialog__content {
:deep(.van-dialog__content) {
  // :deep .van-dialog__content {
  text-align: center;
  input {
    padding: 0;
    outline: none;
    border: none;
    text-align: center;
  }
}
</style>
