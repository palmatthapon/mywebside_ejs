var express = require('express');
var router = express.Router();


const route_api = require('./api')

router.use('/item', route_api)


/* GET home page. */
router.get('/', function(req, res) {
  let mysql  = require('mysql');
  let config = require('../config');
  let connection = mysql.createConnection(config);
  connection.query('SELECT item_id FROM items',function checkMaxRow(err, row) {
    if (err) throw err;
    let max_page = parseInt(row.length/18)+((row.length%18)>0?1:0);
    connection.query('SELECT * FROM items limit 18',function getFirstPage(err, results) {
      if (err) throw err;
      console.log('maxpage = '+max_page);
      connection.end();
      res.render("index",{page:'Home', menuId:'home',maxpage:max_page,pageselect:1,items:results, user: req.session.user});
    });
  });
  
});

router.get('/page', function(req, res) {
  
  let mysql  = require('mysql');
  let config = require('../config');
  let conn = mysql.createConnection(config);

  let page_number = req.query.page;
  let max_page = req.query.max;

  conn.query('SELECT * FROM items limit ?,18',(18*page_number)-18,function selectItem(err, results, fields) {
    if (err) throw err;
    conn.end();
    res.render("index",{page:'Home', menuId:'home',maxpage:max_page,pageselect:page_number,items:results, user: req.session.user});
  });
});




router.get('/about', function(req, res) {
    res.render("about",{page:'About', menuId:'about'});
});




module.exports = router;
