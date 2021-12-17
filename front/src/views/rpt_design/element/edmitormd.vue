<template>
    <div id="editormdid">
        <textarea v-model="value"></textarea>
    </div>
</template>

<script>
    export default {
        name: 'Editor',
        props: {
            value:{
                type: String,
                default: ''
            }
        },
        data() {
            return {
                instance: null,
            };
        },
        mounted() {
            this.initEditor();
        },
        methods: {
            initEditor() {
                let _this=this
                this.instance = window.editormd("editormdid", {
                    height: 500,
                    emoji: true,
                    path: 'cdn/editor.md-master/lib/',
                    onchange : function() {
                        _this.value=_this.instance.getMarkdown()
                        _this.$emit('input', _this.value);
                        console.log("onchange =>", _this.value);
                        // ....
                    }
                });
            }
        },
    };
</script>