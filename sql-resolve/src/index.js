const mybatis = require('./analysis-mybatis');
const sqlDDL = require('./analysis-sql-ddl');
const clipboard = require('clipboard');

if (window) {
    window.mybatis = mybatis;
    window.sqlDDL = sqlDDL;
    window.ClipboardJS=clipboard;
}


