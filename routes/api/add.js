const express = require('express')
const router = express.Router()

var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
  }
})
 
var upload = multer({ storage: storage })

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

router.post('/submit', isLoggedIn, upload.array('userPhoto',5),function (req, res) {
  let mysql  = require('mysql');
  let config = require('../../config');
  let connection = mysql.createConnection(config);

  let images = [];

  req.files.forEach(element => {
    images.push(element.originalname)
  });

  let item = {
      name: req.body.name4,
      pic1: images[0],
      pic2: images[1],
      pic3: images[2],
      pic4: images[3],
      pic5: images[4],
      detail: req.body.detail,
      weight: req.body.weight,
      price: req.body.price,
      tag: req.body.tag
     }

  connection.query('INSERT INTO items SET ?',item, function (err, resp) {
      if (err) throw err;
      // if there are no errors send an OK message.
      req.flash('success_messages','Uploading File Success')
      res.redirect('/item/list');
    });
});

module.exports = router