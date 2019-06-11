const express = require('express')
const router = express.Router()

const multer = require('multer');

const path = require('path');
const sharp = require('sharp');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
      var ext = path.extname(file.originalname);
      var filename = file.fieldname + "-" + Date.now() + ext;
      console.log(filename);
      cb(null, filename);
  }
})
 
const upload = multer({ storage: storage })

function isLoggedIn(req, res, next) {
  if (req.session.loggedin) {
    return next();
	}
  res.redirect('/');
}

/* additem page. */
router.get('/',function(req, res) {
  let mysql  = require('mysql');
  let config = require('../../config');
  let connection = mysql.createConnection(config);
    connection.query('SELECT tag FROM tags GROUP BY tag', function getTag (err, tag) {
      if (err) throw err;
      console.log('tag have '+tag.length);
      connection.end();
      res.render("add",{page:'เพิ่มสินค้า', menuId:'additem',tags:tag, user: req.session.user});
  });
});

router.post('/singleuploadimage', upload.single('userPhoto'),function(req, res) {
  var filename = req.file.path;
  res.send("Uploading File: " + JSON.stringify(req.file)+" name "+filename);
});

var cpUpload = upload.fields([{ name: 'image', maxCount: 5 }, { name: 'video', maxCount: 1 }])

router.post('/submit', cpUpload,function (req, res) {
  let mysql  = require('mysql');
  let config = require('../../config');
  let conn = mysql.createConnection(config);

  let imageNames = [];
  req.files['image'].forEach(element => {
    console.log(element.path);

    sharp(element.path).resize({ height: 680 }).toFile(element.destination+ 'h680-'+element.filename, function(err) {
      if (err) {
          console.error('sharp>>>', err);
      }else{
        const fs = require('fs');
        fs.unlink(element.path, function (err) {            
             if (err) {                                                 
                 console.error(err);                                    
             }                                                          
            console.log('File has been Deleted');                           
         });        
      }
      console.log('resize success: '+element.filename);
  });
  imageNames.push('h680-'+element.filename);
})
console.log('status add '+req.body.status);


let item = {
  name: req.body.name4,
  image: imageNames[0],
  video: req.files['video']!=null?req.files['video'][0].filename!=null:'',
  detail: req.body.detail,
  status: req.body.status,
  age: req.body.age,
  weight: req.body.weight,
  price: req.body.price,
 }
 
 conn.query('INSERT INTO items SET ?',item, function (err, resp) {
    if (err) throw err;
      console.log("lastinserted "+resp.insertId);

      if(imageNames.length >1){
        var sqlImg = "INSERT INTO images (item_id, image) VALUES ?";
        var imgs = [];
  
        for( var i=1; i<imageNames.length; i++ ) {
          imgs.push( [resp.insertId,imageNames[i]] );
        }
  
        conn.query(sqlImg, [imgs], function (err, resp) {
          if (err) throw err;
        });
      }
      if(req.body.tag!=''){
        var tagArray = req.body.tag.split(",");
        var sql = "INSERT INTO tags (item_id, tag) VALUES ?";
        var values = [];
  
        for( var i=0; i<tagArray.length; i++ ) {
          values.push( [resp.insertId,tagArray[i]] );
        }
        conn.query(sql, [values], function (err, resp) {
          if (err) throw err;
        });
      }
      conn.end();
              req.flash('success_messages','Uploading File Success')
              res.redirect('/item/list');
  });

});

module.exports = router