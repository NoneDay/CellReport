/**
 * jQuery EasyUI 1.4.5
 * 
 * Copyright (c) 2009-2016 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the freeware license: http://www.jeasyui.com/license_freeware.php
 * To use it on other terms please contact us: info@jeasyui.com
 *
 */
(function($){
function _1(_2){
var _3=$.data(_2,"combogrid");
var _4=_3.options;
var _5=_3.grid;
$(_2).addClass("combogrid-f").combo($.extend({},_4,{onShowPanel:function(){
var p=$(this).combogrid("panel");
var _6=p.outerHeight()-p.height();
var _7=p._size("minHeight");
var _8=p._size("maxHeight");
var dg=$(this).combogrid("grid");
dg.datagrid("resize",{width:"100%",height:(isNaN(parseInt(_4.panelHeight))?"auto":"100%"),minHeight:(_7?_7-_6:""),maxHeight:(_8?_8-_6:"")});
var _9=dg.datagrid("getSelected");
if(_9){
dg.datagrid("scrollTo",dg.datagrid("getRowIndex",_9));
}
_4.onShowPanel.call(this);
}}));
var _a=$(_2).combo("panel");
if(!_5){
_5=$("<table></table>").appendTo(_a);
_3.grid=_5;
}
_5.datagrid($.extend({},_4,{border:false,singleSelect:(!_4.multiple),onLoadSuccess:function(_b){
var _c=$(_2).combo("getValues");
var _d=_4.onSelect;
_4.onSelect=function(){
};
_15(_2,_c,_3.remainText);
_4.onSelect=_d;
_4.onLoadSuccess.apply(_2,arguments);
},onClickRow:_e,onSelect:function(_f,row){
_10();
_4.onSelect.call(this,_f,row);
},onUnselect:function(_11,row){
_10();
_4.onUnselect.call(this,_11,row);
},onSelectAll:function(_12){
_10();
_4.onSelectAll.call(this,_12);
},onUnselectAll:function(_13){
if(_4.multiple){
_10();
}
_4.onUnselectAll.call(this,_13);
}}));
function _e(_14,row){
_3.remainText=false;
_10();
if(!_4.multiple){
$(_2).combo("hidePanel");
}
_4.onClickRow.call(this,_14,row);
};
function _10(){
var vv=$.map(_5.datagrid("getSelections"),function(row){
return row[_4.idField];
});
vv=vv.concat(_4.unselectedValues);
_15(_2,vv,_3.remainText);
};
};
function nav(_16,dir){
var _17=$.data(_16,"combogrid");
var _18=_17.options;
var _19=_17.grid;
var _1a=_19.datagrid("getRows").length;
if(!_1a){
return;
}
var tr=_18.finder.getTr(_19[0],null,"highlight");
if(!tr.length){
tr=_18.finder.getTr(_19[0],null,"selected");
}
var _1b;
if(!tr.length){
_1b=(dir=="next"?0:_1a-1);
}else{
var _1b=parseInt(tr.attr("datagrid-row-index"));
_1b+=(dir=="next"?1:-1);
if(_1b<0){
_1b=_1a-1;
}
if(_1b>=_1a){
_1b=0;
}
}
_19.datagrid("highlightRow",_1b);
if(_18.selectOnNavigation){
_17.remainText=false;
_19.datagrid("selectRow",_1b);
}
};
function _15(_1c,_1d,_1e){
var _1f=$.data(_1c,"combogrid");
var _20=_1f.options;
var _21=_1f.grid;
var _22=$(_1c).combo("getValues");
var _23=$(_1c).combo("options");
var _24=_23.onChange;
_23.onChange=function(){
};
var _25=_21.datagrid("options");
var _26=_25.onSelect;
var _27=_25.onUnselectAll;
_25.onSelect=_25.onUnselectAll=function(){
};
if(!$.isArray(_1d)){
_1d=_1d.split(_20.separator);
}
if(!_20.multiple){
_1d=_1d.length?[_1d[0]]:[""];
}
var vv=$.map(_1d,function(_28){
return String(_28);
});
vv=$.grep(vv,function(v,_29){
return _29===$.inArray(v,vv);
});
var _2a=$.grep(_21.datagrid("getSelections"),function(row,_2b){
return $.inArray(String(row[_20.idField]),vv)>=0;
});
_21.datagrid("clearSelections");
_21.data("datagrid").selectedRows=_2a;
var ss=[];
_20.unselectedValues=[];
$.map(vv,function(v){
var _2c=_21.datagrid("getRowIndex",v);
if(_2c>=0){
_21.datagrid("selectRow",_2c);
}else{
_20.unselectedValues.push(v);
}
ss.push(_2d(v,_21.datagrid("getRows"))||_2d(v,_2a)||_2d(v,_20.mappingRows)||v);
});
$(_1c).combo("setValues",_22);
_23.onChange=_24;
_25.onSelect=_26;
_25.onUnselectAll=_27;
if(!_1e){
var s=ss.join(_20.separator);
if($(_1c).combo("getText")!=s){
$(_1c).combo("setText",s);
}
}
$(_1c).combo("setValues",_1d);
function _2d(_2e,a){
var _2f=$.easyui.getArrayItem(a,_20.idField,_2e);
return _2f?_2f[_20.textField]:undefined;
};
};
function _30(_31,q){
var _32=$.data(_31,"combogrid");
var _33=_32.options;
var _34=_32.grid;
_32.remainText=true;
if(_33.multiple&&!q){
_15(_31,[],true);
}else{
_15(_31,[q],true);
}
if(_33.mode=="remote"){
_34.datagrid("clearSelections");
_34.datagrid("load",$.extend({},_33.queryParams,{q:q}));
}else{
if(!q){
return;
}
_34.datagrid("clearSelections").datagrid("highlightRow",-1);
var _35=_34.datagrid("getRows");
var qq=_33.multiple?q.split(_33.separator):[q];
$.map(qq,function(q){
q=$.trim(q);
if(q){
$.map(_35,function(row,i){
if(q==row[_33.textField]){
_34.datagrid("selectRow",i);
}else{
if(_33.filter.call(_31,q,row)){
_34.datagrid("highlightRow",i);
}
}
});
}
});
}
};
function _36(_37){
var _38=$.data(_37,"combogrid");
var _39=_38.options;
var _3a=_38.grid;
var tr=_39.finder.getTr(_3a[0],null,"highlight");
_38.remainText=false;
if(tr.length){
var _3b=parseInt(tr.attr("datagrid-row-index"));
if(_39.multiple){
if(tr.hasClass("datagrid-row-selected")){
_3a.datagrid("unselectRow",_3b);
}else{
_3a.datagrid("selectRow",_3b);
}
}else{
_3a.datagrid("selectRow",_3b);
}
}
var vv=[];
$.map(_3a.datagrid("getSelections"),function(row){
vv.push(row[_39.idField]);
});
$(_37).combogrid("setValues",vv);
if(!_39.multiple){
$(_37).combogrid("hidePanel");
}
};
$.fn.combogrid=function(_3c,_3d){
if(typeof _3c=="string"){
var _3e=$.fn.combogrid.methods[_3c];
if(_3e){
return _3e(this,_3d);
}else{
return this.combo(_3c,_3d);
}
}
_3c=_3c||{};
return this.each(function(){
var _3f=$.data(this,"combogrid");
if(_3f){
$.extend(_3f.options,_3c);
}else{
_3f=$.data(this,"combogrid",{options:$.extend({},$.fn.combogrid.defaults,$.fn.combogrid.parseOptions(this),_3c)});
}
_1(this);
});
};
$.fn.combogrid.methods={options:function(jq){
var _40=jq.combo("options");
return $.extend($.data(jq[0],"combogrid").options,{width:_40.width,height:_40.height,originalValue:_40.originalValue,disabled:_40.disabled,readonly:_40.readonly});
},grid:function(jq){
return $.data(jq[0],"combogrid").grid;
},setValues:function(jq,_41){
return jq.each(function(){
var _42=$(this).combogrid("options");
if($.isArray(_41)){
_41=$.map(_41,function(_43){
if(_43&&typeof _43=="object"){
$.easyui.addArrayItem(_42.mappingRows,_42.idField,_43);
return _43[_42.idField];
}else{
return _43;
}
});
}
_15(this,_41);
});
},setValue:function(jq,_44){
return jq.each(function(){
$(this).combogrid("setValues",$.isArray(_44)?_44:[_44]);
});
},clear:function(jq){
return jq.each(function(){
$(this).combogrid("setValues",[]);
});
},reset:function(jq){
return jq.each(function(){
var _45=$(this).combogrid("options");
if(_45.multiple){
$(this).combogrid("setValues",_45.originalValue);
}else{
$(this).combogrid("setValue",_45.originalValue);
}
});
}};
$.fn.combogrid.parseOptions=function(_46){
var t=$(_46);
return $.extend({},$.fn.combo.parseOptions(_46),$.fn.datagrid.parseOptions(_46),$.parser.parseOptions(_46,["idField","textField","mode"]));
};
$.fn.combogrid.defaults=$.extend({},$.fn.combo.defaults,$.fn.datagrid.defaults,{height:22,loadMsg:null,idField:null,textField:null,unselectedValues:[],mappingRows:[],mode:"local",keyHandler:{up:function(e){
nav(this,"prev");
e.preventDefault();
},down:function(e){
nav(this,"next");
e.preventDefault();
},left:function(e){
},right:function(e){
},enter:function(e){
_36(this);
},query:function(q,e){
_30(this,q);
}},filter:function(q,row){
var _47=$(this).combogrid("options");
return (row[_47.textField]||"").toLowerCase().indexOf(q.toLowerCase())>=0;
}});
})(jQuery);

