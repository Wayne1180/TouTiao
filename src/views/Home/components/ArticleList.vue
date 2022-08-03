<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh"
      ><van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
        offset="50"
      >
        <ArticleItem
          v-for="obj in list"
          :key="obj.art_id"
          :artObj="obj"
          @disLikeEV="disLikeFn"
          @reportEV="reportFn"
          @click.native="itemClickFn(obj.art_id)" /></van-list
    ></van-pull-refresh>
  </div>
</template>

<script>
import ArticleItem from "@/components/ArticleItem";
import {
  getAllArticleListAPI,
  dislikeArticleAPI,
  reportArticleAPI,
} from "@/api";
import Notify from "@/ui/Notify";

// 问题 网页刚打开，created和onload里请求同时发送，请求的都是最新数据   两次一样的数据一合并，数据重复，key重复了   原因  组件挂载时就会判定一次是否触底
export default {
  props: {
    // list: Array, //文章列表数组
    channelId: Number, //频道ID
  },
  data() {
    return {
      list: [], // 文章列表数组
      loading: false, // 底部加载状态
      finished: false, //底部完成状态
      theTime: new Date().getTime(), // 用于分页
      isLoading: false, // 顶部加载状态
    };
  },
  components: {
    ArticleItem,
  },
  async created() {
    this.getArticleListFn();
  },
  methods: {
    // 专门负责发送请求
    async getArticleListFn() {
      const res = await getAllArticleListAPI({
        channel_id: this.channelId, //先默认请求推荐频道数据
        timestamp: this.theTime,
      });
      // created 上来第一次list是空数组，合并空数组没问题
      this.list = [...this.list, ...res.data.data.results];
      this.theTime = res.data.data.pre_timestamp;
      this.loading = false;
      if (res.data.data.pre_timestamp === null) {
        this.finished = true;
      }
      // 顶部加载状态改为false
      this.isLoading = false;
    },
    //底部加载事件方法
    onLoad() {
      if (this.list.length === 0) {
        this.loading = false;
        return;
      }
      this.getArticleListFn();
    },
    //顶部 刷新数据事件方法
    onRefresh() {
      //目标：list数组清空，来一个新的数据
      this.list = [];
      this.theTime = new Date().getTime();
      this.getArticleListFn();
    },
    //反馈不感兴趣
    async disLikeFn(id) {
      try {
        await dislikeArticleAPI({
          artId: id,
        });
        Notify({ type: "success", message: "反馈成功" });
      } catch (error) {
        console.log(error);
      }
    },
    //反馈垃圾内容
    async reportFn(id, value) {
      await reportArticleAPI({
        artId: id,
        type: value,
      });
      Notify({ type: "danger", message: "举报成功" });
    },
    // 跳转到详情页面
    itemClickFn(id) {
      this.$router.push({
        path: `/detail?art_id=${id}`,
      });
    },
  },
};
</script>

<style>
</style>