var express = require('express');
var router = express.Router();


const route_api = require('./api')

router.use('/item', route_api)

let page_number =1;
let max_page=1;

/* GET home page. */
router.get('/', function(req, res, next) {
  let mysql  = require('mysql');
  let config = require('../config');
  let connection = mysql.createConnection(config);
  page_number=1;
  connection.query('SELECT item_id FROM items',function checkMaxRow(err, row) {
    if (err) throw err;
    max_page = parseInt(row.length/18)+((row.length%18)>0?1:0);
    connection.query('SELECT * FROM items limit 18',function getFirstPage(err, results) {
      if (err) throw err;
      console.log('maxpage = '+max_page);
      connection.end();
      res.render("index",{page:'Home', menuId:'home',maxpage:max_page,pageselect:page_number,items:results, user: req.session.user});
    });
  });
  
});

router.get('/page', function(req, res, next) {
  page_number = req.query.pagenumber;
  console.log('page = '+page_number +" max = "+max_page);
  if(page_number<1 || page_number>max_page) return;

  let mysql  = require('mysql');
  let config = require('../config');
  let connection = mysql.createConnection(config);

  connection.query('SELECT * FROM items limit ?,18',(18*page_number)-17,function selectItem(err, results, fields) {
    if (err) throw err;
    connection.end();
    res.render("index",{page:'Home', menuId:'home',maxpage:max_page,pageselect:page_number,items:results, user: req.session.user});
  });
});


router.get('/about', function(req, res, next) {
    res.render("about",{page:'About', menuId:'about'});
});


module.exports = router;
