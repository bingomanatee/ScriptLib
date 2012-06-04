var _ = require('underscore');
var util = require('util');
var columns = ['_id',  'name', 'looks', 'charm', 'talent', 'smarts', 'stamina'];
var Datatable_JSON = require('app_support/Datatable_JSON');

module.exports = {

    on_process:function (rs) {
        var data = rs.req_props;
        var dtj = new Datatable_JSON(data, columns);
        var query_f = _.bind(dtj.query, dtj);
        dtj.query = function () {
            var out = query_f();
            out.deleted = {"$ne":true};
            return out;
        }
        var self = this;
        self.models.gw_trait_templates.count({deleted:{"$ne":true}}, function (err, count) {
            dtj.stream(self.models.gw_trait_templates, rs.res, count);
        });
    }

}