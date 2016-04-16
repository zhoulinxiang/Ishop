var express = require('express'),
    router = express.Router(),
    settings = require('../models/db/settings'),
    User = require('../models/User'),
    Auth = require('../utils/Auth');

// 用户登录权限验证
router.get( "/", function ( req, res, next ) {
    if ( req.session.user ) {
        req.session.logined = true;
        return next();
    }
    var user_id =  req.cookies.user_id;

    User.findOne( { '_id': user_id }, function ( err, user ) {
        if ( user ) {
            req.session.user = user;
            req.session.logined = true;
            next();
        } else {
            console.error(err);
        }
    });
    next();
});
// 个人管理验证
router.get( /^\/user\/manage(\/\w+)?$/, function ( req, res, next ) {
    if ( Auth.isLogin(req) ) {
        next();
    } else {
        res.redirect('/user/login');
    }
});
// 管理员权限验证
router.get( /^\/admin\/manage(\/\w+)?$/, function ( req, res, next ) {
    if ( req.session.adminlogined ) {
        next();
    } else {
        res.redirect('/admin/login');
    }
});

module.exports = router;
