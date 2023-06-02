//import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
//import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution';

//npm install monaco-editor@0.30.1 --save-dev 这两个是能正常使用的
//npm install monaco-editor-webpack-plugin@6.0.0 --save-dev
function noop() { } 

// Add additional d.ts files to the JavaScript language service and change.
// Also change the default compilation options.
// The sample below shows how a class Facts is declared and introduced
// to the system and how the compiler is told to use ES6 (target=2).

// validation settings
import {loadFile} from '../utils/util.js'
// extra libraries
let libSource = loadFile("crjs.d.ts");
let libUri = 'ts:filename/crjs.d.ts';
let already_init=false;
let old_define
function monaco_init(){
  already_init=true;
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: false
  });

  // compiler options
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES6,
    allowNonTsExtensions: true
  });
  
  monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, libUri);
  // When resolving definitions and references, the editor will try to use created models.
  // Creating a model for the library allows "peek definition/references" commands to work with the library.
  monaco.editor.createModel(libSource, 'typescript', monaco.Uri.parse(libUri));
}
//setTimeout(monaco_init,1000)
export default {
  name: 'MonacoEditor',
  props: {
    diffEditor: { type: Boolean, default: false },      //是否使用diff模式
    width: {type: [String, Number], default: '100%'},
    height: {type: [String, Number], default: '100%'},
    original: String,       //只有在diff模式下有效
    value: String,
    language: {type: String, default: 'javascript'},
    theme: {type: String, default: 'vs'},
    options: {type: Object, default() {return {};}},
    editorMounted: {type: Function, default: noop},
    editorBeforeMount: {type: Function, default: noop}
  },

  watch: {
    options: {
      deep: true,
      handler(options) {
        this.editor && this.editor.updateOptions(options);
      }
    },

    value() {
      this.editor && this.value !== this._getValue() && this._setValue((this.value??"")?.replaceAll("\r",""));
    },

    language() {
      if(!this.editor) return;
      if(this.diffEditor){      //diff模式下更新language
        const { original, modified } = this.editor.getModel();
        monaco.editor.setModelLanguage(original, this.language);
        monaco.editor.setModelLanguage(modified, this.language);
      }else
        monaco.editor.setModelLanguage(this.editor.getModel(), this.language);
    },

    theme() {
      this.editor && monaco.editor.setTheme(this.theme);
    },

    style() {
      this.editor && this.$nextTick(() => {
        this.editor.layout();
      });
    }
  },

  computed: {
    style() {
      return {
        width: !/^\d+$/.test(this.width) ? this.width : `${this.width}px`,
        height: !/^\d+$/.test(this.height) ? this.height : `${this.height}px`
      }
    }
  },

  mounted () {
    this.initMonaco();
  },

  beforeDestroy() {
    this.editor && this.editor.dispose();
  },

  render (h) {
    
    return (
      <div class="monaco_editor_container" style={this.style}></div>
    );
  },

  methods: {
    initMonaco() {
      if(already_init==false)
        monaco_init()
      const { value, language, theme, options } = this;
      Object.assign(options, this._editorBeforeMount());      //编辑器初始化前
      if(old_define && old_define.define){
        window._amdLoaderGlobal=old_define._amdLoaderGlobal
        window._commonjsGlobal=old_define._commonjsGlobal
        window.AMDLoader=old_define.AMDLoader
        window.define=old_define.define
        window.require=old_define.require
      }else{
        if(window.define)
        old_define={_amdLoaderGlobal:window._amdLoaderGlobal,_commonjsGlobal:window._commonjsGlobal,AMDLoader:window.AMDLoader,define:window.define,require:window.require} 
      }
      this.editor = monaco.editor[this.diffEditor ? 'createDiffEditor' : 'create'](this.$el, {
        value: value,
        language: language,
        theme: theme,
        ...options
      });
      this.diffEditor && this._setModel(this.value, this.original);
      this._editorMounted(this.editor);      //编辑器初始化后
    
  },

    _getEditor() {
      if(!this.editor) return null;
      return this.diffEditor ? this.editor.modifiedEditor : this.editor;
    },

    _setModel(value, original) {     //diff模式下设置model
      const { language } = this;
      const originalModel = monaco.editor.createModel(original, language);
      const modifiedModel = monaco.editor.createModel(value, language);
      this.editor.setModel({
        original: originalModel,
        modified: modifiedModel
      });
    },

    _setValue(value) {
      let editor = this._getEditor();
      if(editor) return editor.setValue(value);
    },

    _getValue() {
      let editor = this._getEditor();
      if(!editor) return '';
      return editor.getValue();
    },

    _editorBeforeMount() {
      const options = this.editorBeforeMount(monaco);
      return options || {};
    },

    _editorMounted(editor) {
      this.editorMounted(editor, monaco);
      if(this.diffEditor){
        editor.onDidUpdateDiff((event) => {
          const value = this._getValue();
          this._emitChange(value, event);
        });
      }else{
        editor.onDidChangeModelContent(event => {
          const value = this._getValue();
          this._emitChange(value, event);
        });
      }
    },

    _emitChange(value, event) {
      this.$emit('change', value, event);
      this.$emit('input', value);
    }
  }
}