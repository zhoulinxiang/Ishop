/*
 * 站点工具对象
 *
 *
 */

var settings = require('../models/db/settings'),
    User = require('../models/User'),
    Order = require('../models/Order'),
    Product = require('../models/Product'),
    Category = require('../models/Category'),
    Ad = require('../models/Ad'),
    util=require("util");


var SiteUtils = {

    // 设置cookie
    gen_session: function ( user, res ) {
        var auth_token = user._id + '$$$$';
        res.cookie(settings.auth_cookie_name, auth_token,
            { path: '/', maxAge: 1000 * 60 * 60 * 24, signed: true, httpOnly: true }); // cookie有效期 1 天
    },

    getSiteInfo: function ( ) {
        return {
            title: settings.SITE_TITLE,
            description: settings.SITE_DESCRIPTION,
            keywords: settings.SITE_KEYWORDS
        };
    },

    getData4Index: function ( req, res, title ) {
        //console.log("getCatefory:");
        //console.log(SiteUtils.getCategory());
        return {
            siteConfig: SiteUtils.getSiteInfo( ),
            AD_LIMIT: settings.AD_LIMIT,
            userInfo: req.session.user,
            logined: req.session.logined,
            layout: 'front/public/defaultTpl'
        };
    },
    getData4Catory: function ( req, res, title ,category) {
        //console.log("getCatefory:");
        //console.log(SiteUtils.getCategory());
        return {
            categoryPage:category,
            siteConfig: SiteUtils.getSiteInfo( ),
            AD_LIMIT: settings.AD_LIMIT,
            userInfo: req.session.user,
            logined: req.session.logined,
            layout: 'front/public/defaultTpl'
        };
    },
    getData4Product: function ( req, res, id, title ) {
        return {
            siteConfig: SiteUtils.getSiteInfo(),
            productId: id,
            userInfo: req.session.user,
            logined: req.session.logined,
            title: title,
            layout: 'front/public/defaultTpl'
        };
    },



    getData4Customer: function ( req, res, title ) {
        return {
            siteConfig: SiteUtils.getSiteInfo( ),
            title: title,
            userInfo: req.session.user,
            logined: req.session.logined,
            home: '/user/manage/',
            layout: 'front/public/defaultTpl'
        };
    },
    incStorage: function (id, value, callback) {
        var val = value || 1;
        Product.update({ _id: id }, { $inc: { amount: val} }, function (err) {
            if (err) {
                console.log(err);
                callback && callback(err);
            } else {
                callback && callback();
            }
        });
    }

}

module.exports = SiteUtils;
