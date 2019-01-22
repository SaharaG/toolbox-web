function updateSQLCode(c) {
  //Add your columns here:
  var keyWords =
    ["AND", "AS", "USE", "ASC", "GROUP", "BETWEEN", "BY", "CASE", "CURRENT_DATE", "CURRENT_TIME", "DELETE", "DESC", "DISTINCT", "EACH", "ELSE", "ELSEIF", "FALSE", "FOR", "FROM", "GROUP", "HAVING", "IF", "IN", "INSERT", "INTERVAL", "INTO", "IS", "JOIN", "KEY", "KEYS", "LEFT", "LIKE", "LIMIT", "MATCH", "NOT", "NULL", "ON", "OPTION", "OR", "ORDER", "OUT", "OUTER", "REPLACE", "RIGHT", "SELECT", "SET", "TABLE", "THEN", "TO", "TRUE", "UPDATE", "VALUES", "WHEN", "WHERE"];
  const len = keyWords.length;
  for (let i = 0; i < len; i++) {
    keyWords.push(keyWords[i].toLowerCase());
  }
  console.log("keyWords" + keyWords.length);
  c = c.replace(/([=%\/*\-,;+<>])/g, "<span style='color: brown;'>$1</span>");

  //strings - text inside single quotes and backticks
  c = c.replace(/(['`].*?['`])/g, "<span class=\"string\">$1</span>");

  //numbers - same color as strings
  c = c.replace(/(\d+)/g, "<span style='color: red;'>$1</span>");

  //functions - any string followed by a '('
  c = c.replace(/(\w*?)\(/g, "<span style='color: blue;'>$1</span>(");

  //brackets - same as special chars
  c = c.replace(/([()])/g, "<span style='color: brown;'>$1</span>");

  //reserved mysql keywords
  keyWords.map((word) => {
    c = c.replace(new RegExp("\\b" + word + "\\b", "g"), "<span style='color: blue; font-weight: bold;'>" + word + "</span>")
  });



  //In JS the dot operator cannot match newlines. So we will use [\s\S] as a hack to select everything(space or non space characters)
  c = c.replace(/(\/\*[\s\S]*?\*\/)/g, clear_spans);
  return c;
}

function clear_spans(match) {
  match = match.replace(/<span.*?>/g, "");
  match = match.replace(/<\/span>/g, "");
  return "<span class=\"comment\">" + match + "</span>";
}

function updateSQLCode2(sql) {
    //Add your columns here:
    const keyWords =
        ["AND", "AS", "USE", "ASC", "GROUP", "BETWEEN", "BY", "CASE", "CURRENT_DATE", "CURRENT_TIME", "DELETE", "DESC", "DISTINCT", "EACH", "ELSE", "ELSEIF", "FALSE", "FOR", "FROM", "GROUP", "HAVING", "IF", "IN", "INSERT", "INTERVAL", "INTO", "IS", "JOIN", "KEY", "KEYS", "LEFT", "LIKE", "LIMIT", "MATCH", "NOT", "NULL", "ON", "OPTION", "OR", "ORDER", "OUT", "OUTER", "REPLACE", "RIGHT", "SELECT", "SET", "TABLE", "THEN", "TO", "TRUE", "UPDATE", "VALUES", "WHEN", "WHERE"];
    sql = sql.replace(/([=%\/*\-,;+<>])/g, "<span style=\"color: brown;\">$1</span>");
    // sql = sql.replace(/(['`].*?['`])/g, "<span style=\"color: red;\">$1</span>");

    keyWords.map((word) => {
        sql = sql.replace(new RegExp("\\b" + word + "\\b", "gi"), "<span style='color: blue; font-weight: bold;'>" + word + "</span>")
    });
    return sql;
}
module.exports=updateSQLCode2;
