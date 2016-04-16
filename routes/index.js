var express = require('express');
var router = express.Router(),
    url = require('url'),
    SiteUtils = require('../utils/SiteUtils');


var Product = require('../models/Product'),
    User = require('../models/User'),
    Category = require('../models/Category')
    Ad = require('../models/Ad');
/* GET home page. */
router.get('/', function (req, res, next) {
  console.log("index");
  res.render('front/index', SiteUtils.getData4Index(req, res, 'Main Page'));
});
router.get('/category/:category', function (req, res, next) {
    var category=req.params.category;
    console.log("category params:");
    console.log(category);
    res.render('front/category', SiteUtils.getData4Catory(req, res, 'Main Page',category));

});
router.get('/product/:productId', function (req, res, next) {
    var productId=req.params.productId;
    console.log("productId params:");
    console.log(productId);
    res.render('front/product', SiteUtils.getData4Product(req, res, productId,'Main Page'));

});
module.exports = router;
