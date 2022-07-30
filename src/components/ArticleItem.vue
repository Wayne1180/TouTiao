<template>
  <div>
    <!-- 一条文章单元格 -->
    <van-cell>
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span>{{ artObj.title }}</span>
          <!-- 单图 -->
          <!-- <img
            :src="artObj.cover.images"
            alt=""
            class="thumb"
            v-if="artObj.cover.type == 1"
          /> -->
          <van-image
            class="thumb"
            v-if="artObj.cover.type == 1"
            :src="artObj.cover.images[0]"
          >
            <template v-slot:error>图片加载失败</template>
          </van-image>
        </div>
        <!-- 多图 -->
        <div class="thumb-box" v-if="artObj.cover.type > 1">
          <!-- <img
            :src="imgUrl"
            alt=""
            v-for="(imgUrl, index) in artObj.cover.images"
            class="thumb"
            :key="index"
          /> -->
          <van-image
            :src="imgUrl"
            v-for="(imgUrl, index) in artObj.cover.images"
            class="thumb"
            :key="index"
          >
            <template v-slot:error>图片加载失败</template>
          </van-image>
        </div>
      </template>
      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <div>
            <span>{{ artObj.aut_name }}</span>
            <span>{{ artObj.comm_count }}评论</span>
            <span>{{ formatTime(artObj.pubdate) }}</span>
          </div>
          <!-- 反馈按钮 -->
          <van-icon name="cross" @click.stop="show = true" v-if="isShow" />
        </div>
      </template>
    </van-cell>
    <!-- 反馈面板 -->
    <van-action-sheet
      v-model="show"
      :actions="actions"
      @select="onSelect"
      :cancel-text="bottomText"
      get-container="body"
      @cancel="cancelFn"
      @close="closeFn"
    />
  </div>
</template>

<script>
// 点击“反馈垃圾内容” 数据切换
// 监听点击事件，区分用户点击的是哪一个
// 切换actions数组里的数据
import { timeAgo } from "@/utils/date";
import { firstActions, secondActions } from "@/api/report.js";
export default {
  data() {
    return {
      show: false, // 反馈面板显示或隐藏
      actions: firstActions,
      bottomText: "取消", // 底部按钮的文字
    };
  },
  props: {
    artObj: Object, //文章的对象
    isShow: {
      type: Boolean,
      default: true, // 例如首页的地方，默认显示x
    },
  },
  methods: {
    formatTime: timeAgo, // 函数体是timeAgo
    onSelect(action, item) {
      // action绑定的是name   item是索引值
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      // this.show = false;

      //判断
      if (action.name == "反馈垃圾内容") {
        this.actions = secondActions;
        this.bottomText = "返回";
      } else if (action.name === "不感兴趣") {
        this.$emit("disLikeEV", this.artObj.art_id);
        this.show = false; // 无论成功或失败，直接让反馈面板隐藏
      } else {
        //二级反馈选项
        this.$emit("reportEV", this.artObj.art_id, action.value);
        this.show = false;
      }
    },
    // 底部按钮 点击事件
    cancelFn() {
      if (this.bottomText === "返回") {
        this.show = true; // 强制让他回来
        this.actions = firstActions;
        this.bottomText = "取消";
      }
    },
    // 关闭面板 触发事件
    closeFn() {
      this.actions = firstActions;
      this.bottomText = "取消";
    },
  },
};
</script>

<style scoped lang="less">
/* 标题样式 */
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* label描述样式 */
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 文章信息span */
.label-box span {
  margin: 0 3px;
  &:first-child {
    margin-left: 0;
  }
}
/* 图片的样式, 矩形黄金比例：0.618 */
.thumb {
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

/* 三图, 图片容器 */
.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>