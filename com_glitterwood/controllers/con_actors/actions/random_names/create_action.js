var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var path = require('path');
var NE = require('nuby-express');

/* ***************** CLOSURE ************* */

/* ***************** MODULE *********** */

module.exports = {

    /* *************** RESPONSE METHODS ************** */

    on_input:function (rs) {
        var female_first_names = [];
        var male_first_names = [];
        var last_names = [];

        var self = this;

        this.models.gw_name_ideas.find({complete:{'$ne':true}},

            function (err, list) {
                list.forEach(function (item) {
                    switch (item.gender) {
                        case 'female':
                            female_first_names.push(item.name);
                            break;

                        case 'male':
                            male_first_names.push(item.name);
                            break;

                        case 'last':
                            last_names.push(item.name);
                            break;

                        case 'either':
                            female_first_names.push(item.name);
                            male_first_names.push(item.name);
                            break;

                    }
                })

                self.on_process(rs, {f:female_first_names, m:male_first_names, l:last_names, n: rs.req_props.count ? rs.req_props.count : 10})
            }
        )
    },

    on_process:function (rs, input) {

        var f = input.f;
        f = _rand(f);
        f = _rand(f);
        f = _rand(f);
        f = _rand(f);
        f = _rand(f);

        var m = input.m;
        m = _rand(m);
        m = _rand(m);
        m = _rand(m);
        m = _rand(m);
        m = _rand(m);

        var l = input.l;
        l = _rand(l);
        l = _rand(l);
        l = _rand(l);
        l = _rand(l);
        l = _rand(l);

        var women = f.slice(0, input.n);

        var men = m.slice(0, input.n);

        var mout = _.map(men, function(m){
            return m + ' ' + l.pop();
        });
        var fout = _.map(women, function(w){
           return w + ' ' + l.pop();
        });

        rs.send({female_names: fout, male_names: mout});
    },

    _on_process_error_go:'/admin/gw/name_ideas/list'

}

function _rand(a){
    var out = [];

    while(a.length){

        if (Math.random() > 0.5){
            var n = a.pop();
        } else {
            var n = a.shift();
        }

        if (Math.random() > 0.5){
            out.push(n);
        } else {
            out.unshift(n);
        }

    }

    return out;
}