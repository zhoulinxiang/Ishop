var mongoose = require('mongoose');
var Scheme = mongoose.Schema;
shortid=require("shortid");

//广告数据模型
var adScheme=new Scheme({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    name:String,
    path:String,
    img:String
});
var ad=mongoose.model("ad",adScheme);

ad.business={
    insert: function ( req, res ) {
        var Db = require('./db/Db');
        //console.log("insert");
        console.log(req.body);
        ad.findOne( { name: req.body.name }, function ( err, adFind ) {
            if ( adFind ) {
                res.end( adFind.name + ' was already existed.' );
            } else {
                Db.addOne( ad, req, res );
            }
        });
    },
    delete: function ( id, req, res, target ) {
        var Db = require('./db/Db');
        Db.delete(id,ad,req,res);
    },
    update: function ( id, req, res ) {
        var Db = require('./db/Db');
        ad.findOne( { _id: id}, function ( err, adFind ) {
            if ( err ) {
                console.log(err);
                res.end('error');
            } else {
                Db.updateOneById( id, ad, req, res );
            }
        });
    },
    find: function ( req, res ) {
        ad.find()
            .exec(function (err, data) {
                if (err) {
                    console.log(err);
                    res.end('error');
                    return;
                }
                res.json(data);
            });
    },
};


module.exports=ad;