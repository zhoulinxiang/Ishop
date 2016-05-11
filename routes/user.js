var express = require('express'),
    url = require('url'),
    crypto = require('crypto'),
    router = express.Router();

// DB
var Db = require('../models/db/Db');
// settings
var settings = require('../models/db/settings');
var Product = require('../models/Product'),
    User = require('../models/User'),
    Category = require('../models/Category'),
    Order = require('../models/Order'),
    Ad = require('../models/Ad');
// 工具类
var	SiteUtils = require('../utils/SiteUtils'),
    Auth = require('../utils/Auth');

// login page
router.get( '/login', function ( req, res, next ) {
    if ( Auth.isLogin(req) ) {
        res.redirect('/');
    } else {
        res.render( 'front/login_register', SiteUtils.getSiteInfo( 'Sign In' ) );
    }
});

router.get( '/manage', function ( req, res, next ) {
    res.render( 'front/user/main', SiteUtils.getData4Customer( req, res, 'User Home' ) );
});

router.get('/manage/profile', function ( req, res, next ) {
    res.render('front/user/profile', SiteUtils.getData4Customer(req, res, 'My Profile'));
});

router.get('/manage/cart', function ( req, res, next ) {
    res.render('front/user/cart', SiteUtils.getData4Customer(req, res, 'My Cart'));
});

router.get('/manage/confirm_order', function ( req, res, next ) {
    res.render('front/user/confirm_order', SiteUtils.getData4Customer(req, res, 'Confirm Order'));
});

router.get('/manage/order', function ( req, res, next ) {
    res.render('front/user/order', SiteUtils.getData4Customer(req, res, 'Order Management'));
});

router.get('/manage/comment', function ( req, res, next ) {
    //res.render('front/test');
    res.end("not development");
    //res.render('front/user/comment', SiteUtils.getData4Customer(req, res, 'Comment Management'));
});



// logout
router.get( '/logout', function ( req, res, next ) {
    req.session.logined = false;
    req.session.user = null;

    res.redirect('/');
});

// forget password
router.get( '/forget', function ( req, res, next ) {
    res.end( 'not development' );
});

// login
router.post( '/login', function ( req, res, next) {
    var username = req.body.name,
        password = req.body.password;
        //encryptedPwd = Db.encrypt(password, settings.encrypt_key);

    User.findOne( { name: username, password: password }, function ( err, user ) {
        if ( user ) {

            req.session.logined = true;
            req.session.user = user;

            res.end( 'success' );
        } else {
            console.log( username + 'Login failed.' );
            res.end( 'Username or password is wrong.' );
        }
    });
});

// Register new user
router.put( '/', function ( req, res, next ) {
    User.business.insert( req, res );
});


module.exports = router;
