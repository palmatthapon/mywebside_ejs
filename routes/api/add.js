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
router.get('/', isLoggedIn,function(req, res, next) {
    console.log('post method');
    res.render("add",{page:'Add item', menuId:'additem', user: req.session.user});
});

router.post('/singleuploadimage', isLoggedIn, upload.single('userPhoto'),function(req, res) {
  var filename = req.file.path;
  res.send("Uploading File: " + JSON.stringify(req.file)+" name "+filename);
});

router.post('/submit', isLoggedIn, upload.array('image',5),function (req, res) {
  let mysql  = require('mysql');
  let config = require('../../config');
  let connection = mysql.createConnection(config);

  let imageName = [];
  req.files.forEach(element => {
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
  imageName.push('h680-'+element.filename);
})
console.log('status add '+req.body.status);

let item = {
  name: req.body.name4,
  pic1: imageName[0],
  pic2: imageName[1],
  pic3: imageName[2],
  pic4: imageName[3],
  pic5: imageName[4],
  detail: req.body.detail,
  status: req.body.status,
  weight: req.body.weight,
  price: req.body.price,
  tag: req.body.tag
 }

 connection.query('INSERT INTO items SET ?',item, function (err, resp) {
  if (err) throw err;
  
  connection.end();
  req.flash('success_messages','Uploading File Success')
  res.redirect('/item/list');
});

});

module.exports = router