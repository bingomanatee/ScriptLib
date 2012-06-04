var _ = require('underscore');
var util = require('util');
var columns = ['_id',  'name', 'gender'];
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
        self.models.gw_name_ideas.model.active_count( function (err, count) {
            dtj.stream(self.models.gw_name_ideas, rs.res, count);
        });
    }

}