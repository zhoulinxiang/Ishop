var express = require('express'),
    router = express.Router(),
    url = require('url');

// DB
var Db = require('../models/db/Db');
// settings
var settings = require('../models/db/settings');
// Model
var Product = require('../models/Product'),
    User = require('../models/User'),
    Category = require('../models/Category'),
    Order = require('../models/Order'),
    Ad = require('../models/Ad'),
    Comment = require('../models/Comment');
// 工具类
var	SiteUtils = require('../utils/SiteUtils'),
    Auth = require('../utils/Auth');


/* User Api */
/*
 * GET User
 */
router.get('/v1/user/:user_id', function (req, res, next) {
    var user_id = req.params.user_id,
        filter = '';
    if (user_id !== req.session.user._id) {
        filter = 'name';
    }
    User.findOne({ _id: user_id }, filter, function (err, user) {
        if (user) {
            res.json(user);
            return;
        }
        console.log('get ' + user_id + ' error!');
    });
});

/*
 * POST User
 * @pre-condition: must be logined
 */
router.post('/v1/user', function (req, res, next) {
    if (Auth.isLogin(req)) {
        User.business.updateByUser(req, res);
    } else {
        res.end('Permission Denied.');
    }
});

/* User Cart */
/*
 * POST User's Cart
 * @pre-condition: must be logined
 * @body: (product)_id, quantity
 */
router.post('/v1/user/cart', function (req, res, next) {
    if (Auth.isLogin(req)) {
        User.business.changeCart(req, res);
    } else {
        res.end('Permission Denied.');
    }
});

/*
 * DELETE User's Cart
 * @pre-condition: must be logined
 * @param: product_id
 */
router.delete('/v1/user/cart/:product_id', function (req, res, next) {
    var product_id = req.params.product_id;
    if (Auth.isLogin(req)) {
        User.business.deleteCart(product_id, req, res);
    } else {
        res.end('Permission Denied.');
    }
});

/* User Address */
/*
 * PUT User's Address
 * @pre-condition: must be logined
 * @body: name, postcode, address, phoneNum, isDefault
 */
router.put('/v1/user/address', function (req, res, next) {
    if (Auth.isLogin(req)) {
        User.business.insertAddr(req, res);
    } else {
        res.end('Permission Denied.');
    }
});

/*
 * POST User's Address
 * @pre-condition: must be logined
 * @param: addr_id
 * @body: name, postcode, address, phoneNum, isDefault
 */
router.post('/v1/user/address/:addr_id', function (req, res, next) {
    if (Auth.isLogin(req)) {
        var addr_id = req.params.addr_id;
        User.business.updateAddr(addr_id, req, res);
    } else {
        res.end('Permission Denied.');
    }
});

/*
 * DELETE User's Address
 * @pre-condition: must be logined
 * @param: addr_id
 */
router.delete('/v1/user/address/:addr_id', function (req, res, next) {
    if (Auth.isLogin(req)) {
        var addr_id = req.params.addr_id;
        User.business.deleteAddr(addr_id, req, res);
    } else {
        res.end('Permission Denied.');
    }
});


/* Product Api */
/*
 * GET Product
 * @param: product_id
 */
router.get('/v1/product/:product_id?', function (req, res, next) {
    var product_id = req.params.product_id;
    if (product_id) {
        Product.business.findOne(product_id, req, res);
    } else {
        Product.business.find(req, res);
    }
});
router.get('/v1/productbycategory/:category?', function (req, res, next) {
    var category = req.params.category;
    Product.business.findByCategory(category,req, res);
});
router.get('/v1/productbycategorylimitfour/:category?', function (req, res, next) {
    var category = req.params.category;
    Product.business.findByCategoryLimitFour(category,req, res);
});



/* Order Api */
/*
 * GET Order
 * @param: order_id?
 */
router.get('/v1/order/confirm', function (req, res, next) {
        Order.business.findConfirmOne(req, res);
});

router.get('/v1/order/:order_id?', function (req, res, next) {
    console.log("api v1 order");
    //console.log("user session");
    //console.log(req.session);

    var order_id = req.params.order_id;
    if(order_id){

    }else{
        Order.business.findByUser(req,res);

    }
});

/*
 * PUT Order
 * @pre-condition: must be logined
 * @body: address(), products()
 */
router.put('/v1/order', function (req, res, next) {
    if (Auth.isLogin(req)) {
        Order.business.insert(req, res);
    } else {
        res.end('Permission Denied.');
    }
});

/*
 * POST Order
 * @pre-condition: must be shop_owner logined
 * @body:
 */
router.post('/v1/order/:order_id/:operate', function (req, res, next) {
    var order_id = req.params.order_id,
        operate = req.params.operate;
    if (Auth.isLogin(req)||Auth.isAdminLogin(req)) {
        Order.business.update(order_id, operate, req, res);
    } else {
        res.end('Permission Denied.');
    }
});

/*
 * DELETE Order
 * @pre-condition: must be logined
 * @customer: cancel order
 * @shop_owner: cancel order
 */
router.delete('/v1/order/:order_id', function (req, res, next) {
    var order_id = req.params.order_id;
    if (Auth.isLogin(req)) {
        Order.business.delete(order_id, req, res);
    } else {
        res.end('Permission Denied.');
    }
});


/* Ad Api */
/*
 * GET ads
 * @param: ad_id
 */
router.get('/v1/ad/:ad_id?', function (req, res, next) {
    var ad_id = req.params.ad_id;

    if (ad_id) {
        Ad.business.findOne(ad_id, req, res);
    } else {
        Ad.business.query(req, res);
    }
});

router.get('/v1/index/ad', function (req, res, next) {
    Ad.business.find(req, res);
});


/* Comment Api */
/*
 * GET Comment
 *
 */
router.get('/v1/comment/:comment_id?', function (req, res, next) {
    var comment_id = req.params.comment_id;
    if (comment_id) {
        Comment.business.findOne(comment_id, req, res);
    } else {
        Comment.business.find(req, res);
    }
});

/*
 * PUT Comment
 *
 */
router.put('/v1/comment', function (req, res, next) {
    if (Auth.isLogin(req)) {
        Comment.business.insert(req, res);
    } else {
        res.end('Permission Denied');
    }
});

/*
 * POST Comment
 *
 */
router.post('/v1/comment/:comment_id', function (req, res, next) {
    var comment_id = req.params.comment_id;
    if (Auth.isLogin(req)) {
        Comment.business.update(comment_id, req, res);
    } else {
        res.end('Permission Denied');
    }
});

/*
 * DELETE Comment
 *
 */
router.delete('/v1/comment/:comment_id', function (req, res, next) {
    var comment_id = req.params.comment_id;
    if (Auth.isLogin(req)) {
        Comment.business.delete(comment_id, req, res);
    } else {
        res.end('Permission Denied');
    }
});


module.exports = router;
