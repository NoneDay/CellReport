
# luckysheet 有关修改
### x2js.js 文件需要修改212行的 escapeXmlChars(),添加
```
.replace(/\n/g, '&#xA;')
```
否则xml属性中的换行会丢失

### 拷贝粘贴时，换行丢失的修改：
src->controlers->selection.js

前三个getcellvalue(r, c, d) 替换为
```
getcellvalue(r, c, d)?.replaceAll("\n","<br>\n");
```
### src->controlls->handle.js 5363行
```
// hook,添加第三个参数，以便我们自己控制粘贴行为     if(!method.createHookFunction('rangePasteBefore',Store.luckysheet_select_save,txtdata,Store.luckysheet_copy_save)){
                return;
            }
//5407行,innerText替换text();否则换行会丢失
let txt = $td[0].innerText??$td.text();
if ($.trim(txt).length == 0) {
cell.v = null;
cell.m = "";
}
else {
let mask = genarate(txt);
cell.v = mask[2];
cell.ct = mask[1];
cell.m = mask[0];
}

```
### src->core.js
```

75行Store.defaultFontSize = extendsetting.defaultFontSize;后，添加 
    Store.defaultCell.fs = Store.defaultFontSize;

//最后一行添加
import { getBorderInfoCompute } from './global/border';
luckysheet.getBorderInfoCompute=getBorderInfoCompute
```
### src->controlers-toolbar.js
```
第一行添加：
import Store from '../store';
查找：luckysheet-toolbar-combo-button-input luckysheet-toolbar-textinput
value=10 修改为 ${Store.defaultFontSize}
```
### src->golbal->getdata.js
```
524行：
    else if(a == "fs"){
        if(foucsStatus == null){
            foucsStatus = Store.defaultFontSize;
        }
        else{
            foucsStatus = foucsStatus[a];
            if(foucsStatus == null){
                foucsStatus = Store.defaultFontSize;
            }
        }
    }
```




