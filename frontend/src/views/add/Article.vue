<template lang="pug">
#add-article.admin
  el-form(ref='form', :model='form', label-width='80px')
    el-input(placeholder='请输入标题', v-model='form.title')
    el-input(placeholder='请输入子标题 可选', v-model='form.subTitle')
    #editor-header.border1
      img(:src='form.headerImg', alt='', v-if='form.headerImg')
      #header-button(v-else) 点击上传 .jpg/.png (可选)
    vmarkdown(style="height:400px;max-height:500px;" v-if='isMarkdownEditor')
    veditor#veditor(style="height:400px;max-height:500px;", v-else)
    commit-component(:_form         = 'form',
                     :dialogVisible = 'dialogVisible',
                     :onSubmit      = 'onSubmit',
                     :dialogConfim  = 'dialogConfim')
</template>

<script>

import tools    from '../../tools'
import * as api from '../../stores/api'

export default {
  name: 'add-article',
  computed: {
    isMarkdownEditor () {
     return this.$store.state.editorType === 'markdown'
    }
  },
  data () {
    return {
      form: {
        title:     '',
        subTitle:  '',
        headerImg: '',
        sendAt:    '',
        status:    'send',
        content:   '',
        html:      '',
        markdown:  '',
      },
      uptoken:        '',
      editor:         {},
      dialogVisible:  false,
      formLabelWidth: '200px'
    }
  },
  methods: {

    dialogConfim () {
      this.$router.push('/articles')
      Object.assign(this.$data, this.$options.data());
    },
    onSubmit() {

      let _this    = this,
      dispatch     = 'ADD_ADMIN_ITEM',
      url          = 'article',
      editorStatus = this.$store.state.editorStatus;
      if (!this.form.title ||
          this.form.status === 'schedule' &&
          this.form.sendAt < Date.now()) {
        this.$message.error('内容未填写');
        return;
      }

      if (isMarkdownEditor) {
        // let html       = this.$store.state.editor.$txt.html();
        // this.$set(this.form, 'content', html)
      } else {
        let html       = this.$store.state.editor.$txt.html();
        this.$set(this.form, 'content', html)
      }

      if (editorStatus === 'updateArticle') {
        dispatch = 'UPDATE_ADMIN_ITEM',
        url = `article/${_this.$store.state.medium._id}`
      }

      this.$store.dispatch(dispatch, {
        url: url,
        msg: _this.$message,
        data: _this.form,
        cb: () => {
          _this.$set(_this, 'dialogVisible', true)
          _this.$store.commit('SET_ITEM', {
            key: 'editorStatus',
            val: 'createArticle'
          })
          _this.$store.commit('SET_ITEM', {
            key: 'article',
            val: {}
          })
        }
      })
    }
  },
  mounted () {
    let _this = this, article = this.$store.state.medium;

    tools.qiniu(_this, 'editor-header', 'editor-header', 'article/header',
      (sourceLink) => {
      _this.$set(_this.form, 'headerImg', sourceLink)
    })

    if (article && article.content) {
      this.$store.state.editor.$txt.html(article.content)
      this.$set(this, 'form', article)
    }

  }
}
</script>

<style lang="stylus" scoped>
#add-article
  .el-input, #editor-header, #editor
    margin 10px 0

  #editor-header
    height 200px
    line-height 200px
    cursor pointer
    font-size 2rem
    overflow hidden
    padding-left 20px

    img
      position absolute
      top 0
      left 0

  .el-switch
    margin-right 20px

</style>
