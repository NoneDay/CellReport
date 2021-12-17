var scrollview = $.extend({}, $.fn.datagrid.defaults.view, {
	render: function(target, container, frozen){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var rows = this.rows || [];
		if (!rows.length) {
			return;
		}
		var fields = $(target).datagrid('getColumnFields', frozen);
		
		if (frozen){
			if (!(opts.rownumbers || (opts.frozenColumns && opts.frozenColumns.length))){
				return;
			}
		}
		
		var index = this.index;
		var table = ['<table class="datagrid-btable" cellspacing="0" cellpadding="0" border="0"><tbody>'];
		for(var i=0; i<rows.length; i++) {
			// get the class and style attributes for this row
			var cls = (index % 2 && opts.striped) ? 'class="datagrid-row datagrid-row-alt"' : 'class="datagrid-row"';
			var styleValue = opts.rowStyler ? opts.rowStyler.call(target, index, rows[i]) : '';
			var style = styleValue ? 'style="' + styleValue + '"' : '';
			var rowId = state.rowIdPrefix + '-' + (frozen?1:2) + '-' + index;
			table.push('<tr id="' + rowId + '" datagrid-row-index="' + index + '" ' + cls + ' ' + style + '>');
			table.push(this.renderRow.call(this, target, fields, frozen, index, rows[i]));
			table.push('</tr>');
			index++;
		}
		table.push('</tbody></table>');
		
		$(container).html(table.join(''));
	},
	
	onBeforeRender: function(target){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var dc = state.dc;
		var view = this;
		
		// erase the onLoadSuccess event, make sure it can't be triggered
		state.onLoadSuccess = opts.onLoadSuccess;
		opts.onLoadSuccess = function(){};
		
		opts.finder.getRow = function(t, index){
			var row = $.data(t, 'datagrid').data.rows[index];
			if (!row){
				var v = $(t).datagrid('options').view;
				row = v.rows[index - v.index];
			}
			return row;
		};
		
		dc.body1.add(dc.body2).empty();
		this.rows = undefined;	// the rows to be rendered
		this.r1 = this.r2 = [];	// the first part and last part of rows
		dc.body2.unbind('.datagrid').bind('scroll.datagrid', function(e){
			if (state.onLoadSuccess){
				opts.onLoadSuccess = state.onLoadSuccess;	// restore the onLoadSuccess event
				state.onLoadSuccess = undefined;
			}
			if (view.scrollTimer){
				clearTimeout(view.scrollTimer);
			}
			view.scrollTimer = setTimeout(function(){
				scrolling.call(view);
			}, 50);
		});
		
		function scrolling(){
			if (dc.body2.is(':empty')){
				reload.call(this);
			} else {
				var firstTr = opts.finder.getTr(target, this.index, 'body', 2);
				var lastTr = opts.finder.getTr(target, 0, 'last', 2);
				var headerHeight = dc.view2.children('div.datagrid-header').outerHeight();
				var top = firstTr.position().top - headerHeight;
				var bottom = lastTr.position().top + lastTr.outerHeight() - headerHeight;
				
				if (top > dc.body2.height() || bottom < 0){
					reload.call(this);
				} else if (top > 0){
					var page = Math.floor(this.index/opts.pageSize);
					this.getRows.call(this, target, page, function(rows){
						this.r2 = this.r1;
						this.r1 = rows;
						this.index = (page-1)*opts.pageSize;
						this.rows = this.r1.concat(this.r2);
						this.populate.call(this, target);
					});
				} else if (bottom < dc.body2.height()){
					var page = Math.floor(this.index/opts.pageSize)+2;
					if (this.r2.length){
						page++;
					}
					this.getRows.call(this, target, page, function(rows){
						if (!this.r2.length){
							this.r2 = rows;
						} else {
							this.r1 = this.r2;
							this.r2 = rows;
							this.index += opts.pageSize;
						}
						this.rows = this.r1.concat(this.r2);
						this.populate.call(this, target);
					});
				}
			}
			
			function reload(){
				var top = $(dc.body2).scrollTop();
				var index = Math.floor(top/25);
				var page = Math.floor(index/opts.pageSize) + 1;
				
				this.getRows.call(this, target, page, function(rows){
					this.index = (page-1)*opts.pageSize;
					this.rows = rows;
					this.r1 = rows;
					this.r2 = [];
					this.populate.call(this, target);
					dc.body2.triggerHandler('scroll.datagrid');
				});
			}
		}
	},
	
	getRows: function(target, page, callback){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var index = (page-1)*opts.pageSize;
		var rows = state.data.rows.slice(index, index+opts.pageSize);
		if (rows.length){
			callback.call(this, rows);
			
		} else {
			var param = $.extend({}, opts.queryParams, {
				page: page,
				rows: opts.pageSize
			});
			if (opts.sortName){
				$.extend(param, {
					sort: opts.sortName,
					order: opts.sortOrder
				});
			}
			if (opts.onBeforeLoad.call(target, param) == false) return;
			
			$(target).datagrid('loading');
			var result = opts.loader.call(target, param, function(data){
				$(target).datagrid('loaded');
				var data = opts.loadFilter.call(target, data);
				callback.call(opts.view, data.rows);
//				opts.onLoadSuccess.call(target, data);
			}, function(){
				$(target).datagrid('loaded');
				opts.onLoadError.apply(target, arguments);
			});
			if (result == false){
				$(target).datagrid('loaded');
			}
		}
	},
	
	populate: function(target){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var dc = state.dc;
		var rowHeight = 25;
		
		if (this.rows.length){
			opts.view.render.call(opts.view, target, dc.body2, false);
			opts.view.render.call(opts.view, target, dc.body1, true);
			dc.body1.add(dc.body2).children('table.datagrid-btable').css({
				paddingTop: this.index*rowHeight,
				paddingBottom: state.data.total*rowHeight - this.rows.length*rowHeight - this.index*rowHeight
			});
			opts.onLoadSuccess.call(target, {
				total: state.data.total,
				rows: this.rows
			});
		}
	}
});