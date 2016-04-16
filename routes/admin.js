var express = require('express');
var url = require('url');
var router = express.Router();
var util = require('util');
var multer=require("multer");
var upload = multer({ dest: 'public/images' })


// 站点配置
var settings = require('../models/db/settings');
// 数据库操作对象
var Db = require('../models/db/Db');
// 管理员对象
var AdminUser = require('../models/AdminUser');
//// 用户对象
var User = require('../models/User');
//// 分类对象
var Category = require('../models/Category');
//// 广告对象
var Ad = require('../models/Ad');
//// 商品对象
var Product = require('../models/Product');

// 管理员工具
var AdminUtils = require('../utils/AdminUtils');


/* Login / Logout */
router.get( '/login', function ( req, res, next ) {
  res.render('manage/adminLogin',AdminUtils.getSiteInfo());
});

router.get( '/logout', function ( req, res, next ) {
  var username = req.session.adminUserInfo.username;

  req.session.adminlogined = false;
  req.session.adminUserInfo = null;

  // loged
  //AdminUtils.saveSystemLog( 'logout', username + " logout." );

  res.redirect('/admin/login');
});


router.post( '/login', function ( req, res, next ) {
  var username = req.body.username,
      password = req.body.password;
      //encryptedPwd = Db.encrypt(password, settings.encrypt_key);
  //console.log(username+"||"+password);
  AdminUser.findOne( { name: username, password: password }, function ( err, user ) {
    if ( user ) {
      req.session.adminlogined = true;
      req.session.adminUserInfo = user;

      // loged
      //AdminUtils.saveSystemLog( 'login', user.username + " logined from " + AdminUtils.getClientIp(req) );
      res.end('success');
    } else {
      console.log("Login failed.");
      res.end("error");
    }
  });
});

/* 后台主页 */
router.get( '/', function ( req, res, next ) {
  res.render('manage/main', AdminUtils.getPageInfo( req, res, settings.SYSTEM_MANAGE ) );
});

/* System Management */
router.get( '/manage/user', function ( req, res, next ) {
  res.render('manage/user', AdminUtils.getPageInfo( req, res, settings.USER_MANEGE, '/admin/manage/user' ));
});
router.get( '/manage/category', function ( req, res, next ) {
  res.render('manage/category', AdminUtils.getPageInfo( req, res, settings.CATEGORY_MANAGE, '/admin/manage/category' ));
});

router.get( '/manage/product', function ( req, res, next ) {
  res.render('manage/product', AdminUtils.getPageInfo( req, res, settings.PRODUCT_MANAGE, '/admin/manage/product' ));
});

router.get( '/manage/ad', function ( req, res, next ) {
  res.render('manage/ad', AdminUtils.getPageInfo( req, res, settings.AD_MANAGE, '/admin/manage/ad' ));
});

router.get( '/manage/order', function ( req, res, next ) {
  res.render('manage/order', AdminUtils.getPageInfo( req, res, settings.ORDER_MANAGE, '/admin/manage/order' ));
});


//商品图片上传
router.post("/manage/product",upload.array('photos', 3), function (req, res, next) {
  //console.log("upload");
  //console.log(util.inspect(req.files));
  //console.log(req.body);
  req.body.img=[];
  for(var i=0;i<req.files.length;i++){
    req.body.img.push("images/"+req.files[i].filename);
  }
  console.log("/manage/product");
  console.log(req.body);
  if(req.body.targetId){
    //console.log("targetId:"+req.body.targetId);
    Product.business.update(req.body.targetId,req,res);
  }else{
    Product.business.insert(req,res);
  }
  res.redirect('/admin/manage/product');
});
//广告信息上传
router.post("/manage/ad",upload.single('photo'), function (req, res, next) {
  //console.log("upload");
  //console.log(util.inspect(req.files));
  //console.log(req.body);
  req.body.img="images/"+req.file.filename;
  console.log(req.body);
  if(req.body.targetId){
    //console.log("targetId:"+req.body.targetId);
    Ad.business.update(req.body.targetId,req,res);
  }else{
    Ad.business.insert(req,res);
  }
  res.redirect('/admin/manage/ad');
})
/******************************************************************************/

/* api */
// 获取对象信息
router.get( '/api/v1/:object_type/:_id?', function ( req, res, next ) {
  var object_type = req.params.object_type,
      _id = req.params._id,
      target = AdminUtils.getTarget( object_type, req );

  if ( target ) {
    if ( _id ) {
      Db.findOne( _id, target.obj, req, res, 'find ' + _id );
    } else if ( target.obj.business.query ) {
      target.obj.business.query( req, res );
    } else {
      //console.log("target:"+util.inspect(target));
      Db.pagination( target.obj, req, res, target.key );
    }
  } else {
    return next();
  }
});
// 添加对象信息
router.put( '/api/v1/:object_type', function ( req, res, next ) {
  var params = url.parse( req.url, true ),
      object_type = req.params.object_type,
      target = AdminUtils.getTarget( object_type);

  if ( target ) {
    //console.log("target");
    target.obj.business.insert( req, res );
  } else {
    return next();
  }
});
// 修改对象信息
router.post( '/api/v1/:object_type/:_id?', function ( req, res, next ) {
  var params = url.parse( req.url, true ),
      object_type = req.params.object_type,
      _id = req.params._id,
      target = AdminUtils.getTarget( object_type );
  //console.log("object_type:"+object_type);
  //console.log("target"+util.inspect(target));

  if ( target ) {
    //console.log(" busniness:"+util.inspect(target.obj.business));
    target.obj.business.update( _id, req, res );
  } else {
    return next();
  }
});

// 删除对象信息
router.delete( '/api/v1/:object_type/:_id?', function ( req, res, next ) {
  var params = url.parse( req.url, true ),
      object_type = req.params.object_type,
      _id = req.params._id,
      target = AdminUtils.getTarget( object_type );

  if ( target ) {
    target.obj.business.delete( _id, req, res, target );
  } else {
    return next();
  }
});


module.exports = router;
