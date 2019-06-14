module.exports = function(app)
{

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

    app.get('/event1', function(req, res) {

        let mysql  = require('mysql');
        let config = require('../config');
        let conn = mysql.createConnection(config);
        conn.query('SELECT * FROM event1images',function getImages(err, imgs, fields) {
          if (err) throw err;
          conn.query('SELECT * FROM event1',function getNumber(err, results, fields) {
            if (err) throw err;
            conn.end();
            res.render("event1",{page:'Event1', menuId:'event1',imgShow:imgs,slot:results, user: req.session.user});
        });
      });
        
        
    });

    var cpUpload = upload.fields([{ name: 'image', maxCount: 5 }])
    app.post('/addevent1', cpUpload,function (req, res) {
        let mysql  = require('mysql');
        let config = require('../config');
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

      if(imageNames.length >1){
        var sqlImg = "INSERT INTO event1images (image) VALUES ?";
        var imgs = [];
  
        for( var i=0; i<imageNames.length; i++ ) {
          imgs.push( [imageNames[i]] );
        }
  
        conn.query(sqlImg, [imgs], function (err, resp) {
          if (err) throw err;
        });
      }
      if(req.body.end >req.body.start){
        var sql = "INSERT INTO event1 (number, status) VALUES ?";
        var values = [];
  
        for( var i=req.body.start; i<=req.body.end; i++ ) {
          values.push( [i,0]);
        }
        conn.query(sql, [values], function (err, resp) {
          if (err) throw err;
          req.flash('success_messages','Uploading File Success')
          res.redirect('/event1');
        });
      }else{
        req.flash('success_messages','Uploading File Success')
        res.redirect('/event1');
      }
        
      });
      
}