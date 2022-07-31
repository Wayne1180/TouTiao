<template>
  <div>
    <!-- 评论列表 -->
    <div
      class="cmt-list"
      :class="{
        'art-cmt-container-1': isShowCmtBox,
        'art-cmt-container-2': !isShowCmtBox,
      }"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多评论了，请发表评论"
        @load="onLoad"
        :immediate-check="false"
      >
        <!-- 评论的 Item 项 -->
        <div class="cmt-item" v-for="obj in commentArr" :key="obj.com_id">
          <!-- 头部区域 -->
          <div class="cmt-header">
            <!-- 头部左侧 -->
            <div class="cmt-header-left">
              <img :src="obj.aut_photo" alt="" class="avatar" />
              <span class="uname">{{ obj.aut_name }}</span>
            </div>
            <!-- 头部右侧 -->
            <div class="cmt-header-right">
              <van-icon
                name="like"
                size="16"
                color="red"
                v-if="obj.is_liking"
                @click="likingedFn(true, obj)"
              />
              <van-icon
                name="like-o"
                size="16"
                color="gray"
                v-else
                @click="likingedFn(false, obj)"
              />
            </div>
          </div>
          <!-- 主体区域 -->
          <div class="cmt-body">
            {{ obj.content }}
          </div>
          <!-- 尾部区域 -->
          <div class="cmt-footer">{{ timeAgo(obj.pubdate) }}</div>
        </div>
      </van-list>
    </div>
    <!-- 发表评论的容器 -->
    <div>
      <!-- 底部添加评论区域 - 1 -->
      <div class="add-cmt-box van-hairline--top" v-if="isShowCmtBox === true">
        <van-icon name="arrow-left" size="0.48rem" @click="$router.back()" />
        <div class="ipt-cmt-div" @click="toggleShowFn">发表评论</div>
        <div class="icon-box">
          <van-badge :content="totalCount === 0 ? '' : totalCount" max="99">
            <van-icon
              name="comment-o"
              size="0.53333334rem"
              @click="commentClickFn"
            />
          </van-badge>
          <van-icon name="star-o" size="0.53333334rem" />
          <van-icon name="share-o" size="0.53333334rem" />
        </div>
      </div>

      <!-- 底部添加评论区域 - 2 -->
      <div class="cmt-box van-hairline--top" v-else>
        <textarea
          placeholder="友善评论、理性发言、阳光心灵"
          v-focu
          @blur="blurFn"
          v-model.trim="comText"
        ></textarea>
        <van-button type="default" :disabled="!comText" @click="sendFn"
          >发布</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import {
  commentsListAPI,
  likeCommentAPI,
  unLikeCommentAPI,
  commentSendAPI,
} from "@/api";
import { timeAgo } from "@/utils/date.js";
export default {
  data() {
    return {
      offset: null, // 偏移量评论ID
      commentArr: [], // 评论列表
      isShowCmtBox: true, // 底部显示低/高容器
      totalCount: "", // 评论的数量
      comText: "", // 发布评论的内容
      loading: false,
      finished: false,
      lastId: null, //分页
    };
  },
  async created() {
    const res = await commentsListAPI({
      id: this.$route.query.art_id, // 文章id
    });
    this.commentArr = res.data.data.results;
    this.totalCount = res.data.data.total_count; // 总数量
    this.lastId = res.data.data.last_id; // 分页

    // 如果网页打开没有评论，res结果空数组
    if (res.data.data.results.length === 0) {
      this.finished = true;
    }
  },
  methods: {
    timeAgo,
    async likingedFn(bool, obj) {
      if (bool === true) {
        // 要取消点赞
        obj.is_liking = false;
        console.log(obj);
        const res = await unLikeCommentAPI({
          comId: obj.com_id,
        });
      } else {
        //点赞
        obj.is_liking = true;
        console.log(obj);
        const res = await likeCommentAPI({
          comId: obj.com_id,
        });
      }
    },
    toggleShowFn() {
      this.isShowCmtBox = false;
    },
    // 评论按钮的点击事件 把第一条评论滑动到最上面
    commentClickFn() {
      // 只要设置window.scrollTo(0, 文章内容高度)
      // JS代码是在html+css运行后，真实DOM已经在网页上了，从document往下获取标签是ok的

      // const articleHeight =
      //   document.querySelector(".article-container").scrollHeight;
      // window.scrollTo(0, articleHeight);

      // css可以做动画：例如轮播图，css3位移，旋转，动画（你必须修改css属性才能触发css动画  使用：animation配合帧动画 ， transition 过渡动画

      // js也可以做动画：滚动条滚动...  使用： 计时器间隔时间，修改目标状态，（动画片一样）

      // 比较方便的方法（既能滚动也能带动画）
      // 原生标签.scrollIntoView(), 让原生的标签滚动到屏幕的最上面
      // 为何选择like-box不选择第一条评论，因为头部导航会挡住
      document.querySelector(".like-box").scrollIntoView({
        befavior: "smooth",
      });
    },
    // 发布按钮的点击事件
    async sendFn() {
      // 前端效果：把评论加入到列表里
      const res = await commentSendAPI({
        id: this.$route.query.art_id,
        content: this.comText,
      });
      this.commentArr.unshift(res.data.data.new_obj);
      this.comText = "";
      this.totalCount++;
      this.commentClickFn(); // 让第一条评论滚动到屏幕上
    },
    // 输入框失去焦点
    blurFn() {
      // 问题：点击发布按钮，发现点击事件不执行。 原因： 高的评论容器-在页面点击发布一瞬间，输入框失去了焦点，被v-if和v-else移除了整个标签
      // 导致点击事件没来得及执行  解决：失去焦点时，变量值，在最后再执行
      setTimeout(() => {
        this.isShowCmtBox = true;
      }, 0);
    },
    // 底部加载更多
    async onLoad() {
      if (this.commentArr.length > 0) {
        // 请求下一页数据
        const res = await commentsListAPI({
          id: this.$route.query.art_id, // 文章id
          offset: this.lastId,
        });
        this.commentArr = [...this.commentArr, ...res.data.data.results];
        this.totalCount = res.data.data.total_count; // 总数量
        this.lastId = res.data.data.last_id; // 分页

        if (res.data.data.last_id === null) {
          // 没有下一页了
          this.finished = true;
        }
        this.loading = false;
      } else {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped lang="less">
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}
/*美化 - 文章详情 - 底部的评论页面 */
// 外层容器
.art-cmt-container-1 {
  padding-bottom: 46px;
}
.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
</style>