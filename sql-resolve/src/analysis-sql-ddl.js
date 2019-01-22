

function AnalysisSql(sqlText) {
    this.sqlText = sqlText;

    //要跳过的关键字行
    this.sqlKeyWord = "key,index,primary,unique";

    //生成java类 字符串
    this.generateJavaText=function(highlight) {
        let tableObject=this.getTableObject();
        console.log(tableObject);
        let obj=this;

        let javaText = `${highlight?'<span style="color:blue"> public class</span> ':'public class'} ${this.convertHump(tableObject.tableName)} {\n\r`;
        tableObject.fields.forEach(function (field) {

            if(field.comment!==''){
                javaText+=
                    `      /**
       *  ${field.comment}
       */
`;}
            javaText +=
                `      ${highlight?'<span style="color:blue">private</span>':'private'} ${obj.convertJavaType(field.type)} ${highlight?'<span style="color:#ff1fac">':''}${obj.convertHump(field.name)}${highlight?'</span>':''};\n\r`
        });
        javaText += '}';

        return javaText;
    };

    //获取所有字段
    this.getTableObject = function () {
        return {
            tableName: this.getTableName(),
            fields: this.getFields()
        }

    };

    this.check=function(){
        const regex = /create\s+table\s+(\S+)\s+/gi;
        return regex.test(this.sqlText);
    };

    //获取表名称
    this.getTableName = function () {
        const regex = /create\s+table\s+(\S+)\s+/gi;
        let tableName = regex.exec(this.sqlText)[1];
        if (tableName === undefined) {
            alert("sql格式不正确")
        }
        tableName = this.removeSpot(tableName);
        let spotIndex = tableName.indexOf('.');
        if (spotIndex > 0) {
            tableName = tableName.substr(spotIndex + 1)
        }
        return tableName;
    };

    this.removeSpot = function (text) {
        return text.replace(/`/g, "");
    };

    this.commentClean = function (text) {
        return text.replace(/[',]/g, "");
    };

    //获取字段
    this.getFields = function () {

        let allFieldString = this.sqlText.substring(this.sqlText.indexOf('(') + 1, this.sqlText.lastIndexOf(')'));
        console.log(allFieldString);

        let fieldStringArray = allFieldString.split(/[\n]/);

        let keyWordList = this.sqlKeyWord.toLocaleLowerCase().split(",");

        let fields = [];

        let obj = this;
        fieldStringArray.forEach(function (lineStr) {
            //转小写 去空格
            let lineArray = lineStr.trim().split(/\s+/);
            //不是空格 且 不是关键字
            let fieldName = lineArray[0];
            //筛选出非关键字 && 不是空行的字段
            if (lineArray.length > 1 && keyWordList.indexOf(fieldName.toLocaleLowerCase()) === -1) {
                let fieldType = lineArray[1].replace(/\(.+\)/g, "");
                fieldName=obj.removeSpot(fieldName);
                let fieldComment=obj.getComment(lineArray);
                fields.push({'name': obj.removeSpot(fieldName), 'type': fieldType,'comment':fieldComment})
            }
        });
        return fields;
    };

    this.getComment=function(lineArray){
        for(let i=0;i<lineArray.length;i++){
            if(lineArray[i].toLocaleLowerCase()==='comment'){
                return this.commentClean(lineArray[i+1]);
            }
        }
    };







    this.convertJavaType=function(sqlType) {
        const sqlTypeMapping="int,bigint,varchar,tinyint,datetime";
        const javaTypeMapping="Integer,Long,String,Integer,Date";
        let sqlTypeIndex=sqlTypeMapping.split(',').indexOf(sqlType);
        return javaTypeMapping.split(',')[sqlTypeIndex];
    };

    /**
     * 字段名转驼峰
     * eg: a_bc_de
     * return aBcDe
     */
    this.convertHump=function(downLineText) {
        let s = '';
        let preIsDownLine = false;
        for (let i = 0; i < downLineText.length; i++) {
            let c = downLineText[i];
            if (c === '_') {
                preIsDownLine = true;
            } else {
                if (preIsDownLine) {
                    s += c.toLocaleUpperCase();
                    preIsDownLine = false;
                } else {
                    s += c;
                }
            }
        }
        return s;
    };


}

/**
 * 加入高亮
 */
function f1(inputText) {
    return new AnalysisSql(inputText).generateJavaText(true);
}

/**
 * 不高亮
 * @param inputText
 * @returns {string}
 */
function f(inputText) {
    return new AnalysisSql(inputText).generateJavaText(false);
}
function c(inputText){
    return new AnalysisSql(inputText).check();
}
module.exports={'transform':f,'transformHighlight':f1,'check':c};
