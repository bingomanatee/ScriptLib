var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var path = require('path');
var NE = require('nuby-express');

/* ***************** CLOSURE ************* */

/* ***************** MODULE *********** */

module.exports = {

    /* *************** RESPONSE METHODS ************** */

    on_process:function (rs, input) {
        if (!input) {
            input = {};
        }
        input.layout_name = 'empty'
        input.domain = rs.req.header('host');
        this.on_output(rs, input);
    }

}