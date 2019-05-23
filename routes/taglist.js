module.exports = function(app)
{

    app.get('/taglist', function(req, res, next) {
        let mysql  = require('mysql');
        let config = require('../config');
        let connection = mysql.createConnection(config);

        let page_number =1;
        if(req.query.pagenumber)
            page_number = req.query.pagenumber;
            
        let tagCall = req.query.tag;
        connection.query('SELECT item_id FROM tags WHERE tag = ? GROUP BY item_id',tagCall,function getItemAllByTag(err, itemIdLoad) {
            if (err) throw err;

            let max_page = parseInt(itemIdLoad.length/18)+((itemIdLoad.length%18)>0?1:0);
            console.log('page = '+page_number +" max = "+max_page);
            var values = [];
            itemIdLoad.forEach(element => {
                values.push( element.item_id);
            });
        
            connection.query("SELECT * FROM items WHERE item_id IN (?) limit "+((18*page_number)-18)+",18",[values],function selectItem(err, results, fields) {
            if (err) throw err;
            connection.end();
            res.render("taglist",{page:tagCall, menuId:tagCall,maxpage:max_page,pageselect:page_number,items:results, user: req.session.user});
            });
          });
        
      });
}