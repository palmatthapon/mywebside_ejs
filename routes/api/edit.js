const express = require('express')
const router = express.Router()



function isLoggedIn(req, res, next) {
  if (req.session.loggedin) {
    return next();
  }
  res.redirect('/');
}

router.get('/',isLoggedIn, (req, res) => {

  let mysql  = require('mysql');
        let config = require('../../config');
        let connection = mysql.createConnection(config);

        var item_id = req.query.itemid;
        console.log(item_id)

        connection.query('SELECT * FROM items WHERE item_id = ?', item_id, function (err, item) {
            if (err) throw err;
            // if there are no errors send an OK message.
            res.render("edit",{page:'Edit', menuId:'edititem',item:item, user: req.session.user});
        });
})

//ฟังก์ชั่นแก้ไข้ไอเทม
router.post('/change',isLoggedIn, function (req, res){
  let mysql  = require('mysql');
  let config = require('../../config');
  let connection = mysql.createConnection(config);

  let id = req.body.itemid;
  console.log('status edit '+req.body.status);
  let data = {
      name: req.body.name,
      detail: req.body.detail,
      status: req.body.status,
      weight: req.body.weight,
      price: req.body.price,
      tag: req.body.tag
     }

  connection.query('UPDATE items SET ? WHERE item_id = '+id,data, function (err, resp) {
      if (err) throw err;
      // if there are no errors send an OK message.
      req.flash('success_messages','Update item Success')
      res.redirect('/item/list');
    });
})


module.exports = router