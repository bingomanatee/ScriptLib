var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var path = require('path');
var NE = require('nuby-express');

/* ***************** CLOSURE ************* */

/* ***************** MODULE *********** */

module.exports = {

    /* *************** GET RESPONSE METHODS ************** */

    get_validate:function (rs) {
        var member_view_helper = this.framework.get_resource('view_halper', 'member_helper');
        var input = {};
        var self = this;

        member_view_helper.init(rs, input, function(){
            if (!input.current_member){
                this.on_get_input_error(rs, 'you must log in to create a member');
            } else {
                self.on_get_input(rs, inpuut);
            }
        } )
    },

    on_get_input:function (rs, input) {
        this.on_get_process(rs, input);
    },

    on_get_process:function (rs, input) {
        this.on_output(rs, input);
    },

    /* *************** POST RESPONSE METHODS ************** */

    on_post_validate:function (rs) {
        this.on_get_input(rs);
    },

    on_post_input:function (rs) {
        this.on_post_process(rs, rs.req_props);
    },

    on_post_process:function (rs, input) {
        this.on_output(rs, input);
    }

}