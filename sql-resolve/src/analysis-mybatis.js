/**
 * 截取 Preparing: 后面的sql语句
 * 获取Parameters: 后面的参数 ,根据类型替换
 *
 */
const sqlFormatter = require('sql-formatter');
const highlightingSQL = require('./highlighting-sql');


const SQL_KEY = "Preparing: ";
const PARAM_KEY = "Parameters: ";


/**
 * 带高亮转换
 * @param text
 * @returns {*}
 */
function transformHighlight(text){
    return main(text,true);
}

/**
 * 直接转换
 * @param text
 * @returns {*}
 */
function transform(text){
    return main(text,false);
}

function main(text,highlight) {
    let lines = getLines(text);
    let originSql;
    let preSql;
    lines.forEach(function (line) {
        if (isSql(line)) {
            preSql = fetchSql(line);
        }
        if (isParam(line)) {
            //提取值
            let paramList = fetchParam(line);
            if (preSql !== undefined) {
                if (originSql === undefined) {
                    originSql = sqlFormatter.format(assemblySql(preSql, paramList)) + ";\n\n";
                } else {
                    originSql = originSql + sqlFormatter.format(assemblySql(preSql, paramList)) + ";\n\n";
                }
            }
        }
    });
    //高亮标记转化
    if (originSql !== undefined&&highlight) {
        originSql = highlightingSQL(originSql);
    }
    return originSql;

}

function fetchParam(line) {
    let paramString = subStringByKey(line, PARAM_KEY);
    let paramObjectArray = [];

    function fetchType(text, l, r) {
        return text.substring(l + 1, r);
    }

    function fetchValue(text, l) {
        return text.substring(0, l).trim();
    }

    paramString.split(",").forEach(function (text) {
        let l = text.indexOf("(");
        let r = text.indexOf(")");
        let valueString = fetchValue(text, l);
        let typeString = fetchType(text, l, r);
        paramObjectArray.push({valueString: valueString, typeString: typeString})
    });
    return paramObjectArray;
}

function subStringByKey(line, key) {
    return line.substr(line.indexOf(key) + key.length);
}

/**
 * 拼装SQL
 */
function assemblySql(preSql, paramList) {
    let counter = 0;
    let originSql = '';

    for (let c of preSql) {
        if (c === '?') {
            originSql += replaceValue(paramList[counter]);
            counter++;
        } else {
            originSql += c;
        }
    }
    return originSql;

    function replaceValue(param) {

        let value = param.valueString;
        if (isNumber(param.typeString)) {
            return value;
        } else {
            return "\'" + value + "\'";
        }

    }

    function isNumber(typeString) {
        let numberTypeList = "Integer,Long,Short".split(",");
        for (let type of numberTypeList) {
            if (typeString === type) {
                return true;
            }
        }
        return false;
    }


}

function fetchSql(text) {
    return subStringByKey(text, SQL_KEY);
}

function isSql(text) {
    return text.indexOf(SQL_KEY) > 0;
}

function isParam(text) {
    return text.indexOf('Parameters') > 0;
}

function getLines(text) {
    const stringLines = [];
    text.trim().split('\n').forEach(function (v) {
        stringLines.push(v);
    });
    return stringLines;
}

function c(intput) {
    return main(intput) !== undefined;
}

module.exports={'transformHighlight':transformHighlight,'transform': transform, 'check': c};


