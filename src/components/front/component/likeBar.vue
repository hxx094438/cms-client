<template>
  <aside class="article_side">
    <div class="like">
      <i class="iconfont iconLike rubberBand" :class="{'activeLike': isLiked}"
         @click="giveLive(article.aid)">&#xe88b;</i>
      <span>{{article.ArticleLike}}</span>
    </div>
    <div class="comment">
      <i class="iconfont icon-huifu"></i>
      <span>{{article.comment_n}}</span>
    </div>
  </aside>
</template>

<script>
  import {mapActions, mapState, mapMutations, mapGetters} from 'vuex'
  import {_debounce} from '../../../lib/utils.js'

  export default {
    name: 'likeBar',
    props: ['article'],
    data() {
      return {}
    },
    created() {
      this.init()
    },
    computed: {
      ...mapState({
        articlesLikeArr: state => state.articlesList.articlesLikeArr
      }),
      aaa(){
        return this.article.aid
      },
      isLiked() {
        return this.articlesLikeArr.includes(this.article.aid)
      }
    },

    methods: {
      ...mapActions({
        updateArticleLike: 'article/UPDATE_ARTICLE_LIKE'
      }),
      giveLive(aid) {
        console.log('aid',aid)
        if (!this.isLiked) {
          this.updateArticleLike({aid: aid, action: 'add'})
        } else {
          this.updateArticleLike({aid: aid, action: 'reduce'})
        }
      },
      init() {
//                this.isLikeArr = JSON.parse(window.localStorage.getItem('LIKE_ARTICLS') || '[]')
      }
    },


  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '../../../assets/css/icon.scss';

  .iconLike, .icon-huifu {
    font-size: 24px;
  }

  .article_side {
    position: fixed;
    bottom: 12rem;
    left: 8rem;
    .like {
      text-align: center;
      line-height: 3rem;
      width: 3rem;
      height: 3rem;
      position: relative;
      border: 1px solid #eee;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .04);
      border-radius: 50%;
      cursor: pointer;
      margin-bottom: 1rem;
      transition-duration: .2s;
      &:hover {
        border-color: #ccc;
      }
      span {
        position: absolute;
        right: 0;
        top: 0;
        line-height: 1;
      }
    }
    .comment {
      text-align: center;
      line-height: 3rem;
      width: 3rem;
      height: 3rem;
      position: relative;
      border: 1px solid #eee;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .04);
      border-radius: 50%;
      cursor: pointer;
      transition-duration: .2s;
      &:hover {
        border-color: #ccc;
      }
      span {
        position: absolute;
        right: 0;
        top: 0;
        line-height: 1;
      }
    }

    .activeLike {
      color: #ea6f5a;
    }
  }


</style>
