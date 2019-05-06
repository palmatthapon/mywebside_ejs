var mysql = require('mysql');
var con = mysql.createConnection({
 host: "localhost",
 user: "root",
 password: "",
 database: "testdb"
});
con.connect(function(err) {
 if (err) throw err;
 console.log("Connected!");
var sql = "CREATE TABLE items2 (item_id int,name VARCHAR(255), pic1 VARCHAR(255), pic2 VARCHAR(255), pic3 VARCHAR(255), pic4 VARCHAR(255), pic5 VARCHAR(255), detail VARCHAR(255), weight double,price double)";
 con.query(sql, function (err, result) {
 if (err) throw err;
 console.log("Table created");
 });
});