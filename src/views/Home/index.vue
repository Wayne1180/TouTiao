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
      <!-- 编辑频道图标 -->
      <van-icon
        name="plus"
        size="0.37333334rem"
        class="moreChannels"
        @click="plusClickFn"
      ></van-icon>
    </div>
    <!-- 频道管理弹出层 -->
    <van-popup v-model="show" class="channel_popup">
      <ChannelEdit
        :userList="userChannelList"
        :unCheckList="unCheckChannelList"
        @addChannelEV="addChannelFn"
        @removeChannelEV="removeChannelFn"
        @closeEV="closeFn"
        ref="editRef"
        v-model="channelId"
      />
    </van-popup>
  </div>
</template>

<script>
import {
  getAllChannelsAPI,
  getUserChannelsAPI,
  updateChannelsAPI,
  removeTheChannelAPI,
} from "@/api";
import ArticleList from "@/views/Home/components/ArticleList";
import ChannelEdit from "@/views/Home/ChannelEdit";
//获取不同的文章列表，需要传递不同的id
export default {
  methods: {},
  data() {
    return {
      channelId: 0, //tab导航 激活频道ID  默认频道id为0，页面刚打开是推荐频道高亮，对应文章数据
      userChannelList: [], //用户选择的频道列表
      allChannelList: [], // 所有频道列表
      // articleList: [], // 文章列表
      show: false, // 频道弹出层显示/隐藏
    };
  },
  async created() {
    //获取用户频道列表
    const res = await getUserChannelsAPI();
    // console.log(res);
    this.userChannelList = res.data.data.channels;
    //获取文章列表
    // this.channelChangeFn();

    // 所有频道列表
    const res2 = await getAllChannelsAPI();
    // console.log(res2);
    this.allChannelList = res2.data.data.channels;
  },
  components: {
    ArticleList,
    ChannelEdit,
  },
  computed: {
    unCheckChannelList() {
      // 目标：把所有的频道数组挨个对象取出，去用户已选频道数组里查找，如果找不到，则让filter方法收集到一个新数组里面
      // const newArr = this.allChannelList.filter((bigObj) => {
      //   const index = this.userChannelList.findIndex((smallObj) => {
      //     return smallObj.id === bigObj.id;
      //   });

      //   // 如果找到了
      //   if (index > -1) {
      //     return false;
      //   } else {
      //     return true;
      //   }
      // });
      // return newArr;
      return this.allChannelList.filter(
        (bigObj) =>
          this.userChannelList.findIndex(
            (smallObj) => smallObj.id === bigObj.id
          ) === -1
      );
    },
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
    // +号点击方法
    plusClickFn() {
      this.show = true;
    },
    //添加频道
    async addChannelFn(channelObj) {
      this.userChannelList.push(channelObj);
      // 还要把最新的数组发送给后台
      // 数组里对象字段 转换
      // 推荐频道不能传递 删除出不是推荐频道剩下的频道对象
      const newArr = this.userChannelList.filter((obj) => obj.id !== 0);
      const theNewArr = newArr.map((obj, index) => {
        const newObj = { ...obj }; // 浅拷贝
        delete newObj.name;
        newObj.seq = index;
        return newObj; // 让map方法把新对象收集起来形成一个新数组
      });
      const res = await updateChannelsAPI({
        channels: theNewArr,
      });
    },
    // 删除频道
    async removeChannelFn(channelObj) {
      const index = this.userChannelList.findIndex(
        (obj) => obj.id === channelObj.id
      );
      this.userChannelList.splice(index, 1);

      const res = await removeTheChannelAPI({
        channelId: channelObj.id,
      });
    },
    // 关闭弹出层
    closeFn() {
      this.show = false;
      // 让内部的编辑状态回归false
      // this.$refs.editRef.isEdit = false;
    },
  },
};
</script>

<style scoped lang="less">
.logo {
  width: 100px;
  height: 30px;
}
.main {
  padding-top: 46px;
}
/* // 设置 tabs 容器的样式 */
/deep/ .van-tabs__wrap {
  padding-right: 30px;
  background-color: #fff;
}

/* // 设置小图标的样式 */
.moreChannels {
  position: fixed;
  top: 62px;
  right: 8px;
  z-index: 999;
}
.channel_popup {
  width: 100vw;
  height: 100vh;
  // vw和vh是css3新出的单位，参考浏览器窗口的百分比
}
</style>