/*
 * 身份验证对象
 *
 */


var Auth = {

    isLogin: function ( req ) {
        return req.session.logined;
    },
    isAdminLogin: function ( req ) {
        return req.session.adminlogined;
    }

};

module.exports = Auth;
