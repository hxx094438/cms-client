<template>
  <div id="comment">
    <div class="newComment">
      <div class="user">
        <img :src="gravatar(author.email) || '../../../../static/fuck.jpg'">
      </div>
      <div class="editor">
        <textarea
          spellcheck="false"
          placeholder="说点什么吧..."
          v-model="inputVaule"
          id="reply"
          ref="textBox"
        ></textarea>
        <div class="inputBox">
          <input type="text" placeholder="邮箱" v-model="author.email">
          <input type="text" placeholder="称呼" v-model="author.name" class="name" id="nameBox">
          <button @click="summit" :disabled="summitFlag">
            <span>{{summitFlag ? '提交中...' : '发布评论'}}</span>
          </button>
        </div>
      </div>
    </div>
    <div class="allComments">
      <div class="summary">
        <p>评论数 {{comments.length}}</p>
        <p>
          <span @click="getAllComments({articleId: $route.params.id})">最早</span>|
          <span @click="getAllComments({articleId: $route.params.id, sort: 'date'})">最新</span>|
          <span @click="getAllComments({articleId: $route.params.id, sort: 'like'})">最热</span>
        </p>
      </div>
      <div class="comments" v-for="(comment,index) in comments" :key="comment._id">
        <img class="avatar" :src="gravatar(comment.author.name) || '../../../../static/fuck.jpg'">

        <div class="info-box" :class="comment.imgName">
          <div class="commentName">
            <p class="index">#{{index + 1}}</p>
            <p>{{comment.author.name}}</p>
          </div>
          <div class="reply-box" v-if="comment.replyId">
            <p class="reply-name">
              <a>
                <strong>{{findReplyContent(comment.replyId).author.name}}</strong>
              </a>
            </p>
            <div class="reply-content">
              <p>
                {{findReplyContent(comment.replyId).content}}
              </p>
            </div>
          </div>
          <p class="text">{{comment.content}}</p>
          <div class="options">
            <p class="commentDate">{{comment.date | to_date}}</p>
            <a href="#comment" data-scroll>
              <span @click="reply(comment)">
                <i class="iconfont icon-huifu"></i>回复
              </span>
            </a>
            <p @click="addLike(comment._id, index)">
              <i class="iconfont icon-like" :class="{activeLike: likeArr.indexOf(index) !== -1}"></i>
              {{comment.like}}
            </p>
          </div>
        </div>
      </div>
      <p v-show="comments.length === 0" class="nocomment">还没有人评论&nbsp; :(</p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations, mapGetters } from "vuex";
import gravatar from "gravatar";
import { _debounce } from "../../../lib/utils.js";

export default {
  data() {
    return {
      inputVaule: "",
      imgName: "",
      summitFlag: false,
      regexs: {
        email: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
      },
      replyId: undefined,
      content: "",
      receiver: "", //接受回复的人
      author: {}
    };
  },

  mounted() {
    this.$set(this.author, "name", localStorage.getItem("reviewer"));
    this.$set(this.author, "email", localStorage.getItem("e-mail"));
  },

  // beforeMount() {
  //   console.log('beforemount')
  // },
  computed: {
    // ...mapGetters(['likes']),
    ...mapState({
      comments: state => state.article.comments,
      user: state => state.user,
      likeArr: state => state.article.likeArr,
      article: state => state.article.article
    })
  },
  methods: {
    ...mapActions({
      summitComment: "article/SUMMIT_COMMENT",
      getAllComments: "article/GET_ALL_COMMENTS",
      updateLike: "article/UPDATE_LIKE"
    }),

    gravatar(email) {
      if (!this.regexs.email.test(email)) return null;
      let gravatar_url = gravatar.url(email, {
        // size: '96',
        // rating: 'pg',
        // default: 'https://gravatar.surmon.me/anonymous.jpg',
        protocol: "https"
      });
      return gravatar_url;
    },
    updateUserGravatar() {
      const emailIsVerified = this.regexs.email.test(this.user.email);
      this.user.gravatar = emailIsVerified
        ? this.gravatar(this.user.email)
        : null;
    },

    findReplyContent(id) {
      let comment = this.comments.find(item => {
        return item.id === id
      })
      return comment  //todo: 这里可用mark解析一下
    },

    summit() {
      const re = /^[\w_-]+@[\w_-]+\.[\w\\.]+$/;
      if (!this.author.name || !this.content) {
        this.set_dialog({
          info: "还有选项没填"
        });
        return;
      } else if (!re.test(this.author.email)) {
        this.set_dialog({
          info: "请正确填写邮箱地址"
        });
        return;
      }
      // 限制评论内容
      if (this.content.length > 500) {
        this.set_dialog({
          info: "您的评论内容太长，要言简意赅哦"
        });
        return;
      } else if (this.content.length < 3) {
        this.set_dialog({
          info: "您的评论内容太短"
        });
        return;
      } else if (
        /\d{7,}/i.test(this.content) || // 连续7个以上数字，过滤发Q号和Q群的评论
        /(\d.*){7,}/i.test(this.content) || // 非连续的7个以上数字，过滤用字符间隔开的Q号和Q群的评论
        /\u52A0.*\u7FA4/i.test(this.content) || // 包含“加群”两字的通常是发Q群的垃圾评论
        /(\u9876.*){5,}/i.test(this.content) || // 过滤5个以上“顶”字的评论
        /([\u4E00\u4E8C\u4E09\u56DB\u4E94\u516D\u4E03\u516B\u4E5D\u25CB\u58F9\u8D30\u53C1\u8086\u4F0D\u9646\u67D2\u634C\u7396\u96F6].*){7,}/i.test(
          this.content
        ) // 过滤用汉字发Q号和Q群的评论
      ) {
        this.set_dialog({
          info: "涉及敏感信息！"
        });
        return;
      }

      this.summitFlag = true;
      // 将评论者的邮箱和用户名存储在浏览器中，在created钩子中赋值, 这样刷新后邮箱和昵称都不用再写一遍
      localStorage.setItem("e-mail", this.author.email);
      localStorage.setItem("reviewer", this.author.name);
      // localStorage.setItem('gravatar',this.gravatar)
      this.summitComment({
        imgName: this.imgName,
        content: this.content,
        articleId: this.$route.params.id,
        curPath: this.$route.fullPath, //为自动发送邮箱时带上的当前页面链接
        replyId: this.replyId,
        author: {
          name: this.author.name,
          email: this.author.email
        },
        agent: this.userAgent,
        ip: this.ip,
        city: this.city,
      })
        .then(() => {
          this.inputVaule = "";
          this.summitFlag = false;
          this.article.comment_n++;
          //重新加载评论列表
          this.getAllComments({ articleId: this.$route.params.id });
        })
        .catch(err => {
          this.summitFlag = false;
          this.set_dialog({
            info: err
          });
          this.summitFlag = false;
          this.author.name = "";
        });
    },

    reply(comment) {
      console.log("comment", comment,comment.id);
      this.inputVaule = "@" + comment.author.name + ": ";
      this.replyId = comment.id;
      this.$refs.textBox.focus();
    },

    addLike(id, index) {
      const i = this.likeArr.indexOf(index); //判断这个index是否存在数组中
      if (i === -1) {
        this.updateLike({ id: id, option: "add", index: index })
          .then(() => {
            this.likeArr.push(index); //将点赞索引加入数组中
            this.comments[index].like++;
            // this.getAllComments({id: this.$route.params.id})
            localStorage[this.$route.params.id] = JSON.stringify(this.likeArr); // 将点赞情况数组转化为对象保存在localStorage中
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.updateLike({ id: id, option: "drop", index: index })
          .then(() => {
            this.likeArr.splice(i, 1); //将取消点赞的索引从数组中移除
            this.comments[index].like--;
            //  this.getAllComments({id: this.$route.params.id})
            localStorage[this.$route.params.id] = JSON.stringify(this.likeArr); // 将点赞情况数组转化为对象保存在localStorage中
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  },
  watch: {
    $route(to, from) {
      // #article是跳到另一篇文章，将评论框清空，#目录标题是锚点跳转，不清空评论框
      to.hash === "#article" ? (content = "") : 0;
      this.getAllComments({ id: to.params.id });
    },
    inputVaule(val) {
      const matchArr = /^@(.*?):(.*)/.exec(val); //[1]匹配了子表达式(.*?)
      if (!matchArr) {
        this.content = val;
        this.replyId = undefined;
        return;
      }
      // this.receiver = matchArr[1];
      this.content = matchArr[2];
    }
  }
};
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
#comment {
  margin: 1.875rem auto 0.625rem;
  padding-top: 1.875rem;
  text-align: left;
  .newComment {
    display: flex;
    width: 100%;
    font-size: 1rem;
    .user {
      img {
        width: 3rem;
        height: 3rem;
        border: 0.0625rem solid #eee;
        border-radius: 0.625rem;
      }
    }
    .editor {
      flex-grow: 1;
      margin-left: 2rem;
      textarea {
        padding: 0.6rem;
        color: #666;
        border: 0.0625rem #eee solid;
        border-radius: 0.625rem;
        width: 100%;
        height: 6rem;
        resize: none;
        background: transparent;
        outline: none;
        box-sizing: border-box;
        &:hover {
          border-color: #8391a5;
          transition: all 0.8s;
        }
      }
      .inputBox {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        input {
          flex-grow: 1;
          margin-right: 1.5625rem;
          color: #999;
          padding: 0.3rem;
          border: 0.0625rem #eee solid;
          border-radius: 0.3125rem;
          outline: none;
          width: 12.5rem;
          height: 1.5625rem;
          margin-top: 0.625rem;
          margin-bottom: 0.625rem;
          display: inline-block;
          background: transparent;
          &:hover {
            border-color: #8391a5;
            transition: all 0.8s;
          }
        }
        button {
          width: 1rem;
          flex-grow: 1;
          margin-top: 0.625rem;
          margin-bottom: 0.625rem;
        }
      }
    }
  }
  .allComments {
    margin-top: 1.875rem;
    .summary {
      display: flex;
      justify-content: space-between;
      border-bottom: 0.0625rem solid #eee;
      padding: 0.625rem;
      border-radius: 0.3125rem;
      span {
        cursor: pointer;
        &:hover {
          color: #333;
        }
      }
    }
    .comments {
      position: relative;
      margin-top: 1.25rem;
      width: 100%;
      display: flex;
      .avatar {
        width: 3rem;
        height: 3rem;
        border-radius: 0.3125rem;
        margin-right: 1rem;
      }
      .info-box {
        border-radius: 0.3125rem;
        width: 100%;
        padding: 0.625rem;
        color: #666;
        flex: 1;
        .reply-box {
          padding: 0.8rem;
          margin-bottom: 0.8rem;
          border: 1px solid #eee;
          border-radius: 4px;
          .reply-name {
            color: #666;
            font-weight: bold;
            margin-bottom: 0.5rem;
            a {
              text-decoration: none;
              &:hover {
                text-decoration: underline;
              }
            }
          }
        }

        .commentName {
          font-size: 1rem;
          margin-bottom: 0.3125rem;
          font-weight: 600;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          p {
            color: #34495e;
          }
          .index {
            margin-right: 0.5rem;
            color: #999999;
          }
        }
        .text {
          font-size: 1rem;
          overflow: hidden;
          margin-top: 0.625rem;
          margin-bottom: 0.625rem;
        }
        .options {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          text-align: right;
          a {
            color: #999;
            margin-right: 0.625rem;
            i.icon-huifu {
              margin-right: 0.3125rem;
            }
            &:hover {
              color: #ff525b;
            }
          }
          p {
            display: inline-block;
            margin-right: 0.3125rem;
            cursor: pointer;
            &:hover {
              color: #d15c5c;
            }
          }
        }
      }
    }
    .nocomment {
      margin: 1.25rem auto;
      text-align: center;
    }
  }
}

.activeLike {
  color: #ea6f5a;
}

.reviewer {
  margin-left: 6.25rem;
  img {
    left: 0.625rem;
  }
}

.me {
  position: relative;
  margin-left: calc(40% - 7.625rem);
  img {
    right: -5.9375rem;
  }
}

@media screen and (max-width: 980px) {
  .newComment {
    img {
      display: none !important;
    }
    textarea {
      width: calc(100% - 0.875rem) !important;
      margin-left: 0 !important;
    }
    .inputBox {
      margin-left: 0 !important;
      input {
        width: 40% !important;
      }
    }
  }
}
</style>
