module.exports = function(app)
{
    app.get("/showitem", function(req, res) {

        let mysql  = require('mysql');
        let config = require('../config');
        let connection = mysql.createConnection(config);

        var item_id = req.query.itemid;
        console.log(item_id)

        connection.query('SELECT * FROM items WHERE item_id = ? limit 1', item_id, function (err, item) {
            if (err) throw err;
            // if there are no errors send an OK message.
            connection.query('SELECT * FROM items WHERE tag = ?', item[0].tag, function (err, results) {
                if (err) throw err;
                // if there are no errors send an OK message.
                res.render('showitem', {page:'Item', menuId:'item',itemShow:item,items:results});
            });
        });
            
    });
}