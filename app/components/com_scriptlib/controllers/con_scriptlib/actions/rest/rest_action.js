var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var path = require('path');
var NE = require('nuby-express');

/* ***************** CLOSURE ************* */
var scripts = [
    {id: 1, name: "Fists of Fury", genres: ["Asian", "Action"],
    summary: "A martial arts musical"},
    {id: 2, name: "Hearts of Desire", genres: ["Romance", "Western" ]}
]
/* ***************** MODULE *********** */

module.exports = {

    /* *************** RESPONSE METHODS ************** */

    validate:function (rs) {
        this.on_input(rs);
    },

    on_input:function (rs) {
        this.on_process(rs, rs.req_props);
    },

    on_process:function (rs, input) {
        this.on_output(rs, input);
    },

    on_output: function(rs, input){
        rs.send(scripts);
    }

}