module.exports = function(app)
{


    app.get("/showitem", function(req, res) {

        let mysql  = require('mysql');
        let config = require('../config');
        let connection = mysql.createConnection(config);

        let getId = req.query.itemid;

        connection.query("SELECT * FROM items WHERE item_id = '"+getId+"'", function getItemIsShow (err, itemIsShow) {
            if (err) throw err;

            connection.query("SELECT image FROM images WHERE item_id = '"+getId+"'", function getImagesIsShow (err, imagesIsShow) {
                if (err) throw err;


                connection.query("SELECT tag FROM tags WHERE item_id = '"+getId+"'", function getTagsByItemId (err, tagAll) {
                    if (err) throw err;

                    console.log('tagAll = '+tagAll.length);
                    if(tagAll.length >0){
                        var arrayTag = [];

                        tagAll.forEach(element => {
                            arrayTag.push( element.tag);
                        });
        
                        connection.query("SELECT item_id FROM tags WHERE tag IN (?) GROUP BY item_id",[arrayTag], function getItemsByTag (err, itemIdLoad) {
                        if (err) throw err;
                            console.log('item have tag = '+itemIdLoad.length);
                            var arrayItemId = [];
        
                            itemIdLoad.forEach(element => {
                                if(element.item_id != getId)
                                arrayItemId.push( element.item_id);
                            });
                            if(arrayItemId.length >0){
                                connection.query("SELECT * FROM items WHERE item_id IN (?)",[arrayItemId], function getItemsUsedTag (err, results) {
                                    if (err) throw err;
                                    
                                    connection.end();
                                    res.render('showitem', {page:'Item', menuId:'item',itemShow:itemIsShow,imagesShow:imagesIsShow,tags:tagAll,items:results});
                                });
                            }else{
                                res.render('showitem', {page:'Item', menuId:'item',itemShow:itemIsShow,imagesShow:imagesIsShow,tags:tagAll,items:0});
                            }
                        });
                    }else{
                        connection.end();
                        res.render('showitem', {page:'Item', menuId:'item',itemShow:itemIsShow,imagesShow:imagesIsShow,tags:tagAll,items:0});
                    }
                    
                });
            });
        });
        
    });
}