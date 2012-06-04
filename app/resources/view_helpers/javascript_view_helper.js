var NE = require('nuby-express');
var _ = require('underscore');
var util = require('util');

var _js_view = new NE.helpers.View( {
    name: 'flash',

    init: function(rs, input, cb){
        input.javascript = _.uniq(_expand(rs.action.get_config('javascript', [], true)));
        input.head_javascript = _.uniq(rs.action.get_config('head_javascript', [], true));
        cb(null, this.name);
    }

});

module.exports = function () {
    return _js_view;
}

function _expand(scripts){
    var out = [];

    _.each(scripts, function(s){
        if (_.isString(s)){
            out.push(s);
        } else {
            _.each(s, function(list, key){
                out = out.concat(_.map(list, function(f){
                    return list + f;
                }))
            });
        }
    });
}