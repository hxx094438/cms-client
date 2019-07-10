<template>
  <div class="container">
    <section class="newBlog">
      <div class="tags animated fadeIn">
        <div class="tagFlex">
          <button
            v-for="(tag, index) in allTags"
            :key="index"
            v-bind:class="{activeBtn: curTag === tag}"
            v-on:click="switchTag({value: tag, page: 1, isPublish: true}, index, tag)"
          >
            <span>{{tag}}</span>
          </button>
        </div>
      </div>
      <div class="title animated fadeIn">
        <span class="headline" id="lastPost">最近更新</span>
        <span class="line"></span>
      </div>
      <div class="posts animated fadeIn">
        <div class="flex">
          <div
            v-for="(article, index) in reducedArticles(articles)"
            :key="index"
            class="oneArticle"
          >
            <router-link
              :to="{name: 'article', params: {id: article.aid, index: index, page: 1}, hash: '#article'}"
              tag="a"
              exact
              class="title_1"
            >{{article.title}}</router-link>
            <div class="option">
              <time>{{article.date | toDate}}</time>
              <span class="commentNumber">
                <i class="iconfont icon-huifu"></i>
                {{article.comment_n}}
              </span>
            </div>
            <p class="content">{{article.content}}</p>
            <router-link
              :to="{name: 'article', params: {id: article.aid, index: index, page: 1}, hash: '#article'}"
              tag="button"
              exact
            >
              <span>
                <i>Read More</i>
              </span>
            </router-link>
          </div>

          <span
            @click="LoadArticles"
            v-if="!noMore"
            v-show="!noMore"
            class="animated fadeIn loadMore"
          >
            <i>more</i>
          </span>
          <span v-if="noMore" class="animated fadeIn">
            <i>end</i>
          </span>
        </div>
        <spinner v-show="isLoading" class="spinner"></spinner>
      </div>
    </section>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters, mapState } from "vuex";
import spinner from "../share/spinner";

export default {
  data() {
    return {};
  },
  created() {
    this.set_headline({
      content: "Welcome",
      animation: "animated bounceIn"
    });
    //      this.getAllArticles({page: 1})
  },

  asyncData({ store, route }) {
    const { page, limit } = route.query;
    return Promise.all([
      store.dispatch("articlesList/GET_ALL_ARTICLES", {
        page: page || 1,
        limit: limit || 8,
        isPublish: true
      }),
      store.dispatch("articlesList/GET_ALL_TAGS", {
        articleId: route.params.id
      })
    ]);
    // return store.dispatch("articlesList/GET_ALL_ARTICLES", {
    //   page: page || 1,
    //   limit: limit || 8,
    //   isPublish: true
    // });
    // this.getAllTags()
  },

  computed: {
    ...mapGetters({
      reducedArticles: "articlesList/reducedArticles",
      allTags: "articlesList/allTags"
    }),
    ...mapState({
      articles: state => state.articlesList.articles,
      noMore: state => state.articlesList.noMoreData,
      page: state => state.articlesList.page,
      pageTotal: state => state.articlesList.pageTotal,
      defaultLimit: state => state.articlesList.defaultLimit,
      curTag: state => state.articlesList.curTag,
      isLoading: state => state.isLoading
    })
  },
  methods: {
    //            ...mapMutations(['set_headline', 'set_dialog']),
    ...mapMutations({
      set_headline: "SET_HEADLING",
      set_dialog: "SET_DIALOG",
      set_curtag: "articlesList/SET_CURTAG",
      add_page: "articlesList/ADD_PAGE"
    }),
    ...mapActions({ getAllArticles: "articlesList/GET_ALL_ARTICLES" }),

    switchTag(payload, index, tag) {
      this.getAllArticles(payload);
      this.set_curtag(payload.tag);
    },

    loadTags() {
      if (!this.isLoading && this.$route.name === "articles") {
        this.getAllArticles({
          value: this.curTag,
          add: true,
          page: ++this.page
        });
        if (!this.moreArticle) {
          this.page = 1;
        }
      }
    },

    LoadArticles() {
      this.add_page()
      this.getAllArticles({
        add: true,
        page: this.page,
        limit: this.defaultLimit
      });
    }
  },
  components: {
    spinner
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.container {
  padding-top: 2rem;
  .newBlog {
    min-height: 43.75rem;
    width: 50rem;
    margin: 0 auto;
    .tags {
      .tagFlex {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        overflow: hidden;
        .activeBtn {
          font-weight: 600;
          color: #333;
          transition: 1s;
        }
        button {
          transition: 1s;
          padding-left: 1rem;
          padding-right: 0.2rem;
          text-align: center;
          background: transparent;
          margin: 0 1.25rem 1.25rem 0;
          span {
            color: #666;
          }
          &:hover span {
            color: #333;
          }
        }
      }
    }
    .title {
      position: relative;
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      line-height: 2rem;
      font-weight: 600;
      span.headline {
        position: relative;
        padding-right: 1.5rem;
        background: #fff;
        z-index: 99;
      }
      .line {
        top: 50%;
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        height: 1px;
        color: #eee;
        background: currentColor;
      }
    }
    .posts {
      margin-top: 1rem;
      .flex {
        color: #555;
        div.oneArticle {
          padding-bottom: 2rem;
          .title_1 {
            color: #333;
            font-size: 1.5rem;
            font-weight: bold;
            &:hover {
              underline: currentColor;
            }
          }
          .option {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            padding-top: 1rem;
            line-height: 2rem;
            time {
              color: #7f8c8d;
              flex-shrink: 1;
              width: 8rem;
              display: inline-block;
              font-size: 0.8rem;
            }
            .commentNumber {
              padding-left: 1rem;
              flex-shrink: 1;
            }
          }
          .content {
            padding: 1rem 0;
          }
          button {
            margin-top: 0;
            background: transparent;
            font-weight: 600;
            border-bottom: 1px solid #eee;
            span {
              color: #666;
            }
            &:hover span {
              color: #333;
            }
          }
        }
        .loadMore {
          cursor: pointer;
        }
      }
    }
  }
  .contact {
    background: rgba(0, 0, 0, 0.8);
    padding: 0 1rem;
    padding-bottom: 2rem;
    min-height: 30rem;
    .title {
      color: white;
      margin-bottom: 3.75rem;
      p {
        padding-top: 2.8125rem;
        width: 13rem;
      }
    }
    .email {
      margin: 3.125rem auto 0;
      width: 40%;
      input {
        color: #333;
        font-size: 1.125rem;
        width: 70%;
        height: 1.5625rem;
        margin-bottom: 1.25rem;
        display: block;
        background: transparent;
      }
      textarea {
        color: #333;
        font-size: 1.125rem;

        width: 100%;
        height: 15rem;
        resize: none;
        background: transparent;
        padding-top: 0.5rem;
        font-family: Georgia, "Microsoft YaHei", "微软雅黑", STXihei, "华文细黑",
          serif;
      }
      .sendEmail {
        width: 6.25rem;
        margin-top: 0.625rem;
        margin-left: calc(100% - 6.25rem);
      }
    }
  }
}

.commentNumber {
  color: #333;
  font-size: 1.25rem;
  i {
    font-size: 1.25rem;
    margin-right: 0.3125rem;
  }
}

@media screen and (max-width: 440px) {
  .oneArticle {
    flex-grow: 1;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  .email {
    width: 100% !important;
  }
}
</style>
