var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var path = require('path');
var NE = require('nuby-express');

/* ***************** CLOSURE ************* */
// https://graph.facebook.com/me/albums?access_token=
/* ***************** MODULE *********** */

module.exports = {

    /* *************** RESPONSE METHODS ************** */

    validate:function (rs) {
        var init = {};
        var self = this;
        this.view_helper('member_helper').init(rs, init, function(){
           if (!init.fb.session){
               self.on_validate_error(rs, 'member is not signed into facebook');
           } else if (!init.fb.session.oauth_code){
               self.on_validate_error(rs, 'cannot find auth token')
           } else {
               self.on_input(rs);
               // everything past this happens on the client side
           }
        })
    },

    _on_get_validate_error: '/'

}