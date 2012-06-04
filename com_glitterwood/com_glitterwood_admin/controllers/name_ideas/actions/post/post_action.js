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
        if (!rs.req_props.name_ideas) {
            return this.on_input_error(rs, 'No Context');
        } else if (!rs.req_props.name_ideas.names) {
            return this.on_input_error(rs, 'No Names Passed');
        }
        this.on_input(rs);
    },

    _on_input_error_go:'/admin/gw/name_ideas/list',

    on_input:function (rs) {
        var names = rs.req_props.name_ideas.names;
        var name_arrays = names.split(/[\n\r]+/);
        rs.req_props.name_ideas.names = _.map(name_arrays, function (n) {
            n = n.replace(/^[ \s]+/, '');
            n = n.replace(/[ \s]+$/, '');
            return n;
        });
        this.on_process(rs, rs.req_props.name_ideas);
    },

    on_process:function (rs, input) {
        var add = [];

        input.names.forEach(function (n) {
            add.push({
                name:n,
                gender:input.gender
            })
        });

        var self = this;

        this.models.gw_name_ideas.model.collection.insert(add, function (err, result) {
            if (err) {
                return self.on_process_error(err);
            }
            console.log('insert result: %s', util.inspect(result));
            rs.go('/admin/gw/name_ideas/list')
        });
    },

    _on_process_error_go:'/admin/gw/name_ideas/list'

}