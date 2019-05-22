module.exports = function(app)
{

    

    app.get('/search', function(req, res) {

        let mysql  = require('mysql');
        let config = require('../config');
        let connection = mysql.createConnection(config);
        let search_word;
        let page_number =1;
        if(req.query.pagenumber)
            page_number = req.query.pagenumber;

        if(req.query.search)
            search_word = req.query.search;

        connection.query('SELECT name FROM items WHERE name LIKE ?','%'+search_word+'%',function checkMaxRow(err, row) {
            if (err) throw err;
            let max_page = parseInt(row.length/18)+((row.length%18)>0?1:0);
            console.log('page = '+page_number +" max = "+max_page);
        
            connection.query("SELECT * FROM items WHERE name LIKE '%"+search_word+"%' limit ?,18",(18*page_number)-18,function selectItem(err, results) {
            if (err) throw err;
            connection.end();
            res.render("search",{page:'Search', menuId:'search',wordsearch:search_word,maxpage:max_page,pageselect:page_number,items:results, user: req.session.user});
            });
          });
        
      });
}