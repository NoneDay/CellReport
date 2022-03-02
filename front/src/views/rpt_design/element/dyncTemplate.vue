<template>
	<div :id="'cr_dyn_id_'+context.mode+'_'+id_name" style="width:100%;height:100%"  v-if="old_content==cut_script_css_content" >
		<RuntimeTemplateCompiler :template="cut_script_css_content" :parent="real_parentCompent"/>
	</div>
</template>

<script>

import { RuntimeTemplateCompiler } from 'vue-runtime-template-compiler'
import mixins from "./mixins"
import dyncTemplateMinxins from "./dyncTemplateMinxins"
export default {
  components: { RuntimeTemplateCompiler }, 
  name:"dync-template",
  props:['parentCompent'],
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