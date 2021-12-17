<template>
  <div id="app">
    <CellReportFormDesign/>
  </div>
</template>

<script>

export default {
  name: 'App', //CellReportFormDesign
}
</script>

<style>
html, body, #app {
    height: 100%;
    margin: 0;
    padding: 0;
}
.CodeMirror { /*不加margin border codemirror的光标会有问题，行尾不出现光标，行内遇到空白会消失 */
  width: 100%;
  margin: 0 0 0 10px;
  border: 1px solid black;
  font-size : 13px;
    line-height : 150%;
    height:  100%!important; 

}
.vue-codemirror{border: 1px solid black;}
</style>
