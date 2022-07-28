<template>
  <div>
    <div>
      <van-nav-bar fixed>
        <template v-slot:left>
          <img src="@/assets/toutiao_logo.png" alt="" class="logo" />
        </template>
        <template #right>
          <van-icon name="search" size="0.48rem" color="#fff"></van-icon>
        </template>
      </van-nav-bar>
    </div>
    <div class="main">
      <van-tabs
        v-model="channelId"
        animated
        sticky
        offset-top="1.226667rem"
        @change="channelChangeFn"
      >
        <van-tab
          :title="obj.name"
          v-for="obj in userChannelList"
          :key="obj.id"
          :name="obj.id"
        >
          <ArticleList :channelId="channelId" />
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { getUserChannelsAPI } from "@/api";
import ArticleList from "@/views/Home/components/ArticleList";
//获取不同的文章列表，需要传递不同的id
export default {
  methods: {},
  data() {
    return {
      channelId: 0, //tab导航 激活频道ID  默认频道id为0，页面刚打开是推荐频道高亮，对应文章数据
      userChannelList: [], //用户选择的频道列表
      // articleList: [], // 文章列表
    };
  },
  async created() {
    //获取频道列表
    const res = await getUserChannelsAPI();
    // console.log(res);
    this.userChannelList = res.data.data.channels;
    //获取文章列表
    // this.channelChangeFn();
  },
  components: {
    ArticleList,
  },
  methods: {
    //tabs切换的事件 获取文章列表数据
    async channelChangeFn() {
      // const res2 = await getAllArticleListAPI({
      //   channel_id: this.channelId, //先默认请求推荐频道的数据
      //   timestamp: new Date().getTime(),
      // });
      // this.articleList = res2.data.data.results;
    },
  },
};
</script>

<style scoped>
.logo {
  width: 100px;
  height: 30px;
}
.main {
  padding-top: 46px;
}
</style>