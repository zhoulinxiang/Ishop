var settings = require('../models/db/settings'),
    AdminUser = require('../models/AdminUser'),
    User = require('../models/User'),
    Order = require('../models/Order'),
    Product = require('../models/Product'),
    Category = require('../models/Category'),
    Ad = require('../models/Ad');
var url = require('url');

var AdminUtils = {

    getSiteInfo: function ( description ) {
        return {
            title: settings.SITE_TITLE,
            description: description
        };
    },
    getPageInfo: function ( req, res, module, currentLink ) {
        var searchKey = '';

        if ( req.url ) {
            var params = url.parse(req.url, true);
            searchKey = params.query.searchKey;
        }

        return {
            siteInfo: AdminUtils.getSiteInfo( module[1] ),
            bigCategory: module[0],
            searchKey: searchKey,
            currentLink: currentLink,
            layout: 'manage/public/adminTpl'
        };
    },
    getTarget: function ( type, req ) {
        var ret = {
            obj: null,
            key: [],
        };
        var keywords = '';
        if ( req ) {
            var query = url.parse( req.url, true ).query,
                keywords = query.searchKey || '';
        }
        var re = keywords && new RegExp( keywords, 'i' );

        switch ( type ) {
            case 'user':
                console.log("type is user");
                ret.obj = User;
                ret.key.push(
                        { 'name': { $regex: re } },
                        { 'phone': { $regex: re } }
                );
                break;
            case 'ad':
                ret.obj = Ad;
                ret.key.push( { 'name': { $regex: re } } );
                ret.key.push( { 'url': { $regex: re } } );
                break;
            case 'category':
                ret.obj = Category;
                break;
            case 'product':
                ret.obj = Product;
                break;
            case 'order':
                ret.obj = Order;
                break;

            default:
                return null;
        }

        return ret;
    }

}

module.exports = AdminUtils;