var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var path = require('path');
var NE = require('nuby-express');

/* ***************** CLOSURE ************* */

/* ***************** MODULE *********** */

module.exports = {

    /* *************** GET RESPONSE METHODS ************** */

    on_get_validate:function (rs) {
        if (!rs.req_props.id){
            return this.on_get_validate_error(rs, 'No ID found', true);
        }
        this.on_get_input(rs);
    },

    on_get_input:function (rs) {
        var self = this;
        this.models.gw_trait_templates.get(rs.req_props.id, function(err, tt){
            if (err){
                return this.on_get_input_error(rs, err, true);
            } else {
                self.on_get_process(rs, tt);
            }
        })
    },

    on_get_process:function (rs, input) {
        this.on_output(rs, input);
    },

    /* *************** POST RESPONSE METHODS ************** */

    on_post_validate:function (rs) {
        if (!rs.req_props.trait_template){
            return rs.send({error: 'no trait_template'});
        } else if (!rs.req_props.trait_template.name){
           return rs.send({error: 'template must have name'});
        }
        this.on_post_input(rs);
    },

    on_post_input:function (rs) {
        this.on_post_process(rs, rs.req_props.trait_template);
    },

    on_post_process:function (rs, template) {
        this.models.gw_trait_templates.put(template, function(err, new_template){
            if (err){
                rs.send(err);
            } else {
                console.log('saved trait template: %s', util.inspect(new_template.toJSON()));
                rs.send(new_template.toJSON());
            }
        })
    }

}