<template>
<div id="vmarkdown">
 <!--  <div>
    <el-button @click='handlePreview'>预览</el-button>
  </div> -->
  <textarea :value="input" @input="update"></textarea>
  <div v-html="compiledMarkdown" v-highlightjs v-if='hidden' class="preview"></div>
</div>
</template>

<script>
export default {
  name: 'vmarkdown',
  data() {
    return {
      input: '### hello',
      hidden: true,
    }
  },
  computed: {
    compiledMarkdown: function () {
      this.$store.commit('SET_ITEM', {
        key: 'editor',
        val: this.input
      })
      return marked(this.input, { sanitize: true })
    }
  },
  methods: {
    handlePreview: function () {

    },
    update: function (e) {
      this.input = e.target.value
      this.$set(this, 'hidden', !this.hidden)
      setTimeout(()=> {
        this.$set(this, 'hidden', !this.hidden)
      }, 1)
    }
  }
}
</script>

<style lang="stylus" scoped>
#vmarkdown {
  margin: 20px 0;
  height: 100%;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #333;
}

textarea, #vmarkdown div {
  display: inline-block;
  width: 49%;
  height: 100%;
  vertical-align: top;
  box-sizing: border-box;
  padding: 0 20px;
  font-size: 2.2rem;
  line-height: 25px;
}

textarea {
  border: none;
  border-right: 1px solid #ccc;
  resize: none;
  outline: none;
  background-color: #f6f6f6;
  font-size: 14px;
  font-family: 'Monaco', courier, monospace;
  padding: 20px;
}

.preview {
  height: 100%;
  overflow-y:scroll;
}

code {
  color: #f66;
}
</style>
