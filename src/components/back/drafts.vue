<template>
  <div class="drafts_container">
    <p>所有草稿</p>
    <article-content v-on:addPage="nextPage" v-on:dropPage="prePage" :page="page"></article-content>
    <router-link
      :to="{name: 'editor'}"
      class="addPost" tag="button"
    ><span>添加草稿</span></router-link>
  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex'
  import ArticleContent from './component/ArticleContent'

  export default {
    created() {
      this.getAllArticles({
        page: this.page,
        limit: 4,
        isPublish: false
      })
    },
    data() {
      return {
        page: 1
      }
    },
    methods: {
      ...mapActions({
        getAllArticles: 'back/GET_ALL_ARTICLES'
      }), nextPage() {
        if (this.page < this.pageTotal) {
          this.page++
          this.getAllArticles({
            page: this.page,
            limit: 4,
            isPublish: false
          })
        } else {
          alert('没有更多了！')
        }
      },
      prePage() {
        if (!(this.page - 1)) {
          alert('已经到第一页咯')
        } else {
          this.page--
          this.getAllArticles({
            page: this.page,
            limit: 4,
            isPublish: false
          })
        }
      }
    },
    computed: {
//      ...mapState(['articles', 'pageTotal'])
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
  .drafts_container {
    padding-top: 0.625rem;
    color: #333;
    position: relative;
    max-width: 82%;
    P {
      border-bottom: 1px solid #eee;
      width: 12.5rem;
      font-size: 1.875rem;
      margin: 0 auto 2.5rem;
      padding-bottom: 0.625rem;
      text-align: center;
    }
    .addPost {
      position: absolute;
      bottom: 5%;
      left: -15%;
    }
  }

  @media screen and (max-width: 440px) {
    .container {
      padding-top: 2rem !important;
      margin-bottom: 3rem;
      .addPost {
        position: absolute;
        bottom: -3rem;
      }
    }
  }
</style>
