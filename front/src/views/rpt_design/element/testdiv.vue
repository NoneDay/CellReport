<template>
 <div :style="{width:'30px',height:height||'20px','background-color':color}">
      {{text}}------{{color}} 
  </div>
</template>

<script>
import mixins from "./mixins"
export default {
    name:"testdiv",
    mixins:[mixins],
    props:{text:String,color:String,height:String},
    mounted(){
        console.info(this.color);
    }
}
</script>

<style>

</style>