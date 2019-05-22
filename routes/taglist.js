module.exports = function(app)
{

    let page_number =1;
    let max_page=1;

    app.get('/taglist', function(req, res, next) {
        let mysql  = require('mysql');
        let config = require('../config');
        let connection = mysql.createConnection(config);
        if(req.query.pagenumber)
            page_number = req.query.pagenumber;
        else
            page_number = 1;
        let tagCall = req.query.tag;
        connection.query('SELECT tag FROM items WHERE tag =?',tagCall,function checkMaxRow(err, row) {
            if (err) throw err;
            max_page = parseInt(row.length/18)+((row.length%18)>0?1:0);
            console.log('page = '+page_number +" max = "+max_page);
        
            connection.query("SELECT * FROM items WHERE tag ='"+tagCall+"' limit ?,18",(18*page_number)-18,function selectItem(err, results, fields) {
            if (err) throw err;
            connection.end();
            res.render("taglist",{page:tagCall, menuId:tagCall,maxpage:max_page,pageselect:page_number,items:results, user: req.session.user});
            });
          });
        
      });
}