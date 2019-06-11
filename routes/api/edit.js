const express = require('express')
const router = express.Router()



function isLoggedIn(req, res, next) {
  if (req.session.loggedin) {
    return next();
  }
  res.redirect('/');
}

router.get('/', (req, res) => {

  let mysql  = require('mysql');
        let config = require('../../config');
        let connection = mysql.createConnection(config);

        var item_id = req.query.itemid;

    connection.query('SELECT tag FROM tags GROUP BY tag', function getTag (err, tag) {
      if (err) throw err;
      console.log('tag total '+tag.length);
      connection.query('SELECT * FROM items WHERE item_id = ?', item_id, function (err, item) {
        if (err) throw err;
        connection.query("SELECT tag FROM tags WHERE item_id = '"+item_id+"'", function getAllTagInItem (err, tagAll) {
          if (err) throw err;
          console.log('tag have '+tagAll.length);
        connection.end();
        res.render("edit",{page:'Edit', menuId:'edititem',tags:tag,item:item,itemtags:tagAll, user: req.session.user});
      });
    });
  });

        
})

//ฟังก์ชั่นแก้ไข้ไอเทม
router.post('/change', function (req, res){
  let mysql  = require('mysql');
  let config = require('../../config');
  let conn = mysql.createConnection(config);

  let id = req.body.itemid;
  console.log('status edit '+req.body.status);
  let data = {
      name: req.body.name,
      detail: req.body.detail,
      status: req.body.status,
      age: req.body.age,
      weight: req.body.weight,
      price: req.body.price
     }
     let array = req.body.tag.split(",");
     conn.query('UPDATE items SET ? WHERE item_id = '+id,data, function updateItem(err, resp) {
      if (err) throw err;
      conn.query('DELETE FROM tags WHERE item_id = ?',id, function deleteTag (err, tag) {
        if (err) throw err;
        let sql = "INSERT INTO tags (item_id, tag) VALUES ?";
        let values = [];

        for( let i=0; i<array.length; i++ ) {
          values.push( [id,array[i]] );
        }

        conn.query(sql, [values], function addNewTag (err, resp) {
          if (err) throw err;
          req.flash('success_messages','Update item Success')
          res.redirect('/item/list');
        });
      });
    });
})


module.exports = router