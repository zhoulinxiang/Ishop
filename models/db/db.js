var mongoose = require('mongoose'),
    url = require('url'),
    util=require("util");

var db=mongoose.connect('mongodb://localhost/ishop');

var Db = {

    delete: function ( id, obj, req, res, logMsg) {
        obj.remove({ _id: id }, function (err, result) {
            if (err) {
                res.end(err);
            } else {
                if (logMsg) {
                    console.log(logMsg + ' success!');
                }
                res.end('success');
            }
        });
    },


    findOne: function ( id, obj, req, res, logMsg) {
        obj.findOne({ _id: id }, function (err, result) {
            if (err) {
                res.next(err);
            } else {
                if (logMsg) {
                    console.log(logMsg + ' success!');
                }
                return res.json(result);
            }
        });
    },

    updateOneById: function (id, obj, req, res, logMsg) {
        console.log(req.body);
        var update = { $set: req.body };
        obj.update({ _id: id }, update, function (err) {
            if (err) {
                res.end(err);
            } else {
                if (logMsg) {
                    console.log(logMsg + ' success!');
                }
                res.end('success');
            }
        });
    },

    addOne: function (obj, req, res, logMsg) {
        //console.log(req.body);
        var newObj = new obj(req.body);
        newObj.save(function (err) {
            if (err) {
                res.end(err);
            } else {
                if (logMsg) {
                    console.log(logMsg + ' success!');
                }
                res.end('success');
            }
        });
    },
    //分页
    pagination: function (obj, req, res, conditions, sort) {
        var params = url.parse(req.url, true),
            currentPage = Number(params.query.currentPage) || 1,
            limit = Number(params.query.limit) || 10,
            startNum = (currentPage - 1) * limit + 1,
            pageInfo = null;

        var query = null;
        //console.log(conditions);
        if (conditions && conditions.length > 1 ) {
            console.log("1");
            query = obj.find().or(conditions);
        } else if (conditions) {
            console.log("2");
            console.log("conditions:");
            console.log(conditions);
            query = obj.find(conditions[0]);
        } else {
            console.log("3");
            query = obj.find({});
        }
        //console.log("query:"+util.inspect(query));
        if (sort) {
            query.sort(sort);
        } else {
            query.sort({ "created": -1 });
        }
        query.exec(function (err, docs) {
            if (err) {
                console.error(err);
            } else {
                console.log("docs:");
                console.log(docs);
                pageInfo = {
                    "totalItems": docs.length,
                    "currentPage": currentPage,
                    "limit": limit,
                    "startNum": Number(startNum)
                };
                return res.json({
                    docs: docs.slice(startNum - 1, startNum + limit - 1),
                    pageInfo: pageInfo
                });
            }
        });
    },
    encrypt: function (data, key) {
        var cipher = crypto.createCipher("bf", key);
        var newPwd = '';
        newPwd += cipher.update(data, "utf8", "hex");
        newPwd += cipher.final("hex");

        return newPwd;
    },

    decrypt: function (data, key) {
        var decipher = crypto.createDecipher("bf", key);
        var oldPwd = '';
        oldPwd += decipher.update(data, "hex", "utf8");
        oldPwd += decipher.final("utf8");

        return oldPwd;
    }

};

module.exports = Db;
