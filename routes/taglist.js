module.exports = function(app)
{

    app.get('/taglist', function(req, res) {
        let mysql  = require('mysql');
        let config = require('../config');
        let conn = mysql.createConnection(config);

        let page_number =1;
        if(req.query.pagenumber)
            page_number = req.query.pagenumber;
            
        let tagCall = req.query.tag;
        conn.query('SELECT item_id FROM tags WHERE tag = ? GROUP BY item_id',tagCall,function getItemAllByTag(err, itemIdLoad) {
            if (err) throw err;
            let max_page;
            if(itemIdLoad.length>0){
                max_page = parseInt(itemIdLoad.length/18)+((itemIdLoad.length%18)>0?1:0);
                console.log('page = '+page_number +" max = "+max_page);
                var values = [];
                itemIdLoad.forEach(element => {
                    values.push( element.item_id);
                });
            
                conn.query("SELECT * FROM items WHERE item_id IN (?) limit "+((18*page_number)-18)+",18",[values],function selectItem(err, results, fields) {
                if (err) throw err;
                conn.end();
                res.render("taglist",{page:tagCall, menuId:tagCall,maxpage:max_page,pageselect:page_number,items:results, user: req.session.user});
                });
            }else{
                res.render("taglist",{page:tagCall, menuId:tagCall,maxpage:max_page,pageselect:page_number,items:0, user: req.session.user});
            }
                
          });
        
      });
}