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
var _4=$.data(_2,"form").options;
$.extend(_4,_3||{});
var _5=$.extend({},_4.queryParams);
if(_4.onSubmit.call(_2,_5)==false){
return;
}
var _6=$(_2).find(".textbox-text:focus");
_6.triggerHandler("blur");
_6.focus();
if(_4.iframe){
_7(_2,_5);
}else{
if(window.FormData!==undefined){
_8(_2,_5);
}else{
_7(_2,_5);
}
}
};
function _7(_9,_a){
var _b=$.data(_9,"form").options;
var _c="easyui_frame_"+(new Date().getTime());
var _d=$("<iframe id="+_c+" name="+_c+"></iframe>").appendTo("body");
_d.attr("src",window.ActiveXObject?"javascript:false":"about:blank");
_d.css({position:"absolute",top:-1000,left:-1000});
_d.bind("load",cb);
_e(_a);
function _e(_f){
var _10=$(_9);
if(_b.url){
_10.attr("action",_b.url);
}
var t=_10.attr("target"),a=_10.attr("action");
_10.attr("target",_c);
var _11=$();
try{
for(var n in _f){
var _12=$("<input type=\"hidden\" name=\""+n+"\">").val(_f[n]).appendTo(_10);
_11=_11.add(_12);
}
_13();
_10[0].submit();
}
finally{
_10.attr("action",a);
t?_10.attr("target",t):_10.removeAttr("target");
_11.remove();
}
};
function _13(){
var f=$("#"+_c);
if(!f.length){
return;
}
try{
var s=f.contents()[0].readyState;
if(s&&s.toLowerCase()=="uninitialized"){
setTimeout(_13,100);
}
}
catch(e){
cb();
}
};
var _14=10;
function cb(){
var f=$("#"+_c);
if(!f.length){
return;
}
f.unbind();
var _15="";
try{
var _16=f.contents().find("body");
_15=_16.html();
if(_15==""){
if(--_14){
setTimeout(cb,100);
return;
}
}
var ta=_16.find(">textarea");
if(ta.length){
_15=ta.val();
}else{
var pre=_16.find(">pre");
if(pre.length){
_15=pre.html();
}
}
}
catch(e){
}
_b.success.call(_9,_15);
setTimeout(function(){
f.unbind();
f.remove();
},100);
};
};
function _8(_17,_18){
var _19=$.data(_17,"form").options;
var _1a=new FormData($(_17)[0]);
for(var _1b in _18){
_1a.append(_1b,_18[_1b]);
}
$.ajax({url:_19.url,type:"post",xhr:function(){
var xhr=$.ajaxSettings.xhr();
if(xhr.upload){
xhr.upload.addEventListener("progress",function(e){
if(e.lengthComputable){
var _1c=e.total;
var _1d=e.loaded||e.position;
var _1e=Math.ceil(_1d*100/_1c);
_19.onProgress.call(_17,_1e);
}
},false);
}
return xhr;
},data:_1a,dataType:"html",cache:false,contentType:false,processData:false,complete:function(res){
_19.success.call(_17,res.responseText);
}});
};
function _1f(_20,_21){
var _22=$.data(_20,"form").options;
if(typeof _21=="string"){
var _23={};
if(_22.onBeforeLoad.call(_20,_23)==false){
return;
}
$.ajax({url:_21,data:_23,dataType:"json",success:function(_24){
_25(_24);
},error:function(){
_22.onLoadError.apply(_20,arguments);
}});
}else{
_25(_21);
}
function _25(_26){
var _27=$(_20);
for(var _28 in _26){
var val=_26[_28];
if(!_29(_28,val)){
if(!_2a(_28,val)){
_27.find("input[name=\""+_28+"\"]").val(val);
_27.find("textarea[name=\""+_28+"\"]").val(val);
_27.find("select[name=\""+_28+"\"]").val(val);
}
}
}
_22.onLoadSuccess.call(_20,_26);
_27.form("validate");
};
function _29(_2b,val){
var cc=$(_20).find("[switchbuttonName=\""+_2b+"\"]");
if(cc.length){
cc.switchbutton("uncheck");
cc.each(function(){
if(_2c($(this).switchbutton("options").value,val)){
$(this).switchbutton("check");
}
});
return true;
}
cc=$(_20).find("input[name=\""+_2b+"\"][type=radio], input[name=\""+_2b+"\"][type=checkbox]");
if(cc.length){
cc._propAttr("checked",false);
cc.each(function(){
if(_2c($(this).val(),val)){
$(this)._propAttr("checked",true);
}
});
return true;
}
return false;
};
function _2c(v,val){
if(v==String(val)||$.inArray(v,$.isArray(val)?val:[val])>=0){
return true;
}else{
return false;
}
};
function _2a(_2d,val){
var _2e=$(_20).find("[textboxName=\""+_2d+"\"],[sliderName=\""+_2d+"\"]");
if(_2e.length){
for(var i=0;i<_22.fieldTypes.length;i++){
var _2f=_22.fieldTypes[i];
var _30=_2e.data(_2f);
if(_30){
if(_30.options.multiple||_30.options.range){
_2e[_2f]("setValues",val);
}else{
_2e[_2f]("setValue",val);
}
return true;
}
}
}
return false;
};
};
function _31(_32){
$("input,select,textarea",_32).each(function(){
var t=this.type,tag=this.tagName.toLowerCase();
if(t=="text"||t=="hidden"||t=="password"||tag=="textarea"){
this.value="";
}else{
if(t=="file"){
var _33=$(this);
if(!_33.hasClass("textbox-value")){
var _34=_33.clone().val("");
_34.insertAfter(_33);
if(_33.data("validatebox")){
_33.validatebox("destroy");
_34.validatebox();
}else{
_33.remove();
}
}
}else{
if(t=="checkbox"||t=="radio"){
this.checked=false;
}else{
if(tag=="select"){
this.selectedIndex=-1;
}
}
}
}
});
var _35=$(_32);
var _36=$.data(_32,"form").options;
for(var i=_36.fieldTypes.length-1;i>=0;i--){
var _37=_36.fieldTypes[i];
var _38=_35.find("."+_37+"-f");
if(_38.length&&_38[_37]){
_38[_37]("clear");
}
}
_35.form("validate");
};
function _39(_3a){
_3a.reset();
var _3b=$(_3a);
var _3c=$.data(_3a,"form").options;
for(var i=_3c.fieldTypes.length-1;i>=0;i--){
var _3d=_3c.fieldTypes[i];
var _3e=_3b.find("."+_3d+"-f");
if(_3e.length&&_3e[_3d]){
_3e[_3d]("reset");
}
}
_3b.form("validate");
};
function _3f(_40){
var _41=$.data(_40,"form").options;
$(_40).unbind(".form");
if(_41.ajax){
$(_40).bind("submit.form",function(){
setTimeout(function(){
_1(_40,_41);
},0);
return false;
});
}
$(_40).bind("_change.form",function(e,t){
_41.onChange.call(this,t);
}).bind("change.form",function(e){
var t=e.target;
if(!$(t).hasClass("textbox-text")){
_41.onChange.call(this,t);
}
});
_42(_40,_41.novalidate);
};
function _43(_44,_45){
_45=_45||{};
var _46=$.data(_44,"form");
if(_46){
$.extend(_46.options,_45);
}else{
$.data(_44,"form",{options:$.extend({},$.fn.form.defaults,$.fn.form.parseOptions(_44),_45)});
}
};
function _47(_48){
if($.fn.validatebox){
var t=$(_48);
t.find(".validatebox-text:not(:disabled)").validatebox("validate");
var _49=t.find(".validatebox-invalid");
_49.filter(":not(:disabled):first").focus();
return _49.length==0;
}
return true;
};
function _42(_4a,_4b){
var _4c=$.data(_4a,"form").options;
_4c.novalidate=_4b;
$(_4a).find(".validatebox-text:not(:disabled)").validatebox(_4b?"disableValidation":"enableValidation");
};
$.fn.form=function(_4d,_4e){
if(typeof _4d=="string"){
this.each(function(){
_43(this);
});
return $.fn.form.methods[_4d](this,_4e);
}
return this.each(function(){
_43(this,_4d);
_3f(this);
});
};
$.fn.form.methods={options:function(jq){
return $.data(jq[0],"form").options;
},submit:function(jq,_4f){
return jq.each(function(){
_1(this,_4f);
});
},load:function(jq,_50){
return jq.each(function(){
_1f(this,_50);
});
},clear:function(jq){
return jq.each(function(){
_31(this);
});
},reset:function(jq){
return jq.each(function(){
_39(this);
});
},validate:function(jq){
return _47(jq[0]);
},disableValidation:function(jq){
return jq.each(function(){
_42(this,true);
});
},enableValidation:function(jq){
return jq.each(function(){
_42(this,false);
});
},resetValidation:function(jq){
return jq.each(function(){
$(this).find(".validatebox-text:not(:disabled)").validatebox("resetValidation");
});
}};
$.fn.form.parseOptions=function(_51){
var t=$(_51);
return $.extend({},$.parser.parseOptions(_51,[{ajax:"boolean"}]),{url:(t.attr("action")?t.attr("action"):undefined)});
};
$.fn.form.defaults={fieldTypes:["combobox","combotree","combogrid","datetimebox","datebox","combo","datetimespinner","timespinner","numberspinner","spinner","slider","searchbox","numberbox","textbox","switchbutton"],novalidate:false,ajax:true,iframe:true,url:null,queryParams:{},onSubmit:function(_52){
return $(this).form("validate");
},onProgress:function(_53){
},success:function(_54){
},onBeforeLoad:function(_55){
},onLoadSuccess:function(_56){
},onLoadError:function(){
},onChange:function(_57){
}};
})(jQuery);

