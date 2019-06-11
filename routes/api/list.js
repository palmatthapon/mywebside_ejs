const express = require('express')
const router = express.Router()


function isLoggedIn(req, res, next) {
  if (req.session.loggedin) {
    return next();
  }
  res.redirect("/")
}

let max_page=1;

router.get('/', isLoggedIn,(req, res) => {
  let mysql  = require('mysql');
  let config = require('../../config');
  let connection = mysql.createConnection(config);
  connection.query('SELECT item_id FROM items',function checkMaxRow(err, row) {
    if (err) throw err;
    max_page = parseInt(row.length/24)+((row.length%24)>0?1:0);
    
    connection.query('SELECT * FROM items limit 24',function getList(err, results) {
      if (err) throw err;
      connection.end();
      res.render("list",{page:'จัดการรายการสินค้า', menuId:'itemlist',maxpage:max_page,pageselect:1,items:results, user: req.session.user });
    });
  });
})

router.get('/page', function(req, res) {
  
  let mysql  = require('mysql');
  let config = require('../../config');
  let connection = mysql.createConnection(config);

  let page_number = req.query.page;
  let max_page = req.query.max;
  connection.query('SELECT * FROM items limit ?,24',(24*page_number)-23,function selectItem(err, results, fields) {
    if (err) throw err;
    connection.end();
    res.render("list",{page:'Item List', menuId:'list',maxpage:max_page,pageselect:page_number,items:results, user: req.session.user });
  });
});


router.get('/delete',isLoggedIn, (req, res) => {

  let mysql  = require('mysql');
        let config = require('../../config');
        let connection = mysql.createConnection(config);

        let item_id = req.query.itemid;
        console.log(item_id)

        
        connection.query('SELECT * FROM items WHERE item_id = ?', item_id,function getItem(err, results) {
          if (err) throw err;
          
          const fs = require('fs');
          let fileList = [];
          fileList.push(results[0].image);

          if(results[0].video){
            fileList.push(results[0].video);
          }

          connection.query('SELECT * FROM images WHERE item_id = ?', item_id,function getImages(err, imgs) {
            if (err) throw err;
            
            imgs.forEach(element => {
              fileList.push(element.image);
            });

            fileList.forEach(element => {
              console.log('public/uploads/'+element);
              if(element!=null){
                fs.unlink('public/uploads/'+element, function (err) {            
                  if (err) {                                                 
                      console.error(err);                                    
                  }                                                          
                  console.log('File has been Deleted');                           
                }); 
              }
            });
          
          connection.query('DELETE FROM images WHERE item_id = ?', item_id, function deleteImage (err, item) {
            if (err) throw err;

            connection.query('DELETE FROM tags WHERE item_id = ?', item_id, function deleteTag (err, item) {
              if (err) throw err;

              connection.query('DELETE FROM items WHERE item_id = ?', item_id, function deleteItem (err, item) {
                if (err) throw err;
                
                req.flash('success_messages','delete success!')
                res.redirect("/item/list")
              });
            });
          });
        });
      });
})


module.exports = router