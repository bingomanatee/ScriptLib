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
        if (!rs.req_props.id) {
            this.on_get_validate_error(rs, 'No ID in rs');
        } else {
            this.on_get_input(rs);
        }
    },

    _on_get_validate_error_go:'/admin/gw/trait_templates/list',

    on_get_input:function (rs) {
        var self = this;

        this.models.gw_trait_templates.get(rs.req_props.id, function (err, trait_template) {
            if (err) {
                self.on_get_input_error(rs, 'cannot get trait_template: ' + err.toString());
            } else {
                self.on_get_process(rs, {trait_template:trait_template});
            }
        });
    },

    _on_get_input_error_go:'/admin/gw/trait_templates/list',

    on_get_process:function (rs, input) {
        this.on_output(rs, input);
    },

    /* **************** POST RESPONSE_METHODS ************ */


    on_post_validate:function (rs) {
        if (!rs.req_props.id) {
            this.on_post_validate_error(rs, 'Trait template ID missing');
        } else if (!rs.req_props.trait_template) {
            this.on_post_validate_error(rs, 'no trait_template data', '/admin/member_roles/list')
        } else {
            this.on_post_input(rs);
        }
    },

    _on_post_validate_error_go:'/admin/gw/trait_templates/list',

    on_post_input:function (rs) {
        rs.req_props.save_error = false;
        var self = this;
        this.models.gw_trait_templates.get(rs.req_props.id, function (err, trait_template) {

            if (err) {
                self.on_post_input_error(rs, 'cannot get trait_template ' + rs.req_props.id + ': ' + err.toString());
            } else {
                self.on_post_process(rs, trait_template);
            }

        })
    },

    _on_post_input_error_go:'/admin/gw/trait_templates/list',

    on_post_process:function (rs, trait_template) {
        var self = this;
        delete rs.req_props.trait_template._id;
        _.extend(trait_template, rs.req_props.trait_template);

        trait_template.save(function (err) {
            if (err) {
                rs.req_props.save_error = err;
                console.log(util.inspect(err, true, 4));
                self.on_post_process_error(rs, util.format('Cannot save trait_template: %s', util.inspect(err, true)));
            } else {
                self.on_post_output(rs, {trait_template:trait_template});
            }
        });

    },

    _on_post_process_error_go:'/admin/gw/trait_templates/list',

    on_post_output:function (rs, input) {
        rs.flash('info', 'Trait template saved');
        rs.go('/admin/gw/trait_templates/list');
    }

}
