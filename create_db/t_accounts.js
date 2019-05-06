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
var sql = "CREATE TABLE accounts (id int(11) NOT NULL,username varchar(50) NOT NULL,password varchar(255) NOT NULL,email varchar(100) NOT NULL)"
 con.query(sql, function (err, result) {
 if (err) throw err;
 console.log("Table created");
 });
});