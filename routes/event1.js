module.exports = function(app)
{

    function isLoggedIn(req, res, next) {
        if (req.session.loggedin) {
          return next();
          }
        res.redirect('/');
      }

    app.get('/event1', function(req, res) {

        let mysql  = require('mysql');
        let config = require('../config');
        let conn = mysql.createConnection(config);
        conn.query('SELECT * FROM event1',function selectItem(err, results, fields) {
            if (err) throw err;
            conn.end();
            res.render("event1",{page:'Event1', menuId:'event1',slot:results, user: req.session.user});
        });
        
    });

    app.post('/add', isLoggedIn,function (req, res) {
        let mysql  = require('mysql');
        let config = require('../../config');
        let conn = mysql.createConnection(config);
      
        conn.query('SELECT * FROM event1',function selectItem(err, results, fields) {
            if (err) throw err;
            conn.end();
            res.render("event1",{page:'Event1', menuId:'event1',slot:results, user: req.session.user});
        });
      });
      
}