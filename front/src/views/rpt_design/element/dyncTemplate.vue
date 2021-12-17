<template>
	<div style="width:100%;height:100%"  v-if="old_content==self.content" >
		<RuntimeTemplateCompiler :template="self.content" :parent="parentCompent"/>
	</div>
</template>

<script>

import { RuntimeTemplateCompiler } from 'vue-runtime-template-compiler'
import mixins from "./mixins"
import dyncTemplateMinxins from "./dyncTemplateMinxins"
export default {
  components: { RuntimeTemplateCompiler }, 
  name:"dync-template",
  mixins:[mixins,dyncTemplateMinxins],
  data: () => ({
    name: "Mellow",    
  }),  
  methods: {
    sayHi() {
      //console.info(this.context.clickedEle['test'])
      console.log("Hi");
    }
  },

};
</script>