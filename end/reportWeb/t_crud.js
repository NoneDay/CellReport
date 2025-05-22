function AllDataSource() {
    return getAllDataSourceName();
}
function db_tables(datasource) {
    return openDb(datasource).GetTables();
}
function db_tableinfo(data) {
    var db = openDb(data.datasource);
    //trace("db.DbConnection.ConnectionString:", db.connection.ToString(), db.connection.ConnectionString);
    //trace(db.connection.ConnectionString.split(";")
    //  .select(x=>{return x.split("=");})
    //  .first(x=>{ return x[0]=='Data Source';})[1]
    //);
    var ret = db.GetTableInfo(data.table_name, data.schema_name);
    ret.columns.forEach(x => {
        if (x.auto_incr) { x['editDisabled'] = true; x.addDisabled = 'true'; }
        if (!x.auto_incr && x.is_nullable == "NO")
            x.rules = [{ required: true, message: "请输入" + x.label, trigger: "blur" }];
        if (x.data_type.ToLower() in ["date"]) {
            x.type = 'date';
            x.format = 'yyyy-MM-dd';
            x.valueFormat = 'yyyy-MM-dd';
        }
        if (x.data_type.ToLower() in ["time", "datetime"] || x.data_type.ToLower().StartsWith("timestamp")) {
            x.type = 'datetime';
            x.format = 'yyyy-MM-dd HH:mm:ss';
            x.valueFormat = 'yyyy-MM-dd HH:mm:ss';
        }
        if (x.is_key == true) {
            x.value = `<!!>_this.self.parent_obj?.${x.prop}<!!>`;
            if (!x.auto_incr) {
                x.editDisabled = `<!!>(_this.self.parent_obj?.${x.prop})!=null<!!>`;
                x.addDisabled = `<!!>(_this.self.parent_obj?.${x.prop})!=null<!!>`;
            }
        }
        if (x.data_type == "bit") {
            x.type = 'switch';
            x.dicData = `<!!>[{label:'否',value:0},{label:'是',value:1}]<!!>`;
        }
        if (x.m_dictData)
            x.dicData = `<!!>this.allDict["${x.m_dictData}"]<!!>`;
        trace(x);
    });
    return ret;
}
var schema_kind = {
    "Microsoft.Data.SqlClient.SqlClientFactory": {
        tables: `SELECT '' TABLE_CATALOG , S.name AS TABLE_SCHEMA, T.name AS TABLE_NAME FROM    sys.tables AS T
                                              INNER JOIN sys.schemas AS S  ON  T.schema_id = S.schema_id`,
        foreign: [
            `SELECT  S.name AS base_schema_name, T.name AS base_table_name, C.name AS base_column_name,
                                    US.name AS unique_schema_name,  UT.name AS unique_table_name,  UC.name AS unique_column_name
                      FROM    sys.tables AS T
                      INNER JOIN sys.schemas AS S ON  T.schema_id = S.schema_id
                      INNER JOIN sys.foreign_keys AS FK ON      T.object_id = FK.parent_object_id
                      INNER JOIN sys.foreign_key_columns AS FKC ON      FK.object_id = FKC.constraint_object_id
                      INNER JOIN sys.columns AS C ON      FKC.parent_object_id = C.object_id        AND FKC.parent_column_id = C.column_id
                      INNER JOIN sys.columns AS UC ON      FKC.referenced_object_id = UC.object_id        AND FKC.referenced_column_id = UC.column_id
                      INNER JOIN sys.tables AS UT ON      FKC.referenced_object_id = UT.object_id
                      INNER JOIN sys.schemas AS US ON      UT.schema_id = US.schema_id
                      where T.name='$table$'
                      ORDER BY base_schema_name, base_table_name`	,
            `=cur.select(x=>{table:x.unique_table_name, from:x.base_column_name,to:x.unique_column_name})`],
        columns: [`
                  with aaa as( SELECT  column_name FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
                      WHERE TABLE_NAME = '$table$' and Constraint_name=(SELECT OBJECT_NAME(OBJECT_ID) AS NameofConstraint FROM sys.objects 
                      WHERE type_desc IN ('PRIMARY_KEY_CONSTRAINT') and OBJECT_NAME(parent_object_id) = '$table$') 
                  )
                  SELECT  T.object_id,S.name AS schema_name, T.name AS table_name 
                  , C.name AS column_name,C.is_nullable, C.is_rowguidcol,C.is_identity auto_incr,tp.NAME data_type,
                  case when exists (select 1 from aaa where column_name=c.name) then 1 else 0 end is_key
                  FROM    sys.tables AS T
                    INNER JOIN sys.schemas AS S  ON  T.schema_id = S.schema_id
                    INNER JOIN sys.columns AS C   ON   T.object_id = C.OBJECT_ID
                        INNER JOIN sys.types AS tp   ON  C.user_type_id = tp.user_type_id   
                  where T.name='$table$'`,
            `=cur.select(x=>{prop:x.column_name, label:x.column_name,type:"input",auto_incr:iif(x.auto_incr==true || x.auto_incr==1,true,false),
                    is_nullable:iif(x.is_nullable==true || x.is_nullable==1,'YES','NO'),dflt_value:'',is_key:iif(x.is_key!=0,true,false),
                    data_type:x.data_type}).toList()` ],

    },
    "Microsoft.Data.Sqlite.SqliteFactory": {
        tables: `SELECT '' TABLE_CATALOG  ,'' TABLE_SCHEMA,tbl_name TABLE_NAME FROM "main".sqlite_master where type='table';`,
        foreign: [`PRAGMA foreign_key_list('$table$')`,
            `=cur.select(x=>{table:x.table, from:x.from,to:x.to})`],
        columns: [`
                   SELECT *,case when pk=1 and EXISTS (SELECT 1 FROM "sqlite_sequence" where name='$table$') then 1 else 0 end auto_incr
                   FROM pragma_table_info('$table$')`,
            `=cur.select(x=>{prop:x.name, label:x.name,type:"input",auto_incr:iif(x.auto_incr==1,true,false),
                              is_nullable:iif(x.notnull==1,'NO','YES'),dflt_value:x.dflt_value,is_key:iif(x.pk!=0,true,false),
                              data_type:x.type}).toList()`],

    },
    "Npgsql.NpgsqlFactory": {
        tables: `select t.schemaname TABLE_SCHEMA,t.tablename as TABLE_NAME from pg_tables t 
  where t.tableowner = '$Username$' and  t.schemaname!='cstore'  order by 1 asc,2 asc;`,
        foreign: [`SELECT table_name, constraint_name,*
  FROM information_schema.table_constraints
  WHERE constraint_type = 'FOREIGN KEY' and table_name=''`,
            `=cur.select(x=>{table:x.table, from:x.from,to:x.to})`],
        columns: [`
                   select distinct ordinal_position as Colorder,column_name as ColumnName,data_type as TypeName,
  coalesce(character_maximum_length,numeric_precision,-1) as Length,numeric_scale as Scale,
  case is_nullable when 'NO' then 0 else 1 end as CanNull,column_default as DefaultVal,
  case  when position('nextval' in column_default)>0 then 1 else 0 end as IsIdentity, 
  case when b.pk_name is null then 0 else 1 end as IsPK,c.DeText
  from information_schema.columns 
  left join (
      select pg_attr.attname as colname,pg_constraint.conname as pk_name from pg_constraint  
      inner join pg_class on pg_constraint.conrelid = pg_class.oid 
      inner join pg_attribute pg_attr on pg_attr.attrelid = pg_class.oid and  pg_attr.attnum = pg_constraint.conkey[1] 
      inner join pg_type on pg_type.oid = pg_attr.atttypid
      where pg_class.relname = '$table$' and pg_constraint.contype='p' 
  ) b on b.colname = information_schema.columns.column_name
  left join (
      select attname,description as DeText from pg_class
      left join pg_attribute pg_attr on pg_attr.attrelid= pg_class.oid
      left join pg_description pg_desc on pg_desc.objoid = pg_attr.attrelid and pg_desc.objsubid=pg_attr.attnum
      where pg_attr.attnum>0 and pg_attr.attrelid=pg_class.oid and pg_class.relname='$table$'
  )c on c.attname = information_schema.columns.column_name
  where table_schema='$schema$' and table_name='$table$' order by ordinal_position asc`,
            `=cur.select(x=>{prop:x.ColumnName, label:x.DeText??x.ColumnName,type:iif(x.TypeName=='text',"textarea","input"),auto_incr:iif(x.IsIdentity==1,true,false),
                              is_nullable:iif(x.CanNull==1,'NO','YES'),dflt_value:x.DefaultVal,is_key:iif(x.IsPK!=0,true,false),
                              data_type:x.TypeName}).toList()`],

    },
    "MySqlConnector.MySqlConnectorFactory": {
        tables: `select '' TABLE_CATALOG, TABLE_SCHEMA, table_name AS TABLE_NAME from information_schema.tables where  TABLE_TYPE!='SYSTEM TABLE' and TABLE_TYPE!='SYSTEM VIEW';`,
        foreign: [
            `SELECT
                        O.TABLE_SCHEMA AS base_schema_name,
                        O.TABLE_NAME AS base_table_name,
                        O.COLUMN_NAME AS base_column_name,
                        O.REFERENCED_TABLE_SCHEMA AS unique_schema_name,
                        O.REFERENCED_TABLE_NAME AS unique_table_name,
                        O.REFERENCED_COLUMN_NAME AS unique_column_name
                      FROM
                        (
                        SELECT
                          K.CONSTRAINT_SCHEMA,
                          K.CONSTRAINT_NAME,
                          K.TABLE_SCHEMA,
                          K.TABLE_NAME,
                          K.COLUMN_NAME,
                          K.REFERENCED_TABLE_SCHEMA,
                          K.REFERENCED_TABLE_NAME,
                          K.REFERENCED_COLUMN_NAME,
                          R.UPDATE_RULE,
                          R.DELETE_RULE,
                          R.UNIQUE_CONSTRAINT_NAME
                        FROM
                          (select * from information_schema.KEY_COLUMN_USAGE where TABLE_SCHEMA='$schema$' and TABLE_NAME='$table$') K
                          LEFT JOIN information_schema.REFERENTIAL_CONSTRAINTS R ON K.CONSTRAINT_NAME = R.CONSTRAINT_NAME
                        ) AS O
                        INNER JOIN Information_schema.TABLE_CONSTRAINTS T ON O.Table_Name = T.TABLE_NAME
                        AND T.CONSTRAINT_NAME = O.CONSTRAINT_NAME
                        AND T.CONSTRAINT_TYPE = 'FOREIGN KEY'
                      ORDER BY base_schema_name, base_table_name`	,
            `=cur.select(x=>{table:x.unique_table_name, from:x.base_column_name,to:x.unique_column_name})`],
        columns: [`
                  select NULL AS object_id, A.TABLE_SCHEMA AS schema_name, A.TABLE_NAME as table_name,  B.COLUMN_NAME as column_name, B.DATA_TYPE as data_type,
                    IF(B.IS_NULLABLE='NO', 0,1) AS is_nullable, 0 AS is_rowguidcol, IF(B.EXTRA='auto_increment', 1,0) AS auto_incr,
                    IF(B.COLUMN_KEY='PRI', 1,0) AS is_key, B.COLUMN_COMMENT as column_comment
                  from (SELECT * FROM information_schema.tables where TABLE_SCHEMA='$schema$' AND TABLE_NAME = '$table$') A
                  INNER JOIN information_schema.COLUMNS B  ON A.TABLE_SCHEMA=B.TABLE_SCHEMA AND  A.TABLE_NAME=B.TABLE_NAME
                  order by B.ORDINAL_POSITION`,
            `=cur.select(x=>{prop:x.column_name, label:x.column_name,type:"input",auto_incr:iif(x.auto_incr==1,true,false),
                    is_nullable:iif(x.is_nullable==1,'YES','NO'),dflt_value:'',is_key:iif(x.is_key!=0,true,false),
                    data_type:x.data_type}).toList()` ],
        auto_incr_sql: 'select @@IDENTITY as key;',
    },
};

var tbl_default_filter = `=cur.select(x=>{
                  prop:x.ColumnName,label:x.ColumnName,type:'input',
                  is_nullable: iif(x.IsNull==1,'YES','') ,is_key:iif(x.IsKey==1,true,false),
                  data_type: x.ColumnType} )`;
var schema_filter = `=cur.orderBy(x=>x.ORDINAL_POSITION).select(x => {
                          prop: x.COLUMN_NAME,label: x.COLUMN_NAME,type: 'input',
                          is_nullable: x.IS_NULLABLE,
                          data_type: x.DATA_TYPE})`;


function buildTemplate(para) {

    var cur_schema = openDb(para.ds_link).schema_kind;
    var col_list = para.col_list;//表的所有列名
    if (para.keys.count() == 0)
        return { errcode: 1, message: `没有定义主键` };
    var key_not_exists = para.keys.Where(x => x not in col_list).JoinAsString();
    trace("key_not_exists:", key_not_exists);
    if (key_not_exists != '')
        return { errcode: 1, message: `${key_not_exists} 不在列表中！（${col_list.JoinAsString()}）` };
    // crud 
    var crud_cloumns = col_list.Where(x => x in para.keys).select(x => `{label:"${x}",prop:"${x}",span:8,type:"input",editDisabled:true,addDisabled: 'false'}`)
        .union(col_list.Where(x => x not in para.keys).select(x => `{label:"${x}",prop:"${x}",span:8,type:"input"}`))
        .JoinAsString(',\\n');
    var where_str = para.keys.select(x => `[${x}]='\${crud_obj.${x}\}'`).JoinAsString(" and ");
    var list_where = iif(para.parent_table == null, " 1=1 `", para.parent_table.select(x => `${x.self_key}='\${p.${x.parent_key}}'`).joinAsString(' and '));
    //-------------------------------- 

    var kata_template = `
  function 插入_${para.table}(p_obj){
    var col_list=[ ${col_list} ];
    var key_list=[${para.keys}];
    var auto_incr_cols=[${para.auto_incr_cols}];
    var insert_obj={};
    col_list.Except(auto_incr_cols).ForEach(x=>{insert_obj[x]=p_obj[x]; });
    var db=kata("${para.ds_link}");
    //这里需要按照具体数据库修改主键获取。缺省是按只有一个字段的自增主键。
     var 结果=db.Query('${para.schema + para.table}').InsertGetId(insert_obj);  
     
     ${iif(para.auto_incr_cols.count() == 1, 'insert_obj.' + para.auto_incr_cols[0] + '=结果;', '//多主键，自己把握修改')}
     return {errcode:0,result:insert_obj};
  }
  function 修改_${para.table}(p_obj){
    var col_list=[ ${col_list} ];
    var key_list=[${para.keys}];
    col_list.Except(p_obj.new_val.Select(x=>x.key)).ForEach(x=>{p_obj.new_val[x]=null;});//补充缺失的字段
    var crud_obj=p_obj.new_val.Except(p_obj.old_val).Where(x=>x.key in col_list).ToDictionary($.key,$.value);//过滤掉相同值
  
    if(crud_obj.select(x=>x.Key).count(x=>x in key_list) >0)
            return {errcode:1,message:"新旧对象的主键不一致列表"};
    if(crud_obj.count()==0)
        return {errcode:2,message:"没有需要更改的数据 "};
    
    var key_cols={};
    key_list.forEach(x=> {key_cols[x]= p_obj.old_val[x];} );//主键条件
    
    var db=kata("${para.ds_link}");
    var 结果=db.Query('${para.schema + para.table}').Where(key_cols).Update(crud_obj);  
    
    return {errcode:0,结果,result:crud_obj};
  }  
  function 删除_${para.table}(crud_obj){
    var key_list=[${para.keys}];
    var key_cols={};
    key_list.forEach(x=> {key_cols[x]= crud_obj[x];} );//主键条件
    
    var db=kata("${para.ds_link}");
    var 结果=db.Query('${para.schema + para.table}').Where(key_cols).Delete();  
    return {errcode:0,结果};
  }
  function 清单_${para.table}(p){
     var key_list= ${json_stringify(iif(para.parent_table == null, [], para.parent_table))};  
     var db=kata("${para.ds_link}");
     var query=db.Query('${para.schema + para.table}');
     p.where?.ForEach(x=>{
        query=query.WhereLike(x.Key,'%'+x.Value+'%');
     });     
     if(p.export_excel){
       var result=query.Get();
       return {data:result,total:result.Count}; 
     }
     else
     {
       var result=query.Paginate(p.page.currentPage,p.page.pageSize);
       return {data:result.List,total:result.Count};
     }
     //return {data:query.List,total:query.Count};
  }
  function TableData_${para.table}(p){
     var db=kata("${para.ds_link}");
    var result=db.Query(para.schema+p.table);//  
     if(p.value!=null)
        return result.Where(p.key,'=',p.value).Get();
     if(p.data){
      p.data.forEach(x=> {result=result.WhereLike(x.key,'%'+$.Value+'%',true); } );
    }
     if(p.page)
      result=result.Paginate(p.page.currentPage,p.page.pageSize);
     
     return  {total:result.Count,data:result.List};   
  }
  function 字典_${para.table}(){
    ${iif(para.allDict.count() > 0, 'var db=kata("' + para.ds_link + '");', '')}
    ${para.allDict.select(x =>
        'var '
        + x.table
        + '=db.Query("' + para.schema + x.table + '").Get().select(x=>{return {value:x.'
        + x.key
        + ',label:\`'
        + x.columns.select('\${x.' + $ + '\}').JoinAsString('_')
        + '\`\};\});'
    ).JoinAsString('\n  ')
        }   
    return {${para.allDict.select(x => x.table).JoinAsString(',')} };
  }  
      
      `;
    var 最终模板 = `
    <template>
      <div style="width:100%;height:calc(100% - 0px);display: flex;" ref="main" v-if="cr_init">
        <avue-crud  ref="crud" :option="option"   style="display: flex;flex-direction: column;"
          v-model="cur_obj" :page.sync="page" 
          @row-del="delete_row" 
          @row-save="insert_row"
          @search-change="searchChange" 
          @search-reset="resetChange"
          @on-load="onLoad" 
          @row-update="update_row"
          :data="tableData"
        >
        <template slot="menuRight" slot-scope="{size}">
          <el-button type="primary" icon="el-icon-download" circle :size="size" @click='export_excel'></el-button>
        </template>
        <template slot="_info_Form"  slot-scope="scope" v-if="'${para.as_parent}'=='True'"> 
          <!--这里加上当前主键是否为空的判断，否则新增也会将子表显示出来-->
          <widget-form-item  v-if="cur_obj.${para.keys[0]}!=''" 
              :self="findElelment('这里用元素名称替换',{parent_obj:cur_keys}) "  >
          </widget-form-item>
        </template> 
        </avue-crud>
      </div>
    </template>
  <script>
      if(!window.XLSX)
          tool.seriesLoadScripts('cdn/xlsx/dist/xlsx.full.min.js');
      export default {
        mounted(){
          this.height=this.$el.clientHeight -58 //58 对应的是pager的高度
          let t_arr=$(this.$el).find(".avue-crud__search")
          if(t_arr.length>0)
            this.height-= t_arr[0].clientHeight 
          t_arr=$(this.$el).find(".avue-crud__header")
          if(t_arr.length>0)
            this.height-= t_arr[0].clientHeight 
          console.info(this.height)
        },
      data() {    
        let ret= {
          cur_obj:{},allDict:{},selfHeight:_this.selfHeight,ready:false,tableData:[],
          page: {currentPage: 1,total: 0,background:false,pageSize: 20,},
          height:0,old_where:null
        }
        return ret;
      },
      methods: { 
          resetChange(item){
          this.$message.success('清空回调')
        },
      onLoad(page) {
          this.getList({where:{...(this.old_where??{}),...(this.self.parent_obj||{})} ,page:this.page});
      },
      searchChange(params,done) { 
          this.page.currentPage=1
          this.old_where=params
          this.getList({where:{...params,...(this.self.parent_obj||{})} ,page:this.page},done);
      },
       export_excel(){
          cellreport.call_server_func("清单_${para.table}",{...(this.old_where||{}),...{export_excel:1}} ,this).then(res=>{
              if(res.errcode && res.errcode==1){
                this.$message.error(res.message)
                return
              }
              this.$Export.excel({
                title: "文件名",
                columns:this.option.column,
                data: res.data,
              });
          });
        },
        getList(params,done){
           cellreport.call_server_func("清单_${para.table}",params ,this).then(res=>{
                if(done)
                done();
               if(res.errcode){
                 this.$message({message: res.message,type: "error"});
                 return
               }
               this.tableData=res.data;   
               this.page.total=res.total;
             }).catch((err) => this.$message({message: err,type: "error"}));
         },
      insert_row(row,done){ 
        cellreport.call_server_func("插入_${para.table}",row,this).then(result=>{
            this.$Log.capsule('添加返回', JSON.stringify( result) )   
            if(result['errcode']==0 ){
                this.tableData.splice(0,0,result.result);
                this.page.total=this.page.total+1;  
                done();//关闭添加，打开编辑，编辑里面有子表录入
                ${iif(para.as_parent, "this.$nextTick(()=> { this.$refs.crud.rowEdit(result.result,0); \});", "")}
                return;
            }
            else {
              this.$message({message: result.message,type: "error"});
              done(); 
            }
        });
      },
      update_row(row,index,done,loading){   
          let old_val=this.tableData[ index]
        cellreport.call_server_func("修改_${para.table}",{old_val,new_val:row},this).then(result=>{
           this.$Log.capsule('服务器脚本返回', JSON.stringify( result) )   
           if(result['errcode']==0 )
            this.tableData.splice( index, 1,{...row,...result.result});
           else if(result['errcode']!=2 )
             this.$message({message: result.message,type: "error"});
           if(done)
             done(); 
          });
        }, 
        delete_row(row, index){
          this.$confirm('是否删除?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'})
           .then(async() => {
            let result=await cellreport.call_server_func("删除_${para.table}",row,this)
               this.$Log.capsule('删除返回', JSON.stringify( result) )   
            if(result['errcode']==0 ){
              this.tableData.splice(index, 1);
              this.page.total=this.page.total-1;  
            }
            else 
              this.$message({message: result.message,type: "error"});  
          }).catch(() => {
    
          });
          
        },
    
      },
      computed:{
        option(){
          let ret={...{height: this.height},
  ...${para.crud_option} 
          }
          return ret;
        },
        cur_keys(){
          let ret={}
          Enumerable.from([${para.keys}]).forEach(x=>ret[x]=this.cur_obj[x] );
          return ret;
        },
         cr_init(){
            let _this=this
            cellreport.call_server_func("字典_${para.table}",null,this).then(res=>{
              if(res.errcode){
                _this.$message({message: res.message,type: "error"});
                return
              }
              _this.allDict=res;              
            });         
           return true
         },
      }
    }  
    /* 服务器脚本  
   ${kata_template}
       结束 */       
    </script>     
  <style>
    .avue-crud__pagination {    padding: 10px; }
    .el-form-item__label {margin-top: 5px;}
  </style>
      `;
    return { 最终模板 };
}


return { AllDataSource, db_tables, db_tableinfo, schema_kind, tbl_default_filter, schema_filter, buildTemplate };