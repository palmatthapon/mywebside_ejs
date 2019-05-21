module.exports = function(app)
{


    app.get("/showitem", function(req, res) {

        let mysql  = require('mysql');
        let config = require('../config');
        let connection = mysql.createConnection(config);

        let item_id = req.query.itemid;
        console.log('item id = '+item_id);

        connection.query("SELECT * FROM items WHERE item_id = '"+item_id+"' LIMIT 1", function (err, item) {
            if (err) throw err;
            connection.query("SELECT * FROM items WHERE tag = '"+item[0].tag+"' limit 12", function (err, results) {
                if (err) throw err;

                connection.end();
                res.render('showitem', {page:'Item', menuId:'item',itemShow:item,items:results});
            });
        });
        
    });
}