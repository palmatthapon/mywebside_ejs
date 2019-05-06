const express = require('express')
const router = express.Router()
module.exports = router

router.get('/', function(req, res, next) {
    console.log('post method');
    res.render("success",{page:'Success', menuId:'success'});
});