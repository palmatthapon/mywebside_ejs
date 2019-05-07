const express = require('express')
const router = express.Router()


function isLoggedIn(req, res, next) {
  if (req.session.loggedin) {
    return next();
  }
  res.redirect("/")
}

router.get('/', isLoggedIn,(req, res) => {
  let mysql  = require('mysql');
  let config = require('../../config');
  let connection = mysql.createConnection(config);

  connection.query('SELECT * FROM items',function selectItem(err, results, fields) {
    if (err) throw err;
    // if there are no errors send an OK message.
    res.render("list",{page:'Item list', menuId:'item-list',items:results, user: req.session.user });
  });
})


router.get('/delete',isLoggedIn, (req, res) => {

  let mysql  = require('mysql');
        let config = require('../../config');
        let connection = mysql.createConnection(config);

        let item_id = req.query.itemid;
        console.log(item_id)

        
        connection.query('SELECT * FROM items WHERE item_id = ? limit 1', item_id,function selectItem(err, results, fields) {
          if (err) throw err;
          
          const fs = require('fs');
          let picList = [results[0].pic1,results[0].pic2,results[0].pic3,results[0].pic4,results[0].pic5];
          picList.forEach(element => {
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
          connection.query('DELETE FROM items WHERE item_id = ?', item_id, function (err, item) {
            if (err) throw err;
            req.flash('success_messages','delete success!')
            res.redirect("/item/list")
          });
        });

})


module.exports = router