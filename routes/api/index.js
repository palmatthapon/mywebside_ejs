const express = require('express')
const router = express.Router()

function isLoggedIn(req, res, next) {
  if (req.session.loggedin) {
    //response.send('Welcome back, ' + request.session.username + '!');
    return next();
  }
  res.redirect("/")
}

router.get('/',(req, res) => {
  if (req.session.loggedin) {
    res.redirect("/item/profile")
  }else{
    res.render('item',{ page:'Item', menuId:'item'});
  }
});

//หน้าเข้าสู่ระบบ
router.get('/login', function (req, res) {
  res.render('login', { page:'Login', menuId:'login'});
});

router.post('/auth', function(req, res) {
  let mysql  = require('mysql');
  let config = require('../../config');
  let connection = mysql.createConnection(config);

	var username = req.body.username;
	var password = req.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				req.session.loggedin = true;
        req.session.username = username;
        req.session.user = results[0];
        res.redirect("/item/profile")
			} else {
        req.flash('error_messages','Incorrect Username and/or Password!')
        res.redirect("/item/login");
			}			
			res.end();
		});
	} else {
    req.flash('error_messages','Please enter Username and Password!')
    res.redirect("/item/login")
    res.end();;
	}
});

//หน้าโปรไฟล์
router.get('/profile', isLoggedIn, function (req, res) {
  res.render('profile', {page:'Profile', menuId:'profile', user: req.session.user});
});

//ออกจากระบบ
router.get('/logout',isLoggedIn, function (req, res, callback) {
  var sess = req.session.user;
    if(sess){
        req.session.username = null;
        req.session.user = null;
        req.session.loggedin = null;
        res.redirect("/item");
        return callback(null, {'success': true, "message": "user logout successfully"});
    }
    callback(null, {'success': true, "message": "user logout successfully"});
});

router.use('/list', require('./list'))
router.use('/add', require('./add'))
router.use('/edit', require('./edit'))
router.use('/success', require('./success'))


module.exports = router