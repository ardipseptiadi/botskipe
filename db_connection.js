var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "botchat"
});

var OrderLabels = [];

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("SELECT * FROM bc_order", function (err, result,fields) {
    if (err) throw err;
    result.forEach(function(value){
      OrderLabels.push('1')
    });
  });
  console.log(OrderLabels);
});
