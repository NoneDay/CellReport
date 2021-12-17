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
$(_2).addClass("textbox-f").hide();
var _3=$("<span class=\"textbox\">"+"<input class=\"textbox-text\" autocomplete=\"off\">"+"<input type=\"hidden\" class=\"textbox-value\">"+"</span>").insertAfter(_2);
var _4=$(_2).attr("name");
if(_4){
_3.find("input.textbox-value").attr("name",_4);
$(_2).removeAttr("name").attr("textboxName",_4);
}
return _3;
};
function _5(_6){
var _7=$.data(_6,"textbox");
var _8=_7.options;
var tb=_7.textbox;
tb.find(".textbox-text").remove();
if(_8.multiline){
$("<textarea class=\"textbox-text\" autocomplete=\"off\"></textarea>").prependTo(tb);
}else{
$("<input type=\""+_8.type+"\" class=\"textbox-text\" autocomplete=\"off\">").prependTo(tb);
}
tb.find(".textbox-addon").remove();
var bb=_8.icons?$.extend(true,[],_8.icons):[];
if(_8.iconCls){
bb.push({iconCls:_8.iconCls,disabled:true});
}
if(bb.length){
var bc=$("<span class=\"textbox-addon\"></span>").prependTo(tb);
bc.addClass("textbox-addon-"+_8.iconAlign);
for(var i=0;i<bb.length;i++){
bc.append("<a href=\"javascript:void(0)\" class=\"textbox-icon "+bb[i].iconCls+"\" icon-index=\""+i+"\" tabindex=\"-1\"></a>");
}
}
tb.find(".textbox-button").remove();
if(_8.buttonText||_8.buttonIcon){
var _9=$("<a href=\"javascript:void(0)\" class=\"textbox-button\"></a>").prependTo(tb);
_9.addClass("textbox-button-"+_8.buttonAlign).linkbutton({text:_8.buttonText,iconCls:_8.buttonIcon});
}
_a(_6);
_b(_6,_8.disabled);
_c(_6,_8.readonly);
};
function _d(_e){
var tb=$.data(_e,"textbox").textbox;
tb.find(".textbox-text").validatebox("destroy");
tb.remove();
$(_e).remove();
};
function _f(_10,_11){
var _12=$.data(_10,"textbox");
var _13=_12.options;
var tb=_12.textbox;
var _14=tb.parent();
if(_11){
_13.width=_11;
}
if(isNaN(parseInt(_13.width))){
var c=$(_10).clone();
c.css("visibility","hidden");
c.insertAfter(_10);
_13.width=c.outerWidth();
c.remove();
}
var _15=tb.is(":visible");
if(!_15){
tb.appendTo("body");
}
var _16=tb.find(".textbox-text");
var btn=tb.find(".textbox-button");
var _17=tb.find(".textbox-addon");
var _18=_17.find(".textbox-icon");
tb._size(_13,_14);
btn.linkbutton("resize",{height:tb.height()});
btn.css({left:(_13.buttonAlign=="left"?0:""),right:(_13.buttonAlign=="right"?0:"")});
_17.css({left:(_13.iconAlign=="left"?(_13.buttonAlign=="left"?btn._outerWidth():0):""),right:(_13.iconAlign=="right"?(_13.buttonAlign=="right"?btn._outerWidth():0):"")});
_18.css({width:_13.iconWidth+"px",height:tb.height()+"px"});
_16.css({paddingLeft:(_10.style.paddingLeft||""),paddingRight:(_10.style.paddingRight||""),marginLeft:_19("left"),marginRight:_19("right")});
if(_13.multiline){
_16.css({paddingTop:(_10.style.paddingTop||""),paddingBottom:(_10.style.paddingBottom||"")});
_16._outerHeight(tb.height());
}else{
_16.css({paddingTop:0,paddingBottom:0,height:tb.height()+"px",lineHeight:tb.height()+"px"});
}
_16._outerWidth(tb.width()-_18.length*_13.iconWidth-btn._outerWidth());
if(!_15){
tb.insertAfter(_10);
}
_13.onResize.call(_10,_13.width,_13.height);
function _19(_1a){
return (_13.iconAlign==_1a?_17._outerWidth():0)+(_13.buttonAlign==_1a?btn._outerWidth():0);
};
};
function _a(_1b){
var _1c=$(_1b).textbox("options");
var _1d=$(_1b).textbox("textbox");
_1d.validatebox($.extend({},_1c,{deltaX:$(_1b).textbox("getTipX"),onBeforeValidate:function(){
_1c.onBeforeValidate.call(_1b);
var box=$(this);
if(!box.is(":focus")){
_1c.oldInputValue=box.val();
box.val(_1c.value);
}
},onValidate:function(_1e){
var box=$(this);
if(_1c.oldInputValue!=undefined){
box.val(_1c.oldInputValue);
_1c.oldInputValue=undefined;
}
var tb=box.parent();
if(_1e){
tb.removeClass("textbox-invalid");
}else{
tb.addClass("textbox-invalid");
}
_1c.onValidate.call(_1b,_1e);
}}));
};
function _1f(_20){
var _21=$.data(_20,"textbox");
var _22=_21.options;
var tb=_21.textbox;
var _23=tb.find(".textbox-text");
_23.attr("placeholder",_22.prompt);
_23.unbind(".textbox");
if(!_22.disabled&&!_22.readonly){
_23.bind("blur.textbox",function(e){
if(!tb.hasClass("textbox-focused")){
return;
}
_22.value=$(this).val();
if(_22.value==""){
$(this).val(_22.prompt).addClass("textbox-prompt");
}else{
$(this).removeClass("textbox-prompt");
}
tb.removeClass("textbox-focused");
}).bind("focus.textbox",function(e){
if(tb.hasClass("textbox-focused")){
return;
}
if($(this).val()!=_22.value){
$(this).val(_22.value);
}
$(this).removeClass("textbox-prompt");
tb.addClass("textbox-focused");
});
for(var _24 in _22.inputEvents){
_23.bind(_24+".textbox",{target:_20},_22.inputEvents[_24]);
}
}
var _25=tb.find(".textbox-addon");
_25.unbind().bind("click",{target:_20},function(e){
var _26=$(e.target).closest("a.textbox-icon:not(.textbox-icon-disabled)");
if(_26.length){
var _27=parseInt(_26.attr("icon-index"));
var _28=_22.icons[_27];
if(_28&&_28.handler){
_28.handler.call(_26[0],e);
_22.onClickIcon.call(_20,_27);
}
}
});
_25.find(".textbox-icon").each(function(_29){
var _2a=_22.icons[_29];
var _2b=$(this);
if(!_2a||_2a.disabled||_22.disabled||_22.readonly){
_2b.addClass("textbox-icon-disabled");
}else{
_2b.removeClass("textbox-icon-disabled");
}
});
var btn=tb.find(".textbox-button");
btn.unbind(".textbox").bind("click.textbox",function(){
if(!btn.linkbutton("options").disabled){
_22.onClickButton.call(_20);
}
});
btn.linkbutton((_22.disabled||_22.readonly)?"disable":"enable");
tb.unbind(".textbox").bind("_resize.textbox",function(e,_2c){
if($(this).hasClass("easyui-fluid")||_2c){
_f(_20);
}
return false;
});
};
function _b(_2d,_2e){
var _2f=$.data(_2d,"textbox");
var _30=_2f.options;
var tb=_2f.textbox;
var _31=tb.find(".textbox-text");
var ss=$(_2d).add(tb.find(".textbox-value"));
_30.disabled=_2e;
if(_30.disabled){
_31.validatebox("disable");
tb.addClass("textbox-disabled");
ss.attr("disabled","disabled");
}else{
_31.validatebox("enable");
tb.removeClass("textbox-disabled");
ss.removeAttr("disabled");
}
};
function _c(_32,_33){
var _34=$.data(_32,"textbox");
var _35=_34.options;
var tb=_34.textbox;
var _36=tb.find(".textbox-text");
_36.validatebox("readonly",_33);
_35.readonly=_36.validatebox("options").readonly;
tb.removeClass("textbox-readonly").addClass(_35.readonly?"textbox-readonly":"");
};
$.fn.textbox=function(_37,_38){
if(typeof _37=="string"){
var _39=$.fn.textbox.methods[_37];
if(_39){
return _39(this,_38);
}else{
return this.each(function(){
var _3a=$(this).textbox("textbox");
_3a.validatebox(_37,_38);
});
}
}
_37=_37||{};
return this.each(function(){
var _3b=$.data(this,"textbox");
if(_3b){
$.extend(_3b.options,_37);
if(_37.value!=undefined){
_3b.options.originalValue=_37.value;
}
}else{
_3b=$.data(this,"textbox",{options:$.extend({},$.fn.textbox.defaults,$.fn.textbox.parseOptions(this),_37),textbox:_1(this)});
_3b.options.originalValue=_3b.options.value;
}
_5(this);
_1f(this);
_f(this);
$(this).textbox("initValue",_3b.options.value);
});
};
$.fn.textbox.methods={options:function(jq){
return $.data(jq[0],"textbox").options;
},cloneFrom:function(jq,_3c){
return jq.each(function(){
var t=$(this);
if(t.data("textbox")){
return;
}
if(!$(_3c).data("textbox")){
$(_3c).textbox();
}
var _3d=t.attr("name")||"";
t.addClass("textbox-f").hide();
t.removeAttr("name").attr("textboxName",_3d);
var _3e=$(_3c).next().clone().insertAfter(t);
_3e.find("input.textbox-value").attr("name",_3d);
$.data(this,"textbox",{options:$.extend(true,{},$(_3c).textbox("options")),textbox:_3e});
var _3f=$(_3c).textbox("button");
if(_3f.length){
t.textbox("button").linkbutton($.extend(true,{},_3f.linkbutton("options")));
}
_1f(this);
_a(this);
});
},textbox:function(jq){
return $.data(jq[0],"textbox").textbox.find(".textbox-text");
},button:function(jq){
return $.data(jq[0],"textbox").textbox.find(".textbox-button");
},destroy:function(jq){
return jq.each(function(){
_d(this);
});
},resize:function(jq,_40){
return jq.each(function(){
_f(this,_40);
});
},disable:function(jq){
return jq.each(function(){
_b(this,true);
_1f(this);
});
},enable:function(jq){
return jq.each(function(){
_b(this,false);
_1f(this);
});
},readonly:function(jq,_41){
return jq.each(function(){
_c(this,_41);
_1f(this);
});
},isValid:function(jq){
return jq.textbox("textbox").validatebox("isValid");
},clear:function(jq){
return jq.each(function(){
$(this).textbox("setValue","");
});
},setText:function(jq,_42){
return jq.each(function(){
var _43=$(this).textbox("options");
var _44=$(this).textbox("textbox");
_42=_42==undefined?"":String(_42);
if($(this).textbox("getText")!=_42){
_44.val(_42);
}
_43.value=_42;
if(!_44.is(":focus")){
if(_42){
_44.removeClass("textbox-prompt");
}else{
_44.val(_43.prompt).addClass("textbox-prompt");
}
}
$(this).textbox("validate");
});
},initValue:function(jq,_45){
return jq.each(function(){
var _46=$.data(this,"textbox");
_46.options.value="";
$(this).textbox("setText",_45);
_46.textbox.find(".textbox-value").val(_45);
$(this).val(_45);
});
},setValue:function(jq,_47){
return jq.each(function(){
var _48=$.data(this,"textbox").options;
var _49=$(this).textbox("getValue");
$(this).textbox("initValue",_47);
if(_49!=_47){
_48.onChange.call(this,_47,_49);
$(this).closest("form").trigger("_change",[this]);
}
});
},getText:function(jq){
var _4a=jq.textbox("textbox");
if(_4a.is(":focus")){
return _4a.val();
}else{
return jq.textbox("options").value;
}
},getValue:function(jq){
return jq.data("textbox").textbox.find(".textbox-value").val();
},reset:function(jq){
return jq.each(function(){
var _4b=$(this).textbox("options");
$(this).textbox("setValue",_4b.originalValue);
});
},getIcon:function(jq,_4c){
return jq.data("textbox").textbox.find(".textbox-icon:eq("+_4c+")");
},getTipX:function(jq){
var _4d=jq.data("textbox");
var _4e=_4d.options;
var tb=_4d.textbox;
var _4f=tb.find(".textbox-text");
var _50=tb.find(".textbox-addon")._outerWidth();
var _51=tb.find(".textbox-button")._outerWidth();
if(_4e.tipPosition=="right"){
return (_4e.iconAlign=="right"?_50:0)+(_4e.buttonAlign=="right"?_51:0)+1;
}else{
if(_4e.tipPosition=="left"){
return (_4e.iconAlign=="left"?-_50:0)+(_4e.buttonAlign=="left"?-_51:0)-1;
}else{
return _50/2*(_4e.iconAlign=="right"?1:-1);
}
}
}};
$.fn.textbox.parseOptions=function(_52){
var t=$(_52);
return $.extend({},$.fn.validatebox.parseOptions(_52),$.parser.parseOptions(_52,["prompt","iconCls","iconAlign","buttonText","buttonIcon","buttonAlign",{multiline:"boolean",iconWidth:"number"}]),{value:(t.val()||undefined),type:(t.attr("type")?t.attr("type"):undefined)});
};
$.fn.textbox.defaults=$.extend({},$.fn.validatebox.defaults,{width:"auto",height:22,prompt:"",value:"",type:"text",multiline:false,icons:[],iconCls:null,iconAlign:"right",iconWidth:18,buttonText:"",buttonIcon:null,buttonAlign:"right",inputEvents:{blur:function(e){
var t=$(e.data.target);
var _53=t.textbox("options");
t.textbox("setValue",_53.value);
},keydown:function(e){
if(e.keyCode==13){
var t=$(e.data.target);
t.textbox("setValue",t.textbox("getText"));
}
}},onChange:function(_54,_55){
},onResize:function(_56,_57){
},onClickButton:function(){
},onClickIcon:function(_58){
}});
})(jQuery);

