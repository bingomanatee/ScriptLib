var NE = require('nuby-express');
var _ = require('underscore');
var util = require('util');
var fbc = require('facebook-client');
var _FB_DEBUG = false;
var microtime = require('microtime');

var iid = 0;
var _member_helper = new NE.helpers.View({
    name:'member_helper',

    weight:-1,

    init:function (rs, input, cb) {
        var instance_id = ++iid;
        var members_model = rs.action.models.members_members;
        input.fb_session = false;
        input.current_member = false;
        input.app_id = rs.framework.get_config('facebook.app_id');


        var facebook_refresh = parseInt(rs.framework.get_config('facebook.refresh', 60));
        if (rs.timer) rs.add_time('facebook refresh: ' + facebook_refresh, 'member_helper', instance_id);

        var facebook_client = new fbc.FacebookClient(
            rs.framework.get_config('facebook.app_id'),
            rs.framework.get_config('facebook.app_secret') // configure like your fb app page states
        );

        if (_FB_DEBUG) {
            console.log(' >> receiving session << ');
        }

        if (!input.helpers) {
            input.helpers = {};
        }

        var cans = [];
        input.helpers.can = function (task) {
            console.log('cans: %s', util.inspect(cans));
            var out = false;
            cans.forEach(function (c) {
                if (c == task) {
                    out = true;
                }
            });
            return out;
        }

        function _cb() {

            if (input.current_member && input.current_member.roles && input.current_member.roles.length) {
                if (rs.timer) rs.add_time('getting roles', 'member_helper', instance_id);
                rs.action.models.members_roles.find({name:{"$in":input.current_member.roles }},
                    function (err, roles) {
                        roles.forEach(function (role) {
                            role.tasks.forEach(function (task) {

                                task.verbs.forEach(function (verb) {
                                    cans.push(verb + ' ' + task.name);
                                })

                            })
                        });
                        if (rs.timer) rs.add_time('acquired roles', 'member_helper', instance_id);

                        cb();
                    })
            } else {
                cb();
            }

        }

        // console.log('headers: %s', util.inspect(rs.req.headers));
        if (rs.timer)  rs.add_time('getting client session', 'member_helper', instance_id);
        facebook_client.getSessionByRequestHeaders(rs.req.headers)(function (fb_session) {
            var now = microtime.nowDouble();
            var fb_last_valid = rs.session('fb_last_valid', 0);
            var age = (now - fb_last_valid);
            var trust_session = age < facebook_refresh;
            if (rs.timer)   rs.add_time('trust_session = ' + (trust_session ? 'true' : 'false'), 'member_helper', instance_id);

            if (rs.timer)  rs.add_time('acquired client session', 'member_helper', instance_id);

            if (_FB_DEBUG) console.log('>>> FACEBOOK <<< session = %s', util.inspect(fb_session));
            input.fb = {
                session:null,
                member:false
            }
            if (fb_session) {
                if (rs.timer)   rs.add_time('validating session', 'member_helper', instance_id);

                function _on_valid(is_valid) {
                    if (rs.timer)   rs.add_time('validated session', 'member_helper', instance_id);
                    if (is_valid) {
                        input.fb.session = fb_session;
                        if (rs.timer)   rs.add_time('getting meta', 'member_helper', instance_id);
                        var user_meta = false;
                        if (trust_session){
                            user_meta = rs.session('fb_user_meta', false);
                            if (rs.timer) {
                                rs.add_time('getting user_meta from session', 'member_helper', instance_id);
                            }
                        }

                        function _on_user_meta(user_meta) {
                            if (rs.timer)   rs.add_time('acquired meta', 'member_helper', instance_id);
                            if (user_meta && user_meta.id) {

                                members_model.from_fb(user_meta, function (err, fb_member) {
                                    input.fb.member = input.current_member = fb_member;
                                    _cb();
                                })
                            } else {
                                input.fb.member = input.current_member = false;
                                _cb();
                            }
                        }

                        if (user_meta){
                            if (rs.timer) rs.add_time('trusting session user data', 'member_helper', instance_id);
                            _on_user_meta(user_meta);
                        } else {
                            if (rs.timer) rs.add_time('getting user meta from facebook', 'member_helper', instance_id);
                            fb_session.getMeta()(function(user_meta){
                                rs.set_session('fb_user_meta', user_meta);
                                _on_user_meta(user_meta);
                            });
                        }

                    } else {
                        //           console.log('fb no valid');
                        cb(null, 'member gotten');
                    }
                }

                if (rs.timer){
                    var age_report = util.format('time now: %s, last checked: %s, age: %s, refresh = %s', now, fb_last_valid, age, facebook_refresh);
                    rs.add_time(age_report, 'member_helper', instance_id);
                }

                if (trust_session){
                    if (rs.timer)   rs.add_time('assuming session good', 'member_helper', instance_id);
                    _on_valid(true);
                } else {
                    if (rs.timer)   rs.add_time('NOT assuming session good', 'member_helper', instance_id);


                    if (rs.timer)   rs.add_time('re-validating fb', 'member_helper', instance_id);
                    fb_session.isValid()(function(is_valid){
                        _on_valid(is_valid);
                        if (is_valid){
                            rs.set_session('fb_last_valid', now);
                        } else {
                            rs.set_session('fb_last_valid', 0);
                        }
                    })
                }
            } else {
                var id = rs.session('member_id');

                if (id) {
                    var self = this;
                    //console.log('rs: %s', util.inspect(rs, null, 3));
                    members_model.get(id, function (err, member) {
                        if (member) {
                            input.current_member = member;
                            //      console.log('input: %s', util.inspect(input));
                        }
                        _cb(null, self.name);
                    });
                } else {
                    // console.log('input: %s', util.inspect(input));
                    _cb(null, this.name);
                }
            }


        });

    }

});

module.exports = function () {
    return _member_helper;
}