/**
 * edatagrid - jQuery EasyUI
 * 
 * Licensed under the GPL:
 *   http://www.gnu.org/licenses/gpl.txt
 *
 * Copyright 2011 stworthy [ stworthy@gmail.com ] 
 * 
 * Dependencies:
 *   datagrid
 *   messager
 * 
 */
 (function($){
	$.extend($.fn.datagrid.defaults.editors, {   
      textarea: {   
				 init: function(container, options){   
				             var input = $('<textarea class="datagrid-editable-input" rows='+options.rows+'></textarea>').appendTo(container);   
				             return input;   
				          },   
				 getValue: function(target){   return $(target).val();   },   
				 setValue: function(target, value){   $(target).val(value);   },   
				 resize: function(target, width){   				 
				             var input = $(target);   
				             if ($.boxModel == true){   
				                 input.width(width - (input.outerWidth() - input.width()));   
				             } else {   
				                 input.width(width);   
				             }   
				         }   
				     }   
	 }); 
	function buildGrid(target){
		var opts = $.data(target, 'edatagrid').options;
		$(target).datagrid($.extend({}, opts, {
			onDblClickCell:function(index,field){
				if (opts.editing){
					$(this).edatagrid('editRow', index);
					focusEditor(field);
				}
			},
			onClickCell:function(index,field){
				if (opts.editing && opts.editIndex >= 0 ){
					$(this).edatagrid('editRow', index);
					focusEditor(field);
				}
			},
			onAfterEdit: function(index, row ,changes){
				if(row.__hasError){
					alert("有错误，不能保存");
					//$(target).datagrid('beginEdit', opts.editIndex);
					return;
				}
				delete row.__hasError;
				opts.editIndex = undefined;
				var changes_cnt=0;
				for(var name in changes)changes_cnt++;
				if(changes_cnt==0 && !row.isNewRecord) return;
				var url = row.isNewRecord ? opts.saveUrl : opts.updateUrl;
				if (url){
	        var effectRow = new Object();  
          if (row.isNewRecord) {  
              effectRow["__inserted"] = encodeURIComponent("=["+eval("'"+JSON.stringify(row)+"'")+"]");  
          } else {  
              effectRow["__updated"] = encodeURIComponent("=["+eval("'"+JSON.stringify(row)+"'")+"]");  
          } 
             
           if(!effectRow["__inserted"] && !effectRow["__updated"]) return;    
            $.messager.progress({  msg:'正在处理，请稍候。。。'  });  
				var dg=$(this);
					$.post(url, effectRow, function(data, textStatus, jqXHR){
						$.messager.progress('close');  
						if(data.error){
							$.messager.alert('错误警告',data.error);  

							dg.edatagrid('editRow', index);

							return;
							}
						data.isNewRecord = null;
						$(target).datagrid('updateRow', {
							index: index,
							row: data
						});
						 			
						
						if (opts.tree){
							var idValue = row[opts.idField||'id'];
							var t = $(opts.tree);
							var node = t.tree('find', idValue);
							if (node){
								node.text = row[opts.treeTextField];
								t.tree('update', node);
							} else {
								var pnode = t.tree('find', row[opts.treeParentField]);
								t.tree('append', {
									parent: (pnode ? pnode.target : null),
									data: [{id:idValue,text:row[opts.treeTextField]}]
								});
							}
						}
						opts.onSave.call(target, index, row);
					},'json');
				} else {
					opts.onSave.call(target, index, row);
				}
				if (opts.onAfterEdit) opts.onAfterEdit.call(target, index, row);
				  
			},
			onCancelEdit: function(index, row){
				opts.editIndex = undefined;
				if (row.isNewRecord) {
					$(this).datagrid('deleteRow', index);
				}
				if (opts.onCancelEdit) opts.onCancelEdit.call(target, index, row);
			},
			onBeforeLoad: function(param){
				$(this).datagrid('rejectChanges');
				if (opts.tree){
					var node = $(opts.tree).tree('getSelected');
					param[opts.treeParentField] = node ? node.id : undefined;
				}
				if (opts.onBeforeLoad) opts.onBeforeLoad.call(target, param);
			}
		}));
		
		function focusEditor(field){
			var editor = $(target).datagrid('getEditor', {index:opts.editIndex,field:field});
			if (editor){
				editor.target.focus();
			} else {
				var editors = $(target).datagrid('getEditors', opts.editIndex);
				if (editors.length){
					editors[0].target.focus();
				}
			}
		}
		
		if (opts.tree){
			$(opts.tree).tree({
				url: opts.treeUrl,
				onClick: function(node){
					$(target).datagrid('load');
				},
				onDrop: function(dest,source,point){
					var targetId = $(this).tree('getNode', dest).id;
					$.ajax({
						url: opts.treeDndUrl,
						type:'post',
						data:{
							id:source.id,
							targetId:targetId,
							point:point
						},
						dataType:'json',
						success:function(){
							$(target).datagrid('load');
						}
					});
				}
			});
		}
	}
	
	$.fn.edatagrid = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.edatagrid.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.datagrid(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'edatagrid');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'edatagrid', {
					options: $.extend({}, $.fn.edatagrid.defaults, $.fn.edatagrid.parseOptions(this), options)
				});
			}
			buildGrid(this);
		});
	};
	
	$.fn.edatagrid.parseOptions = function(target){
		return $.extend({}, $.fn.datagrid.parseOptions(target), {
		});
	};
	
	$.fn.edatagrid.methods = {
		options: function(jq){
			var opts = $.data(jq[0], 'edatagrid').options;
			return opts;
		},
		enableEditing: function(jq){
			return jq.each(function(){
				var opts = $.data(this, 'edatagrid').options;
				opts.editing = true;
			});
		},
		disableEditing: function(jq){
			return jq.each(function(){
				var opts = $.data(this, 'edatagrid').options;
				opts.editing = false;
			});
		},
		editRow: function(jq, index){
			return jq.each(function(){
				var dg = $(this);
				if(!index){
					var row = dg.datagrid('getSelected');
					index = dg.datagrid('getRowIndex', row);
				}
				var opts = $.data(this, 'edatagrid').options;
				var editIndex = opts.editIndex;
				if (editIndex != index){
					if (dg.datagrid('validateRow', editIndex)){
						if (editIndex>=0){
							if (opts.onBeforeSave.call(this, editIndex) == false) {
								setTimeout(function(){
									dg.datagrid('selectRow', editIndex);
								},0);
								return;
							}
						}
						if(opts.editIndex>=0 && dg.datagrid('getData').rows[opts.editIndex].__hasError)
							return;
						dg.datagrid('endEdit', editIndex);
						dg.datagrid('beginEdit', index);
						opts.editIndex = index;
//-------
						$(dg.datagrid('getEditors',opts.editIndex)).each(function(i,a_editor){
							var cur_opt=dg.datagrid('getColumnOption',a_editor.field).editor.options;
							if(cur_opt && cur_opt.focus && typeof(cur_opt.focus)=='function'){								
								a_editor.target.bind('focus',function(){									
										cur_opt.focus(a_editor,dg,opts.editIndex,dg.datagrid('getData').rows[opts.editIndex]);
									});
							}
							if(cur_opt && cur_opt.blur && typeof(cur_opt.blur)=='function'){								
								a_editor.target.bind('blur',function(){									
										cur_opt.blur(a_editor,dg,opts.editIndex,dg.datagrid('getData').rows[opts.editIndex]);
									});
							}
							});
//-------							
						var rows = dg.datagrid('getRows');
						opts.onEdit.call(this, index, rows[index]);
					} else {
						setTimeout(function(){
							dg.datagrid('selectRow', editIndex);
						}, 0);
					}
				}
			});
		},
		addRow: function(jq){
			return jq.each(function(){
				var dg = $(this);
				var opts = $.data(this, 'edatagrid').options;
				if (opts.editIndex >= 0){
					if (!dg.datagrid('validateRow', opts.editIndex)){
						dg.datagrid('selectRow', opts.editIndex);
						return;
					}
					if (opts.onBeforeSave.call(this, opts.editIndex) == false){
						setTimeout(function(){
							dg.datagrid('selectRow', opts.editIndex);
						},0);
						return;
					}
					dg.datagrid('endEdit', opts.editIndex);
				}
				dg.datagrid('appendRow', {isNewRecord:true});
				var rows = dg.datagrid('getRows');
				opts.editIndex = rows.length - 1;
				dg.datagrid('beginEdit', opts.editIndex);
				dg.datagrid('selectRow', opts.editIndex);
//-------
				$(dg.datagrid('getEditors',opts.editIndex)).each(function(i,a_editor){
								var cur_opt=dg.datagrid('getColumnOption',a_editor.field).editor.options;
								if(cur_opt && cur_opt.focus && typeof(cur_opt.focus)=='function'){								
								a_editor.target.bind('focus',function(){									
										cur_opt.focus(a_editor,dg,opts.editIndex,dg.datagrid('getData').rows[opts.editIndex]);
									});
							}
							if(cur_opt && cur_opt.blur && typeof(cur_opt.blur)=='function'){								
								a_editor.target.bind('blur',function(){									
										cur_opt.blur(a_editor,dg,opts.editIndex,dg.datagrid('getData').rows[opts.editIndex]);
									});
							}
							});
//-------							
				if (opts.tree){
					var node = $(opts.tree).tree('getSelected');
					rows[opts.editIndex][opts.treeParentField] = (node ? node.id : 0);
				}
				
				opts.onAdd.call(this, opts.editIndex, rows[opts.editIndex]);
			});
		},
		saveRow: function(jq){
			return jq.each(function(){
				var dg = $(this);
				var opts = $.data(this, 'edatagrid').options;
				if (opts.onBeforeSave.call(this, opts.editIndex) == false) {
					setTimeout(function(){
						dg.datagrid('selectRow', opts.editIndex);
					},0);
					return;
				}
				if(opts.editIndex>=0 && dg.datagrid('getData').rows[opts.editIndex].__hasError)
					return;
				$(this).datagrid('endEdit', opts.editIndex);
			});
		},
		cancelRow: function(jq){
			return jq.each(function(){
				var index = $(this).edatagrid('options').editIndex;
				$(this).datagrid('cancelEdit', index);
			});
		},
		destroyRow: function(jq){
			return jq.each(function(){
				var dg = $(this);
				var opts = $.data(this, 'edatagrid').options;
				var row = dg.datagrid('getSelected');
				if (!row){
					$.messager.show({
						title: opts.destroyMsg.norecord.title,
						msg: opts.destroyMsg.norecord.msg
					});
					return;
				}
				$.messager.confirm(opts.destroyMsg.confirm.title,opts.destroyMsg.confirm.msg,function(r){
					if (r){
						var index = dg.datagrid('getRowIndex', row);
						if (row.isNewRecord){
							dg.datagrid('cancelEdit', index);
						} else {
							if (opts.destroyUrl){
								var idValue = row[opts.idField||'id'];
								var effectRow = new Object();  
								effectRow["__deleted"] = encodeURIComponent("=["+eval("'"+JSON.stringify(row)+"'")+"]");  
								 $.messager.progress({  msg:'正在处理，请稍候。。。'  });  
								 $.post(opts.destroyUrl, effectRow, function(){
									if (opts.tree){
										dg.datagrid('reload');
										var t = $(opts.tree);
										var node = t.tree('find', idValue);
										if (node){
											t.tree('remove', node.target);
										}
									} else {
										dg.datagrid('cancelEdit', index);
										dg.datagrid('deleteRow', index);
									}
									opts.onDestroy.call(dg[0], index, row);
								  $.messager.progress('close');  
								});
							} else {
								dg.datagrid('cancelEdit', index);
								dg.datagrid('deleteRow', index);
								opts.onDestroy.call(dg[0], index, row);
							}
						}
					}
				});
			});
		}
	};
	
	$.fn.edatagrid.defaults = $.extend({}, $.fn.datagrid.defaults, {
		editing: true,
		editIndex: -1,
		destroyMsg:{
			norecord:{
				title:'Warning',
				msg:'No record is selected.'
			},
			confirm:{
				title:'Confirm',
				msg:'Are you sure you want to delete?'
			}
		},
//		destroyConfirmTitle: 'Confirm',
//		destroyConfirmMsg: 'Are you sure you want to delete?',
		
		url: null,	// return the datagrid data
		saveUrl: null,	// return the added row
		updateUrl: null,	// return the updated row
		destroyUrl: null,	// return {success:true}
		
		tree: null,		// the tree selector
		treeUrl: null,	// return tree data
		treeDndUrl: null,	// to process the drag and drop operation, return {success:true}
		treeTextField: 'name',
		treeParentField: 'parentId',

		onFocusCell: function(index){},
		onBlurCell: function(index){},
				
		onAdd: function(index, row){},
		onEdit: function(index, row){},
		onBeforeSave: function(index){},
		onSave: function(index, row){},
		onDestroy: function(index, row){}
	});
})(jQuery);


          		