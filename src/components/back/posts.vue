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
//        page: this.$route.page,
        pages: 12,
      }
    },

    asyncData ({ store, route }) {
      console.log('pages',this.pages)
      console.log('store.back',store.back)
      return store.dispatch('articles/GET_ALL_ARTICLES', {
        page: store.back.page,
        limit :store.back.defaultLimit
      })
//      return store.dispatch('getAllArticles', {page: this.page, limit: 4})
    },

    methods: {
      ...mapActions({
        getAllArticles: 'GET_ALL_ARTICLES'
      }),
      nextPage() {
        if (this.page < this.pageTotal) {
          this.$store.commit('back/ADD_PAGE')
          this.getAllArticles({page: this.page, limit: this.defaultLimit})
        } else {
          alert('没有更多了！')
        }
      },
      prePage() {
        if (!(this.page - 1)) {
          alert('已经到第一页咯')
        } else {
          this.$store.commit('back/REDUCE_PAGE')
          this.getAllArticles({page: this.page, limit: this.defaultLimit})
        }
      }
    },
    computed: {
      ...mapState({
        articles: state => state.back.articles, 
        pageTotal: state => state.back.pageTotal,
        page: state => state.back.page,
        defaultLimit: state => state.back.defaultLimit
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
