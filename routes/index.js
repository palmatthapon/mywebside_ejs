var express = require('express');
var router = express.Router();


const route_api = require('./api')

router.use('/item', route_api)

/* GET home page. */
router.get('/', function(req, res, next) {
  let mysql  = require('mysql');
  let config = require('../config');
  let connection = mysql.createConnection(config);

  connection.query('SELECT * FROM items',function selectItem(err, results, fields) {
    if (err) throw err;
    // if there are no errors send an OK message.
    res.render("index",{page:'Home', menuId:'home',items:results, user: req.session.user});
  });
});

router.get('/about', function(req, res, next) {
    res.render("about",{page:'About', menuId:'about'});
});


module.exports = router;
