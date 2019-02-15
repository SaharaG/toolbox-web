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
  import axios from 'axios'


  export default {
    name: "Notebook",

    mounted: function () {
      let edit = codeMirror.fromTextArea(document.getElementById('edit'), {
        lineNumbers: true,
        "fullScreen": true
      });
      let instance = axios.create({
        baseURL: 'https://api.xia-fei.com',
        // baseURL: 'http://localhost:8090',
        timeout: 20000,
      });
      let key = this.$route.params.note || 'node';
      instance.get('/map?key=' + key).then(res => {
        let text = res.data;
        edit.setValue(text + '');

        edit.on('change', function (event) {
          instance({
            method: 'post',
            url: '/map?key=' + key,
            headers: {
              "Content-Type": "application/json;"
            },
            data: edit.getValue()
          })
        });
      });


    }
  }

</script>

<style scoped>
  #font {
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  }

</style>
