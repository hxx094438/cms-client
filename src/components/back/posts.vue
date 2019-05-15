<template>
  <div class="content">
    <p>所有文章</p>
    <article-content v-on:addPage="nextPage" v-on:dropPage="prePage" :page="page"></article-content>
    <router-link
      :to="{name: 'editor'}"
      class="addPost" tag="button"
    ><span>添加文章</span></router-link>
  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex'
  import ArticleContent from './component/ArticleContent'

  export default {
    mounted() {
//     this.getAllArticles({page: this.page, limit: 4}) //服务端不会调用
    },
    data() {
      return {
        page: this.$route.query.page || 1,
        limit: this.$route.query.limit || 4,
      }
    },

    asyncData ({ store, route }) {
      const {page, limit} = route.query
      return store.dispatch('back/GET_ALL_ARTICLES', {
        page: page || 1,
        limit :limit || 4
      })
    },

    methods: {
      ...mapActions({
        getAllArticles: 'back/GET_ALL_ARTICLES'
      }),
      nextPage() {
        if (this.noMoreData) {
          this.page ++
          this.getAllArticles({page: this.page, limit: this.limit})
        } else {
          alert('没有更多了！')
        }
      },
      prePage() {
        if (!(this.page - 1)) {
          alert('已经到第一页咯')
        } else {
          this.page --
          this.getAllArticles({page: this.page, limit: this.limit})
        }
      }
    },
    computed: {
      ...mapState({
        articles: state => state.back.articles,
        noMoreData: state => state.back.noMoreData,
//        page: state => state.back.page,
//        defaultLimit: state => state.back.defaultLimit
        }),
    },
    components: {
      ArticleContent
    }
  }

</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .content {
    max-width: 82%;
    padding-top: 0.625rem;
    color: #666;
    position: relative;
    p {
      border-bottom: 1px solid #eee;
      width: 20%;
      font-size: 1.875rem;
      margin: 0 auto 2.5rem;
      padding-bottom: 0.625rem;
      text-align: center;
    }
    .addPost {
      position: absolute;
      left: -15%;
      bottom: 5%;
    }
  }

  @media screen and (max-width: 440px) {
    .content {
      padding-top: 2rem !important;
      margin-bottom: 4rem;
      .addPost {
        position: absolute !important;
        bottom: -3rem !important;
      }
    }
  }
</style>
