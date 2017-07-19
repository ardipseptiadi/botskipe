var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "botchat"
});

module.exports = {
    db_conn: function(){
        return con;
    }
};