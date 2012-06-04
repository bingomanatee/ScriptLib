var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var path = require('path');
var NE = require('nuby-express');

/* ***************** CLOSURE ************* */

/* ***************** MODULE *********** */

module.exports = {

    /* *************** RESPONSE METHODS ************** */

    validate:function (rs) {
        this.on_input(rs);
    },

    on_input:function (rs) {
        var self = this;
        this.models.gw_trait_templates.model.active(function(err, tt){
            self.on_process(rs, tt);
        })
    },

    on_process:function (rs, input) {
        this.on_output(rs, input);
    }

}