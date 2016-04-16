var mongoose = require('mongoose');
var Scheme = mongoose.Schema;
var shortid=require("shortid");

var productScheme=new Scheme({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    name:String,
    price:Number,
    amount:Number,
    category:String,
    img:[String],
    describe:String
});

var product=mongoose.model("product",productScheme);
product.business={
    insert: function ( req, res ) {
        var Db = require('./db/Db');
        //console.log("insert");
        console.log(req.body);
        product.findOne( { name: req.body.name }, function ( err, productFind ) {
            if ( productFind ) {
                res.end( productFind.name + ' was already existed.' );
            } else {
                Db.addOne( product, req, res );
            }
        });
    },
    delete: function ( id, req, res, target ) {
        var Db = require('./db/Db');
        Db.delete(id,product,req,res);
    },
    update: function ( id, req, res ) {
        var Db = require('./db/Db');
        product.findOne( { _id: id}, function ( err, productFind ) {
            if ( err ) {
                console.log(err);
                res.end('error');
            } else {
                Db.updateOneById( id, product, req, res );
            }
        });
    },
    findOne: function (id, req, res) {
        var Db = require('./db/Db');
        product.findOne({ _id: id }, function (err, product) {
            if (err) {
                console.log(err || 'error');
                res.end('error');
            } else {
                return res.json(product);
            }
        });
    },
    find: function (id, req, res) {
        var Db = require('./db/Db');
        product.find({}, function (err, product) {
            if (err) {
                console.log(err || 'error');
                res.end('error');
            } else {
                return res.json(product);
            }
        });
    },
    findByCategory:function(cate,req,res){
        var Db = require('./db/Db');
        product.find({category:cate}, function (err, productFind) {
            if (err) {
                console.log(err || 'error');
                res.end('error');
            } else {
                var result={};
                result.category=cate;
                result.products=productFind;
                return res.json(result);
            }
        });
    },
    findByCategoryLimitFour:function(cate,req,res){
        var Db = require('./db/Db');
        product.find({category:cate}).limit(4).exec(function (err, productFind) {
            if (err) {
                console.log(err || 'error');
                res.end('error');
            } else {
                var result={};
                result.category=cate;
                result.products=productFind;
                return res.json(result);
            }
        });
    }

};
//var productTest=new product({
//    name:"shouji",
//    price:11.11,
//    amount:100,
//    category:"dianzi",
//    img:["path1","path2"],
//    describle:"很棒的手机"
//});
//productTest.save();
module.exports=product;
