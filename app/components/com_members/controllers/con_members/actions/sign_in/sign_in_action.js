var util = require('util');


module.exports = {
    on_get:function (rs) {
        //@TODO: handle old input
        this.on_get_process(rs, {});
    },

    on_get_process:function (rs, input) {
        if (!input.member) {
            input.member = {username:'', password:''};
        }
        this.on_output(rs, input);
    },

    /* ****************** FORM SUBMISSION ****************** */

    on_post:function (rs) {
        this.on_post_validate(rs);
    },

    on_post_validate:function (rs) {
        var err = false;
        if (!rs.req_props.member) {
            this.on_get_process(rs, {});
        } else {
            if (!rs.req_props.member.password) {
                rs.flash('error', 'Password required');
                err = true;
            }
            if (!rs.req_props.member.username) {
                rs.flash('error', 'Username required');
                err = true;
            }
        }
        if (err) {
            rs.req_props.member.password = '';
            this.on_get_process(rs, rs.req_props);
        } else {
            this.on_post_process(rs, rs.req_props);
        }
    },

    on_post_process:function (rs, input) {
        var self = this;
        var signup_member = input.member;
        console.log(util.inspect(input));

        this.models.members_members.find({password:signup_member.password},
            function (err, members) {
                if (err) {
                    self.flash('error', err.toString());
                    self.on_get_process(rs, input);
                } else {
                    var found = false;
                    members.forEach(function (m) {
                        if (
                            (m.name == signup_member.username) ||
                                (m.username == signup_member.username) ||
                                (m.email == signup_member.username)
                            ) {
                            found = m;
                        }
                        // we will return the LAST match
                        //@TODO: track multiple matches.
                    });
                    if (found) {

                        rs.req.session.member_id = found._id.toString();
                        rs.flash('info', util.format('You are now logged in as %s (%s) ',
                            found.name, found.username));
                        if (found.roles && found.roles.length > 0) {
                            self.models.members_roles.find({
                                deleted:{'$ne':true},
                                name:{'$in':found.roles}}, function (err, roles) {

                                var tasks = {};

                                roles.tasks.forEach(function (task) {

                                    if (tasks[task.name]) {
                                        tasks[task.name] = tasks[task.name].contcat(task.verbs);
                                    } else {
                                        tasks[task.name] = task.verbs;
                                    }
                                })

                                var task_names = [];

                                _.each(tasks, function (verbs, task) {
                                    verbs.forEach(function (verb) {
                                        task_names.push(verb + ' ' + task);
                                    })
                                })
                                rs.set_session('member_cans', task_names.join(','));
                                rs.go('/');

                            })
                        } else {
                            rs.go('/');
                        }

                    } else {
                        rs.flash('error', 'cannot find user with that information');
                        self.on_get_process(rs, input);
                    }
                }
            });
    }
}