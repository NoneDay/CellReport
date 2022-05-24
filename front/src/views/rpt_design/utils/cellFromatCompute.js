import {getObjType} from './util.js'
const getcolorGradation= function(color1, color2, value1, value2, value){
    let rgb1 = color1.split(',');
    let r1 = my_parseInt(rgb1[0].split('(')[1]);
    let g1 = my_parseInt(rgb1[1]);
    let b1 = my_parseInt(rgb1[2].split(')')[0]);

    let rgb2 = color2.split(',');
    let r2 = my_parseInt(rgb2[0].split('(')[1]);
    let g2 = my_parseInt(rgb2[1]);
    let b2 = my_parseInt(rgb2[2].split(')')[0]);

    let r = Math.round(r1 - (r1 - r2) / (value1 - value2) * (value1 - value));
    let g = Math.round(g1 - (g1 - g2) / (value1 - value2) * (value1 - value));
    let b = Math.round(b1 - (b1 - b2) / (value1 - value2) * (value1 - value));

    return "rgb("+ r +", "+ g +", "+ b +")";
} 
function my_parseInt(val){
    let ret=parseInt(val)
    return isNaN(ret)?0:ret
}
export  const cellFromatCompute=function(ruleArr, d){
    if(ruleArr == null){
        ruleArr = [];
    }
    //条件计算存储
    let computeMap = {};

    if(ruleArr.length > 0){
        for(let i = 0; i < ruleArr.length; i++){
            let type = ruleArr[i]["type"];
            let cellrange = ruleArr[i]["cellrange"];
            let format = ruleArr[i]["format"];

            if(type == "dataBar"){ //数据条
                let max = null, min = null;

                for(let s = 0; s < cellrange.length; s++){
                    for(let r = cellrange[s].row[0]; r <= cellrange[s].row[1]; r++){
                        for(let c = cellrange[s].column[0]; c <= cellrange[s].column[1]; c++){
                            if(d[r] == null || d[r][c] == null){
                                continue;
                            }

                            let cell = d[r][c];

                            if(cell != null){
                                if(max == null || my_parseInt(cell) > max){
                                    max = my_parseInt(cell);
                                }

                                if(min == null || my_parseInt(cell) < min){
                                    min = my_parseInt(cell);
                                }
                            }
                        }
                    }
                }

                if(max != null && min != null){
                    if(min < 0){ //选区范围内有负数
                        let plusLen = Math.round(max / (max - min) * 10) / 10;                //正数所占比
                        let minusLen = Math.round(Math.abs(min) / (max - min) * 10) / 10;     //负数所占比

                        for(let s = 0; s < cellrange.length; s++){
                            for(let r = cellrange[s].row[0]; r <= cellrange[s].row[1]; r++){
                                for(let c = cellrange[s].column[0]; c <= cellrange[s].column[1]; c++){
                                    if(d[r] == null || d[r][c] == null){
                                        continue;
                                    }

                                    let cell = d[r][c];

                                    if(cell != null){
                                        if(my_parseInt(cell) < 0){ //负数
                                            let valueLen = Math.round(Math.abs(my_parseInt(cell)) / Math.abs(min) * 100) / 100;

                                            if((r + "_" + c) in computeMap){
                                                computeMap[r + "_" + c]["dataBar"] = { "valueType": "minus", "minusLen": minusLen, "valueLen": valueLen, "format": format };
                                            }
                                            else{
                                                computeMap[r + "_" + c] = { "dataBar": { "valueType": "minus", "minusLen": minusLen, "valueLen": valueLen, "format": format } };
                                            }
                                        }

                                        if(my_parseInt(cell) > 0){ //正数
                                            let valueLen = Math.round(my_parseInt(cell) / max * 100) / 100;

                                            if((r + "_" + c) in computeMap){
                                                computeMap[r + "_" + c]["dataBar"] = { "valueType": "plus", "plusLen": plusLen, "minusLen": minusLen, "valueLen": valueLen, "format": format };
                                            }
                                            else{
                                                computeMap[r + "_" + c] = { "dataBar": { "valueType": "plus", "plusLen": plusLen, "minusLen": minusLen, "valueLen": valueLen, "format": format } };
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else{
                        let plusLen = 1;

                        for(let s = 0; s < cellrange.length; s++){
                            for(let r = cellrange[s].row[0]; r <= cellrange[s].row[1]; r++){
                                for(let c = cellrange[s].column[0]; c <= cellrange[s].column[1]; c++){
                                    if(d[r] == null || d[r][c] == null){
                                        continue;
                                    }

                                    let cell = d[r][c];

                                    if(cell != null){
                                        let valueLen;
                                        if(max == 0){
                                            valueLen = 1;
                                        }
                                        else{
                                            valueLen = Math.round(my_parseInt(cell) / max * 100) / 100;
                                        }

                                        if((r + "_" + c) in computeMap){
                                            computeMap[r + "_" + c]["dataBar"] = { "valueType": "plus", "plusLen": plusLen, "valueLen": valueLen, "format": format };
                                        }
                                        else{
                                            computeMap[r + "_" + c] = { "dataBar": { "valueType": "plus", "plusLen": plusLen, "valueLen": valueLen, "format": format } };
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else if(type == "colorGradation"){ //色阶
                let max = null, min = null, sum = 0, count = 0;

                for(let s = 0; s < cellrange.length; s++){
                    for(let r = cellrange[s].row[0]; r <= cellrange[s].row[1]; r++){
                        for(let c = cellrange[s].column[0]; c <= cellrange[s].column[1]; c++){
                            if(d[r] == null || d[r][c] == null){
                                continue;
                            }

                            let cell = d[r][c];

                            if(cell != null){
                                count++;
                                sum += my_parseInt(cell);

                                if(max == null || my_parseInt(cell) > max){
                                    max = my_parseInt(cell);
                                }

                                if(min == null || my_parseInt(cell) < min){
                                    min = my_parseInt(cell);
                                }
                            }
                        }
                    }
                }

                if(max != null && min != null){
                    if(format.length == 3){ //三色色阶
                        let avg = Math.floor(sum / count);

                        for(let s = 0; s < cellrange.length; s++){
                            for(let r = cellrange[s].row[0]; r <= cellrange[s].row[1]; r++){
                                for(let c = cellrange[s].column[0]; c <= cellrange[s].column[1]; c++){
                                    if(d[r] == null || d[r][c] == null){
                                        continue;
                                    }

                                    let cell = d[r][c];
                                    
                                    if(cell != null){
                                        if(my_parseInt(cell) == min){
                                            if((r + "_" + c) in computeMap){
                                                computeMap[r + "_" + c]["cellColor"] = format[2];
                                            }
                                            else{
                                                computeMap[r + "_" + c] = { "cellColor": format[2] };
                                            }
                                        }
                                        else if(my_parseInt(cell) > min && my_parseInt(cell) < avg){
                                            if((r + "_" + c) in computeMap){
                                                computeMap[r + "_" + c]["cellColor"] = getcolorGradation(format[2], format[1], min, avg, my_parseInt(cell));
                                            }
                                            else{
                                                computeMap[r + "_" + c] = { "cellColor": getcolorGradation(format[2], format[1], min, avg, my_parseInt(cell)) };
                                            }
                                        }
                                        else if(my_parseInt(cell) == avg){
                                            if((r + "_" + c) in computeMap){
                                                computeMap[r + "_" + c]["cellColor"] = format[1];
                                            }
                                            else{
                                                computeMap[r + "_" + c] = { "cellColor": format[1] };
                                            }
                                        }
                                        else if(my_parseInt(cell) > avg && my_parseInt(cell) < max){
                                            if((r + "_" + c) in computeMap){
                                                computeMap[r + "_" + c]["cellColor"] = getcolorGradation(format[1], format[0], avg, max, my_parseInt(cell));
                                            }
                                            else{
                                                computeMap[r + "_" + c] = { "cellColor": getcolorGradation(format[1], format[0], avg, max, my_parseInt(cell)) };
                                            }
                                        }
                                        else if(my_parseInt(cell) == max){
                                            if((r + "_" + c) in computeMap){
                                                computeMap[r + "_" + c]["cellColor"] = format[0];
                                            }
                                            else{
                                                computeMap[r + "_" + c] = { "cellColor": format[0] };
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else if(format.length == 2){ //两色色阶
                        for(let s = 0; s < cellrange.length; s++){
                            for(let r = cellrange[s].row[0]; r <= cellrange[s].row[1]; r++){
                                for(let c = cellrange[s].column[0]; c <= cellrange[s].column[1]; c++){
                                    if(d[r] == null || d[r][c] == null){
                                        continue;
                                    }

                                    let cell = d[r][c];

                                    if(cell != null){
                                        if(my_parseInt(cell) == min){
                                            if((r + "_" + c) in computeMap){
                                                computeMap[r + "_" + c]["cellColor"] = format[1];
                                            }
                                            else{
                                                computeMap[r + "_" + c] = { "cellColor": format[1] };
                                            }
                                        }
                                        else if(my_parseInt(cell) > min && my_parseInt(cell) < max){
                                            if((r + "_" + c) in computeMap){
                                                computeMap[r + "_" + c]["cellColor"] = getcolorGradation(format[1], format[0], min, max, my_parseInt(cell));
                                            }
                                            else{
                                                computeMap[r + "_" + c] = { "cellColor": getcolorGradation(format[1], format[0], min, max, my_parseInt(cell)) };
                                            }
                                        }
                                        else if(my_parseInt(cell) == max){
                                            if((r + "_" + c) in computeMap){
                                                computeMap[r + "_" + c]["cellColor"] = format[0];
                                            }
                                            else{
                                                computeMap[r + "_" + c] = { "cellColor": format[0] };
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else if(type == "icons"){ //图标集
                let len = my_parseInt(format["len"]);
                let leftMin = my_parseInt(format["leftMin"]);
                let top = my_parseInt(format["top"]);

                let max = null, min = null;

                for(let s = 0; s < cellrange.length; s++){
                    for(let r = cellrange[s].row[0]; r <= cellrange[s].row[1]; r++){
                        for(let c = cellrange[s].column[0]; c <= cellrange[s].column[1]; c++){
                            if(d[r] == null || d[r][c] == null){
                                continue;
                            }

                            let cell = d[r][c];

                            if(cell != null){
                                if(max == null || my_parseInt(cell) > max){
                                    max = my_parseInt(cell);
                                }

                                if(min == null || my_parseInt(cell) < min){
                                    min = my_parseInt(cell);
                                }
                            }
                        }
                    }
                }

                if(max != null && min != null){
                    let a = Math.floor((max - min + 1) / len);
                    let b = (max - min + 1) % len;

                    if(len == 3){ //一组图标有三个
                        let v1, v2, v3;
                        if(b == 2){
                            v1 = [min, min + a];
                            v2 = [min + a + 1, min + a * 2];
                            v3 = [min + a * 2 + 1, max];
                        }
                        else{
                            v1 = [min, min + a - 1];
                            v2 = [min + a, min + a * 2 - 1];
                            v3 = [min + a * 2, max];
                        }

                        for(let s = 0; s < cellrange.length; s++){
                            for(let r = cellrange[s].row[0]; r <= cellrange[s].row[1]; r++){
                                for(let c = cellrange[s].column[0]; c <= cellrange[s].column[1]; c++){
                                    if(d[r] == null || d[r][c] == null){
                                        continue;
                                    }

                                    let cell = d[r][c];

                                    if(cell != null){
                                        if(my_parseInt(cell) >= v1[0] && my_parseInt(cell) <= v1[1]){
                                            if((r + "_" + c) in computeMap){
                                                computeMap[r + "_" + c]["icons"] = {"left": leftMin + 2, "top": top};
                                            }
                                            else{
                                                computeMap[r + "_" + c] = { "icons": {"left": leftMin + 2, "top": top} };
                                            }
                                        }
                                        else if(my_parseInt(cell) >= v2[0] && my_parseInt(cell) <= v2[1]){
                                            if((r + "_" + c) in computeMap){
                                                computeMap[r + "_" + c]["icons"] = {"left": leftMin + 1, "top": top};
                                            }
                                            else{
                                                computeMap[r + "_" + c] = { "icons": {"left": leftMin + 1, "top": top} };
                                            }
                                        }
                                        else if(my_parseInt(cell) >= v3[0] && my_parseInt(cell) <= v3[1]){
                                            if((r + "_" + c) in computeMap){
                                                computeMap[r + "_" + c]["icons"] = {"left": leftMin, "top": top};
                                            }
                                            else{
                                                computeMap[r + "_" + c] = { "icons": {"left": leftMin, "top": top} };
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else if(len == 4){ //一组图标有四个
                        let v1, v2, v3, v4;
                        if(b == 2){
                            v1 = [min, min + a];
                            v2 = [min + a + 1, min + a * 2];
                            v3 = [min + a * 2 + 1, min + a * 3];
                            v4 = [min + a * 3 + 1, max];
                        }
                        else if(b == 3){
                            v1 = [min, min + a];
                            v2 = [min + a + 1, min + a * 2];
                            v3 = [min + a * 2 + 1, min + a * 3 + 1];
                            v4 = [min + a * 3 + 2, max];
                        }
                        else{
                            v1 = [min, min + a - 1];
                            v2 = [min + a, min + a * 2 - 1];
                            v3 = [min + a * 2, min + a * 3 - 1];
                            v4 = [min + a * 3, max];
                        }

                        for(let s = 0; s < cellrange.length; s++){
                            for(let r = cellrange[s].row[0]; r <= cellrange[s].row[1]; r++){
                                for(let c = cellrange[s].column[0]; c <= cellrange[s].column[1]; c++){
                                    if(d[r] == null || d[r][c] == null){
                                        continue;
                                    }

                                    let cell = d[r][c];

                                    if(cell != null){
                                        if(my_parseInt(cell) >= v1[0] && my_parseInt(cell) <= v1[1]){
                                            if((r + "_" + c) in computeMap){
                                                computeMap[r + "_" + c]["icons"] = {"left": leftMin + 3, "top": top};
                                            }
                                            else{
                                                computeMap[r + "_" + c] = { "icons": {"left": leftMin + 3, "top": top} };
                                            }
                                        }
                                        else if(my_parseInt(cell) >= v2[0] && my_parseInt(cell) <= v2[1]){
                                            if((r + "_" + c) in computeMap){
                                                computeMap[r + "_" + c]["icons"] = {"left": leftMin + 2, "top": top};
                                            }
                                            else{
                                                computeMap[r + "_" + c] = { "icons": {"left": leftMin + 2, "top": top} };
                                            }
                                        }
                                        else if(my_parseInt(cell) >= v3[0] && my_parseInt(cell) <= v3[1]){
                                            if((r + "_" + c) in computeMap){
                                                computeMap[r + "_" + c]["icons"] = {"left": leftMin + 1, "top": top};
                                            }
                                            else{
                                                computeMap[r + "_" + c] = { "icons": {"left": leftMin + 1, "top": top} };
                                            }
                                        }
                                        else if(my_parseInt(cell) >= v4[0] && my_parseInt(cell) <= v4[1]){
                                            if((r + "_" + c) in computeMap){
                                                computeMap[r + "_" + c]["icons"] = {"left": leftMin, "top": top};
                                            }
                                            else{
                                                computeMap[r + "_" + c] = { "icons": {"left": leftMin, "top": top} };
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else if(len == 5){ //一组图标有五个
                        let v1, v2, v3, v4, v5;
                        if(b == 2){
                            v1 = [min, min + a];
                            v2 = [min + a + 1, min + a * 2];
                            v3 = [min + a * 2 + 1, min + a * 3];
                            v4 = [min + a * 3 + 1, min + a * 4];
                            v5 = [min + a * 4 + 1, max];
                        }
                        else if(b == 3){
                            v1 = [min, min + a];
                            v2 = [min + a + 1, min + a * 2];
                            v3 = [min + a * 2 + 1, min + a * 3 + 1];
                            v4 = [min + a * 3 + 2, min + a * 4 + 1];
                            v5 = [min + a * 4 + 2, max];
                        }
                        else if(b == 4){
                            v1 = [min, min + a];
                            v2 = [min + a + 1, min + a * 2 + 1];
                            v3 = [min + a * 2 + 2, min + a * 3 + 1];
                            v4 = [min + a * 3 + 2, min + a * 4 + 2];
                            v5 = [min + a * 4 + 3, max];
                        }
                        else{
                            v1 = [min, min + a - 1];
                            v2 = [min + a, min + a * 2 - 1];
                            v3 = [min + a * 2, min + a * 3 - 1];
                            v4 = [min + a * 3, min + a * 4 - 1];
                            v5 = [min + a * 4, max];
                        }

                        for(let s = 0; s < cellrange.length; s++){
                            for(let r = cellrange[s].row[0]; r <= cellrange[s].row[1]; r++){
                                for(let c = cellrange[s].column[0]; c <= cellrange[s].column[1]; c++){
                                    if(d[r] == null || d[r][c] == null){
                                        continue;
                                    }

                                    let cell = d[r][c];

                                    if(cell != null){
                                        if(my_parseInt(cell) >= v1[0] && my_parseInt(cell) <= v1[1]){
                                            if((r + "_" + c) in computeMap){
                                                computeMap[r + "_" + c]["icons"] = {"left": leftMin + 4, "top": top};
                                            }
                                            else{
                                                computeMap[r + "_" + c] = { "icons": {"left": leftMin + 4, "top": top} };
                                            }
                                        }
                                        else if(my_parseInt(cell) >= v2[0] && my_parseInt(cell) <= v2[1]){
                                            if((r + "_" + c) in computeMap){
                                                computeMap[r + "_" + c]["icons"] = {"left": leftMin + 3, "top": top};
                                            }
                                            else{
                                                computeMap[r + "_" + c] = { "icons": {"left": leftMin + 3, "top": top} };
                                            }
                                        }
                                        else if(my_parseInt(cell) >= v3[0] && my_parseInt(cell) <= v3[1]){
                                            if((r + "_" + c) in computeMap){
                                                computeMap[r + "_" + c]["icons"] = {"left": leftMin + 2, "top": top};
                                            }
                                            else{
                                                computeMap[r + "_" + c] = { "icons": {"left": leftMin + 2, "top": top} };
                                            }
                                        }
                                        else if(my_parseInt(cell) >= v4[0] && my_parseInt(cell) <= v4[1]){
                                            if((r + "_" + c) in computeMap){
                                                computeMap[r + "_" + c]["icons"] = {"left": leftMin + 1, "top": top};
                                            }
                                            else{
                                                computeMap[r + "_" + c] = { "icons": {"left": leftMin + 1, "top": top} };
                                            }
                                        }
                                        else if(my_parseInt(cell) >= v5[0] && my_parseInt(cell) <= v5[1]){
                                            if((r + "_" + c) in computeMap){
                                                computeMap[r + "_" + c]["icons"] = {"left": leftMin, "top": top};
                                            }
                                            else{
                                                computeMap[r + "_" + c] = { "icons": {"left": leftMin, "top": top} };
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else{
                //获取变量值
                let conditionName = ruleArr[i].conditionName,         //条件名称
                    conditionValue0 = ruleArr[i].conditionValue[0],   //条件值1
                    conditionValue1 = ruleArr[i].conditionValue[1],   //条件值2
                    textColor = format.textColor,          //条件格式文本颜色 fc
                    cellColor = format.cellColor;          //条件格式单元格颜色 bg

                for(let s = 0; s < cellrange.length; s++){
                    //条件类型判断
                    if(conditionName == "greaterThan" || conditionName == "lessThan" || conditionName == "equal" || conditionName == "textContains"){
                        //循环应用范围计算
                        for(let r = cellrange[s].row[0]; r <= cellrange[s].row[1]; r++){
                            for(let c = cellrange[s].column[0]; c <= cellrange[s].column[1]; c++){
                                if(d[r] == null || d[r][c] == null){
                                    continue;
                                }

                                //单元格值
                                let cell = d[r][c];

                                //if(getObjType(cell) != "object" || isRealNull(cell)){
                                //    continue;
                                //}

                                //符合条件
                                if(conditionName == "greaterThan" && cell > conditionValue0){
                                    if((r + "_" + c) in computeMap){
                                        computeMap[r + "_" + c]["textColor"] = textColor;
                                        computeMap[r + "_" + c]["cellColor"] = cellColor;
                                    }
                                    else{
                                        computeMap[r + "_" + c] = { "textColor": textColor, "cellColor": cellColor };
                                    }
                                }
                                else if(conditionName == "lessThan" && cell < conditionValue0){
                                    if((r + "_" + c) in computeMap){
                                        computeMap[r + "_" + c]["textColor"] = textColor;
                                        computeMap[r + "_" + c]["cellColor"] = cellColor;
                                    }
                                    else{
                                        computeMap[r + "_" + c] = { "textColor": textColor, "cellColor": cellColor };
                                    }
                                }
                                else if(conditionName == "equal" && cell == conditionValue0){
                                    if((r + "_" + c) in computeMap){
                                        computeMap[r + "_" + c]["textColor"] = textColor;
                                        computeMap[r + "_" + c]["cellColor"] = cellColor;
                                    }
                                    else{
                                        computeMap[r + "_" + c] = { "textColor": textColor, "cellColor": cellColor };
                                    }
                                }
                                else if(conditionName == "textContains" && cell.toString().indexOf(conditionValue0) != -1){
                                    if((r + "_" + c) in computeMap){
                                        computeMap[r + "_" + c]["textColor"] = textColor;
                                        computeMap[r + "_" + c]["cellColor"] = cellColor;
                                    }
                                    else{
                                        computeMap[r + "_" + c] = { "textColor": textColor, "cellColor": cellColor };
                                    }
                                }
                            }
                        }
                    }
                    else if(conditionName == "betweenness"){
                        //比较条件值1和条件值2的大小
                        let vBig, vSmall;
                        if(conditionValue0 > conditionValue1){
                            vBig = conditionValue0;
                            vSmall = conditionValue1;
                        }
                        else{
                            vBig = conditionValue1;
                            vSmall = conditionValue0;
                        }
                        //循环应用范围计算
                        for(let r = cellrange[s].row[0]; r <= cellrange[s].row[1]; r++){
                            for(let c = cellrange[s].column[0]; c <= cellrange[s].column[1]; c++){
                                if(d[r] == null || d[r][c] == null){
                                    continue;
                                }

                                //单元格值
                                let cell = d[r][c];

                                //if(getObjType(cell) != "object" || isRealNull(cell)){
                                //    continue;
                                //}

                                //符合条件
                                if(cell >= vSmall && cell <= vBig){
                                    if((r + "_" + c) in computeMap){
                                        computeMap[r + "_" + c]["textColor"] = textColor;
                                        computeMap[r + "_" + c]["cellColor"] = cellColor;
                                    }
                                    else{
                                        computeMap[r + "_" + c] = { "textColor": textColor, "cellColor": cellColor };
                                    }
                                }
                            }
                        }
                    }
                    else if(conditionName == "occurrenceDate"){
                        //获取日期所对应的数值
                        let dBig, dSmall;
                        if(conditionValue0.toString().indexOf("-") == -1){
                            dBig = genarate(conditionValue0)[2];
                            dSmall = genarate(conditionValue0)[2];
                        }
                        else{
                            let str = conditionValue0.toString().split("-");
                            dBig = genarate(str[1].trim())[2];
                            dSmall = genarate(str[0].trim())[2];
                        }
                        //循环应用范围计算
                        for(let r = cellrange[s].row[0]; r <= cellrange[s].row[1]; r++){
                            for(let c = cellrange[s].column[0]; c <= cellrange[s].column[1]; c++){
                                if(d[r] == null || d[r][c] == null){
                                    continue;
                                }

                                //单元格值类型为日期类型
                                if(d[r][c].ct != null && d[r][c].ct.t == "d"){
                                    //单元格值
                                    let cellVal = d[r][c];
                                    //符合条件
                                    if(cellVal >= dSmall && cellVal <= dBig){
                                        if((r + "_" + c) in computeMap){
                                            computeMap[r + "_" + c]["textColor"] = textColor;
                                            computeMap[r + "_" + c]["cellColor"] = cellColor;
                                        }
                                        else{
                                            computeMap[r + "_" + c] = { "textColor": textColor, "cellColor": cellColor };
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else if(conditionName == "duplicateValue"){
                        //应用范围单元格值处理
                        let dmap = {};
                        for(let r = cellrange[s].row[0]; r <= cellrange[s].row[1]; r++){
                            for(let c = cellrange[s].column[0]; c <= cellrange[s].column[1]; c++){
                                let item = d[r][c];
                                if(!(item in dmap)){
                                    dmap[item] = [];
                                }
                                dmap[item].push({"r": r, "c": c});
                            }
                        }
                        //循环应用范围计算
                        if(conditionValue0 == "0"){//重复值
                            for(let x in dmap){
                                if(x != "null" && x != "undefined" && dmap[x].length > 1){
                                    for(let j = 0; j < dmap[x].length; j++){
                                        if((dmap[x][j].r + "_" + dmap[x][j].c) in computeMap){
                                            computeMap[dmap[x][j].r + "_" + dmap[x][j].c]["textColor"] = textColor;
                                            computeMap[dmap[x][j].r + "_" + dmap[x][j].c]["cellColor"] = cellColor;
                                        }
                                        else{
                                            computeMap[dmap[x][j].r + "_" + dmap[x][j].c] = { "textColor": textColor, "cellColor": cellColor };
                                        }
                                    }
                                }
                            }
                        }
                        if(conditionValue0 == "1"){//唯一值
                            for(let x in dmap){
                                if(x != "null" && x != "undefined" && dmap[x].length == 1){
                                    if((dmap[x][0].r + "_" + dmap[x][0].c) in computeMap){
                                        computeMap[dmap[x][0].r + "_" + dmap[x][0].c]["textColor"] = textColor;
                                        computeMap[dmap[x][0].r + "_" + dmap[x][0].c]["cellColor"] = cellColor;
                                    }
                                    else{
                                        computeMap[dmap[x][0].r + "_" + dmap[x][0].c] = { "textColor": textColor, "cellColor": cellColor };
                                    }
                                }
                            }
                        }
                    }
                    else if(conditionName == "top10" || conditionName == "top10%" || conditionName == "last10" || conditionName == "last10%" || conditionName == "AboveAverage" || conditionName == "SubAverage"){
                        //应用范围单元格值(数值型)
                        let dArr=[];
                        for(let r = cellrange[s].row[0]; r <= cellrange[s].row[1]; r++){
                            for(let c = cellrange[s].column[0]; c <= cellrange[s].column[1]; c++){
                                if(d[r] == null || d[r][c] == null){
                                    continue;
                                }

                                //单元格值类型为数字类型
                                //if(d[r][c].ct != null && d[r][c].ct.t == "n"){
                                    dArr.push(d[r][c]);
                                //}
                            }
                        }
                        //数组处理
                        if(conditionName == "top10" || conditionName == "top10%" || conditionName == "last10" || conditionName == "last10%"){
                            //从大到小排序
                            for(let j = 0; j < dArr.length; j++){
                                for(let k = 0; k < dArr.length - 1 - j; k++){
                                    if(dArr[k]<dArr[k+1]){
                                        let temp=dArr[k];
                                        dArr[k]=dArr[k+1];
                                        dArr[k+1]=temp;
                                    }
                                }
                            }
                            //取条件值数组
                            let cArr
                            if(conditionName == "top10"){
                                cArr = dArr.slice(0, conditionValue0); //前10项数组
                            }
                            else if(conditionName == "top10%"){
                                cArr = dArr.slice(0, Math.floor(conditionValue0*dArr.length/100)); //前10%数组
                            }
                            else if(conditionName == "last10"){
                                cArr = dArr.slice((dArr.length-conditionValue0), dArr.length); //最后10项数组
                            }
                            else if(conditionName == "last10%"){
                                cArr = dArr.slice((dArr.length-Math.floor(conditionValue0*dArr.length/100)), dArr.length); //最后10%数组
                            }
                            //循环应用范围计算
                            for(let r = cellrange[s].row[0]; r <= cellrange[s].row[1]; r++){
                                for(let c = cellrange[s].column[0]; c <= cellrange[s].column[1]; c++){
                                    if(d[r] == null || d[r][c] == null){
                                        continue;
                                    }

                                    //单元格值
                                    let cellVal = d[r][c];
                                    //符合条件
                                    if(cArr.indexOf(cellVal) != -1){
                                        if((r + "_" + c) in computeMap){
                                            computeMap[r + "_" + c]["textColor"] = textColor;
                                            computeMap[r + "_" + c]["cellColor"] = cellColor;
                                        }
                                        else{
                                            computeMap[r + "_" + c] = { "textColor": textColor, "cellColor": cellColor };
                                        }
                                    }
                                }
                            }
                        }
                        else if(conditionName == "AboveAverage" || conditionName == "SubAverage"){
                            //计算数组平均值
                            let sum = 0;
                            for(let j = 0; j < dArr.length; j++){
                                sum += dArr[j];
                            }
                            let averageNum = sum / dArr.length;
                            //循环应用范围计算
                            if(conditionName == "AboveAverage"){ //高于平均值
                                for(let r = cellrange[s].row[0]; r <= cellrange[s].row[1]; r++){
                                    for(let c = cellrange[s].column[0]; c <= cellrange[s].column[1]; c++){
                                        if(d[r] == null || d[r][c] == null){
                                            continue;
                                        }

                                        //单元格值
                                        let cellVal = d[r][c];
                                        //符合条件
                                        if(cellVal > averageNum){
                                            if((r + "_" + c) in computeMap){
                                                computeMap[r + "_" + c]["textColor"] = textColor;
                                                computeMap[r + "_" + c]["cellColor"] = cellColor;
                                            }
                                            else{
                                                computeMap[r + "_" + c] = { "textColor": textColor, "cellColor": cellColor };
                                            }
                                        }
                                    }
                                }
                            }
                            else if(conditionName == "SubAverage"){ //低于平均值
                                for(let r = cellrange[s].row[0]; r <= cellrange[s].row[1]; r++){
                                    for(let c = cellrange[s].column[0]; c <= cellrange[s].column[1]; c++){
                                        if(d[r] == null || d[r][c] == null){
                                            continue;
                                        }

                                        //单元格值
                                        let cellVal = d[r][c];
                                        //符合条件
                                        if(cellVal < averageNum){
                                            if((r + "_" + c) in computeMap){
                                                computeMap[r + "_" + c]["textColor"] = textColor;
                                                computeMap[r + "_" + c]["cellColor"] = cellColor;
                                            }
                                            else{
                                                computeMap[r + "_" + c] = { "textColor": textColor, "cellColor": cellColor };
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else if(conditionName == "formula"){
                        continue
                        let str = cellrange[s].row[0],
                            edr = cellrange[s].row[1],
                            stc = cellrange[s].column[0],
                            edc = cellrange[s].column[1];

                        let formulaTxt = conditionValue0;
                        if(conditionValue0.toString().slice(0, 1) != '='){
                            formulaTxt = '=' + conditionValue0;
                        }

                        for(let r = str; r <= edr; r++){
                            for(let c = stc; c <= edc; c++){
                                let func = formulaTxt;
                                let offsetRow = r - str;
                                let offsetCol = c - stc;

                                if(offsetRow > 0){
                                    func = "=" + formula.functionCopy(func, "down", offsetRow);
                                }

                                if(offsetCol > 0){
                                    func = "=" + formula.functionCopy(func, "right", offsetCol);
                                }

                                let funcV = formula.execfunction(func);
                                let v = funcV[1];

                                if(typeof v != 'boolean'){
                                    v = !!Number(v);
                                }

                                if(!v){
                                    continue;
                                }

                                if((r + "_" + c) in computeMap){
                                    computeMap[r + "_" + c]["textColor"] = textColor;
                                    computeMap[r + "_" + c]["cellColor"] = cellColor;
                                }
                                else{
                                    computeMap[r + "_" + c] = { "textColor": textColor, "cellColor": cellColor };
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return computeMap;
} 