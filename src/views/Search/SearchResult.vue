<template>
  <div>
    <!-- 搜索结果页-头部导航 -->
    <div class="search-result-container">
      <!-- 点击实现后退效果 -->
      <van-nav-bar
        title="搜索结果"
        left-arrow
        @click-left="$router.go(-1)"
        fixed
      />
    </div>
    <!-- 文章列表 -->
    <div>
      <!-- :error.sync="error"
        error-text="请求失败，点击重新加载" -->
      <van-list v-model="loading" @load="onLoad" :immediate-check="false">
        <ArticleItem
          v-for="obj in articleList"
          :key="obj.art_id"
          :artObj="obj"
          :isShow="false"
          @click.native="itemClickFn(obj.art_id)"
      /></van-list>
    </div>
  </div>
</template>

<script>
// 事件修饰符.native 给组件内根标签，绑定原生click点击事件
import { searchResultAPI } from "@/api";
import ArticleItem from "@/components/ArticleItem";
export default {
  name: "SearchResult",
  data() {
    return {
      page: 1, // 页码
      articleList: [], // 文章列表
      loading: false, // 加载状态
      finished: false, // 是否全部加载完成
    };
  },
  components: {
    ArticleItem,
  },
  async created() {
    const res = await searchResultAPI({
      page: this.page,
      q: this.$route.params.kw,
    });
    this.articleList = res.data.data.results;
  },
  methods: {
    async onLoad() {
      if (this.articleList.length > 0) {
        this.page++;
        const res = await searchResultAPI({
          page: this.page,
          q: this.$route.params.kw,
        });
        if (res.data.data.results.length === 0) {
          // 没有更多数据
          this.finished = true;
          return;
        }
        this.articleList = [...this.articleList, ...res.data.data.results];
        this.loading = false;
      }
    },
    // 跳转到详情
    itemClickFn(id) {
      this.$router.push({
        path: `/detail?art_id=${id}`,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
</style>
