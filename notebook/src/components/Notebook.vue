<template>
  <div id="font">
  <textarea id="edit"></textarea>
  </div>
</template>

<script>

  import 'codemirror/lib/codemirror.css'
  import 'codemirror/addon/display/fullscreen.css'
  import 'codemirror/theme/night.css'
  import codeMirror from 'codemirror'
  import 'codemirror/addon/display/fullscreen'



  export default {
    name: "Notebook",
    mounted: function () {
      let edit = codeMirror.fromTextArea(document.getElementById('edit'), {
        lineNumbers: true,
        "fullScreen": true
      });
      console.log(edit);
    }
  }

</script>

<style scoped>
  #font{
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }

</style>
