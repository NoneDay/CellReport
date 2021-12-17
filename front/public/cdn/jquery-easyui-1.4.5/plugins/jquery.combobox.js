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
function _1(_2,_3){
var _4=$.data(_2,"combobox");
return $.easyui.indexOfArray(_4.data,_4.options.valueField,_3);
};
function _5(_6,_7){
var _8=$.data(_6,"combobox").options;
var _9=$(_6).combo("panel");
var _a=_8.finder.getEl(_6,_7);
if(_a.length){
if(_a.position().top<=0){
var h=_9.scrollTop()+_a.position().top;
_9.scrollTop(h);
}else{
if(_a.position().top+_a.outerHeight()>_9.height()){
var h=_9.scrollTop()+_a.position().top+_a.outerHeight()-_9.height();
_9.scrollTop(h);
}
}
}
_9.triggerHandler("scroll");
};
function _b(_c,_d){
var _e=$.data(_c,"combobox").options;
var _f=$(_c).combobox("panel");
var _10=_f.children("div.combobox-item-hover");
if(!_10.length){
_10=_f.children("div.combobox-item-selected");
}
_10.removeClass("combobox-item-hover");
var _11="div.combobox-item:visible:not(.combobox-item-disabled):first";
var _12="div.combobox-item:visible:not(.combobox-item-disabled):last";
if(!_10.length){
_10=_f.children(_d=="next"?_11:_12);
}else{
if(_d=="next"){
_10=_10.nextAll(_11);
if(!_10.length){
_10=_f.children(_11);
}
}else{
_10=_10.prevAll(_11);
if(!_10.length){
_10=_f.children(_12);
}
}
}
if(_10.length){
_10.addClass("combobox-item-hover");
var row=_e.finder.getRow(_c,_10);
if(row){
$(_c).combobox("scrollTo",row[_e.valueField]);
if(_e.selectOnNavigation){
_13(_c,row[_e.valueField]);
}
}
}
};
function _13(_14,_15,_16){
var _17=$.data(_14,"combobox").options;
var _18=$(_14).combo("getValues");
if($.inArray(_15+"",_18)==-1){
if(_17.multiple){
_18.push(_15);
}else{
_18=[_15];
}
_19(_14,_18,_16);
_17.onSelect.call(_14,_17.finder.getRow(_14,_15));
}
};
function _1a(_1b,_1c){
var _1d=$.data(_1b,"combobox").options;
var _1e=$(_1b).combo("getValues");
var _1f=$.inArray(_1c+"",_1e);
if(_1f>=0){
_1e.splice(_1f,1);
_19(_1b,_1e);
_1d.onUnselect.call(_1b,_1d.finder.getRow(_1b,_1c));
}
};
function _19(_20,_21,_22){
var _23=$.data(_20,"combobox").options;
var _24=$(_20).combo("panel");
if(!$.isArray(_21)){
_21=_21.split(_23.separator);
}
if(!_23.multiple){
_21=_21.length?[_21[0]]:[""];
}
_24.find("div.combobox-item-selected").removeClass("combobox-item-selected");
var _25=null;
var vv=[],ss=[];
for(var i=0;i<_21.length;i++){
var v=_21[i];
var s=v;
_23.finder.getEl(_20,v).addClass("combobox-item-selected");
var row=_23.finder.getRow(_20,v);
if(row){
s=row[_23.textField];
_25=row;
}
vv.push(v);
ss.push(s);
}
if(!_22){
$(_20).combo("setText",ss.join(_23.separator));
}
if(_23.showItemIcon){
var tb=$(_20).combobox("textbox");
tb.removeClass("textbox-bgicon "+_23.textboxIconCls);
if(_25&&_25.iconCls){
tb.addClass("textbox-bgicon "+_25.iconCls);
_23.textboxIconCls=_25.iconCls;
}
}
$(_20).combo("setValues",vv);
_24.triggerHandler("scroll");
};
function _26(_27,_28,_29){
var _2a=$.data(_27,"combobox");
var _2b=_2a.options;
_2a.data=_2b.loadFilter.call(_27,_28);
_2b.view.render.call(_2b.view,_27,$(_27).combo("panel"),_2a.data);
var vv=$(_27).combobox("getValues");
$.easyui.forEach(_2a.data,false,function(row){
if(row["selected"]){
$.easyui.addArrayItem(vv,row[_2b.valueField]+"");
}
});
if(_2b.multiple){
_19(_27,vv,_29);
}else{
_19(_27,vv.length?[vv[vv.length-1]]:[],_29);
}
_2b.onLoadSuccess.call(_27,_28);
};
function _2c(_2d,url,_2e,_2f){
var _30=$.data(_2d,"combobox").options;
if(url){
_30.url=url;
}
_2e=$.extend({},_30.queryParams,_2e||{});
if(_30.onBeforeLoad.call(_2d,_2e)==false){
return;
}
_30.loader.call(_2d,_2e,function(_31){
_26(_2d,_31,_2f);
},function(){
_30.onLoadError.apply(this,arguments);
});
};
function _32(_33,q){
var _34=$.data(_33,"combobox");
var _35=_34.options;
var qq=_35.multiple?q.split(_35.separator):[q];
if(_35.mode=="remote"){
_36(qq);
_2c(_33,null,{q:q},true);
}else{
var _37=$(_33).combo("panel");
_37.find("div.combobox-item-selected,div.combobox-item-hover").removeClass("combobox-item-selected combobox-item-hover");
_37.find("div.combobox-item,div.combobox-group").hide();
var _38=_34.data;
var vv=[];
$.map(qq,function(q){
q=$.trim(q);
var _39=q;
var _3a=undefined;
for(var i=0;i<_38.length;i++){
var row=_38[i];
if(_35.filter.call(_33,q,row)){
var v=row[_35.valueField];
var s=row[_35.textField];
var g=row[_35.groupField];
var _3b=_35.finder.getEl(_33,v).show();
if(s.toLowerCase()==q.toLowerCase()){
_39=v;
_13(_33,v,true);
}
if(_35.groupField&&_3a!=g){
_35.finder.getGroupEl(_33,g).show();
_3a=g;
}
}
}
vv.push(_39);
});
_36(vv);
}
function _36(vv){
_19(_33,_35.multiple?(q?vv:[]):vv,true);
};
};
function _3c(_3d){
var t=$(_3d);
var _3e=t.combobox("options");
var _3f=t.combobox("panel");
var _40=_3f.children("div.combobox-item-hover");
if(_40.length){
var row=_3e.finder.getRow(_3d,_40);
var _41=row[_3e.valueField];
if(_3e.multiple){
if(_40.hasClass("combobox-item-selected")){
t.combobox("unselect",_41);
}else{
t.combobox("select",_41);
}
}else{
t.combobox("select",_41);
}
}
var vv=[];
$.map(t.combobox("getValues"),function(v){
if(_1(_3d,v)>=0){
vv.push(v);
}
});
t.combobox("setValues",vv);
if(!_3e.multiple){
t.combobox("hidePanel");
}
};
function _42(_43){
var _44=$.data(_43,"combobox");
var _45=_44.options;
$(_43).addClass("combobox-f");
$(_43).combo($.extend({},_45,{onShowPanel:function(){
$(this).combo("panel").find("div.combobox-item:hidden,div.combobox-group:hidden").show();
_19(this,$(this).combobox("getValues"),true);
$(this).combobox("scrollTo",$(this).combobox("getValue"));
_45.onShowPanel.call(this);
}}));
$(_43).combo("panel").unbind().bind("mouseover",function(e){
$(this).children("div.combobox-item-hover").removeClass("combobox-item-hover");
var _46=$(e.target).closest("div.combobox-item");
if(!_46.hasClass("combobox-item-disabled")){
_46.addClass("combobox-item-hover");
}
e.stopPropagation();
}).bind("mouseout",function(e){
$(e.target).closest("div.combobox-item").removeClass("combobox-item-hover");
e.stopPropagation();
}).bind("click",function(e){
var _47=$(this).panel("options").comboTarget;
var _48=$(e.target).closest("div.combobox-item");
if(!_48.length||_48.hasClass("combobox-item-disabled")){
return;
}
var row=_45.finder.getRow(_47,_48);
if(!row){
return;
}
var _49=row[_45.valueField];
if(_45.multiple){
if(_48.hasClass("combobox-item-selected")){
_1a(_47,_49);
}else{
_13(_47,_49);
}
}else{
_13(_47,_49);
$(_47).combo("hidePanel");
}
e.stopPropagation();
}).bind("scroll",function(){
if(_45.groupPosition=="sticky"){
var _4a=$(this).panel("options").comboTarget;
var _4b=$(this).children(".combobox-stick");
if(!_4b.length){
_4b=$("<div class=\"combobox-stick\"></div>").appendTo(this);
}
_4b.hide();
$(this).children(".combobox-group:visible").each(function(){
var g=$(this);
var _4c=_45.finder.getGroup(_4a,g);
var _4d=_44.data[_4c.startIndex+_4c.count-1];
var _4e=_45.finder.getEl(_4a,_4d[_45.valueField]);
if(g.position().top<0&&_4e.position().top>0){
_4b.show().html(g.html());
return false;
}
});
}
});
};
$.fn.combobox=function(_4f,_50){
if(typeof _4f=="string"){
var _51=$.fn.combobox.methods[_4f];
if(_51){
return _51(this,_50);
}else{
return this.combo(_4f,_50);
}
}
_4f=_4f||{};
return this.each(function(){
var _52=$.data(this,"combobox");
if(_52){
$.extend(_52.options,_4f);
}else{
_52=$.data(this,"combobox",{options:$.extend({},$.fn.combobox.defaults,$.fn.combobox.parseOptions(this),_4f),data:[]});
}
_42(this);
if(_52.options.data){
_26(this,_52.options.data);
}else{
var _53=$.fn.combobox.parseData(this);
if(_53.length){
_26(this,_53);
}
}
_2c(this);
});
};
$.fn.combobox.methods={options:function(jq){
var _54=jq.combo("options");
return $.extend($.data(jq[0],"combobox").options,{width:_54.width,height:_54.height,originalValue:_54.originalValue,disabled:_54.disabled,readonly:_54.readonly});
},cloneFrom:function(jq,_55){
return jq.each(function(){
$(this).combo("cloneFrom",_55);
$.data(this,"combobox",$(_55).data("combobox"));
$(this).addClass("combobox-f").attr("comboboxName",$(this).attr("textboxName"));
});
},getData:function(jq){
return $.data(jq[0],"combobox").data;
},setValues:function(jq,_56){
return jq.each(function(){
_19(this,_56);
});
},setValue:function(jq,_57){
return jq.each(function(){
_19(this,$.isArray(_57)?_57:[_57]);
});
},clear:function(jq){
return jq.each(function(){
$(this).combo("clear");
var _58=$(this).combo("panel");
_58.find("div.combobox-item-selected").removeClass("combobox-item-selected");
});
},reset:function(jq){
return jq.each(function(){
var _59=$(this).combobox("options");
if(_59.multiple){
$(this).combobox("setValues",_59.originalValue);
}else{
$(this).combobox("setValue",_59.originalValue);
}
});
},loadData:function(jq,_5a){
return jq.each(function(){
_26(this,_5a);
});
},reload:function(jq,url){
return jq.each(function(){
if(typeof url=="string"){
_2c(this,url);
}else{
if(url){
var _5b=$(this).combobox("options");
_5b.queryParams=url;
}
_2c(this);
}
});
},select:function(jq,_5c){
return jq.each(function(){
_13(this,_5c);
});
},unselect:function(jq,_5d){
return jq.each(function(){
_1a(this,_5d);
});
},scrollTo:function(jq,_5e){
return jq.each(function(){
_5(this,_5e);
});
}};
$.fn.combobox.parseOptions=function(_5f){
var t=$(_5f);
return $.extend({},$.fn.combo.parseOptions(_5f),$.parser.parseOptions(_5f,["valueField","textField","groupField","groupPosition","mode","method","url",{showItemIcon:"boolean"}]));
};
$.fn.combobox.parseData=function(_60){
var _61=[];
var _62=$(_60).combobox("options");
$(_60).children().each(function(){
if(this.tagName.toLowerCase()=="optgroup"){
var _63=$(this).attr("label");
$(this).children().each(function(){
_64(this,_63);
});
}else{
_64(this);
}
});
return _61;
function _64(el,_65){
var t=$(el);
var row={};
row[_62.valueField]=t.attr("value")!=undefined?t.attr("value"):t.text();
row[_62.textField]=t.text();
row["selected"]=t.is(":selected");
row["disabled"]=t.is(":disabled");
if(_65){
_62.groupField=_62.groupField||"group";
row[_62.groupField]=_65;
}
_61.push(row);
};
};
var _66=0;
var _67={render:function(_68,_69,_6a){
var _6b=$.data(_68,"combobox");
var _6c=_6b.options;
_66++;
_6b.itemIdPrefix="_easyui_combobox_i"+_66;
_6b.groupIdPrefix="_easyui_combobox_g"+_66;
_6b.groups=[];
var dd=[];
var _6d=undefined;
for(var i=0;i<_6a.length;i++){
var row=_6a[i];
var v=row[_6c.valueField]+"";
var s=row[_6c.textField];
var g=row[_6c.groupField];
if(g){
if(_6d!=g){
_6d=g;
_6b.groups.push({value:g,startIndex:i,count:1});
dd.push("<div id=\""+(_6b.groupIdPrefix+"_"+(_6b.groups.length-1))+"\" class=\"combobox-group\">");
dd.push(_6c.groupFormatter?_6c.groupFormatter.call(_68,g):g);
dd.push("</div>");
}else{
_6b.groups[_6b.groups.length-1].count++;
}
}else{
_6d=undefined;
}
var cls="combobox-item"+(row.disabled?" combobox-item-disabled":"")+(g?" combobox-gitem":"");
dd.push("<div id=\""+(_6b.itemIdPrefix+"_"+i)+"\" class=\""+cls+"\">");
if(_6c.showItemIcon&&row.iconCls){
dd.push("<span class=\"combobox-icon "+row.iconCls+"\"></span>");
}
dd.push(_6c.formatter?_6c.formatter.call(_68,row):s);
dd.push("</div>");
}
$(_69).html(dd.join(""));
}};
$.fn.combobox.defaults=$.extend({},$.fn.combo.defaults,{valueField:"value",textField:"text",groupPosition:"static",groupField:null,groupFormatter:function(_6e){
return _6e;
},mode:"local",method:"post",url:null,data:null,queryParams:{},showItemIcon:false,view:_67,keyHandler:{up:function(e){
_b(this,"prev");
e.preventDefault();
},down:function(e){
_b(this,"next");
e.preventDefault();
},left:function(e){
},right:function(e){
},enter:function(e){
_3c(this);
},query:function(q,e){
_32(this,q);
}},filter:function(q,row){
var _6f=$(this).combobox("options");
return row[_6f.textField].toLowerCase().indexOf(q.toLowerCase())>=0;
},formatter:function(row){
var _70=$(this).combobox("options");
return row[_70.textField];
},loader:function(_71,_72,_73){
var _74=$(this).combobox("options");
if(!_74.url){
return false;
}
$.ajax({type:_74.method,url:_74.url,data:_71,dataType:"json",success:function(_75){
_72(_75);
},error:function(){
_73.apply(this,arguments);
}});
},loadFilter:function(_76){
return _76;
},finder:{getEl:function(_77,_78){
var _79=_1(_77,_78);
var id=$.data(_77,"combobox").itemIdPrefix+"_"+_79;
return $("#"+id);
},getGroupEl:function(_7a,_7b){
var _7c=$.data(_7a,"combobox");
var _7d=$.easyui.indexOfArray(_7c.groups,"value",_7b);
var id=_7c.groupIdPrefix+"_"+_7d;
return $("#"+id);
},getGroup:function(_7e,p){
var _7f=$.data(_7e,"combobox");
var _80=p.attr("id").substr(_7f.groupIdPrefix.length+1);
return _7f.groups[parseInt(_80)];
},getRow:function(_81,p){
var _82=$.data(_81,"combobox");
var _83=(p instanceof $)?p.attr("id").substr(_82.itemIdPrefix.length+1):_1(_81,p);
return _82.data[parseInt(_83)];
}},onBeforeLoad:function(_84){
},onLoadSuccess:function(){
},onLoadError:function(){
},onSelect:function(_85){
},onUnselect:function(_86){
}});
})(jQuery);

