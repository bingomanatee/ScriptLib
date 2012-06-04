var mm = require('support/mongoose_model');
var mongoose = require('mongoose');
var util = require('util');

var task = new mongoose.Schema({
    _id:mongoose.Schema.ObjectId,
    task:String,
    verbs:[String]
})
var role = new mongoose.Schema({
    _id:{type:String},
    label:{type:String, required:false},
    tasks:[task],
    deleted:Boolean
})

var schema = new mongoose.Schema({
    id:Number, // for Facebook
    name:{type:String, required:false},
    username:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:false},
    gender:String,
    deleted:{type:Boolean, "default":false},
    roles:[String]
});

schema.statics.active = function (cb) {
    return this.find('deleted', {'$ne':true}).run(cb);
}

schema.statics.inactive = function (cb) {
    return this.find('deleted', true).run(cb);
}

var _model = mm.create(schema, {name:"members_members", type:"model",
    from_fb:function (fb_data, cb) {
       // console.log('from_fb: %s', util.inspect(fb_data));
        if (!fb_data){
            return cb(null, false);
        }
        var query = {id:parseInt(fb_data.id)};
        _model.find_one(query,
            function (err, member) {
                if (err) throw err;
             //   console.log('found');
                if (member) {
                //    console.log('member found: %s', util.inspect(member));
                    cb(null, member);
                } else {
                 //   console.log('inserting fb_data: %s', util.inspect(fb_data));
                    _model.validate(fb_data, function (err, member) {
                     //   console.log('validtaion: ', util.inspect(err));
                        if (err) {
                            cb();
                        } else {
                            member.save(function () {
                                cb(null, member)
                            })
                        }
                    })
                }
            }).exec();
    }});

module.exports = function () {
    return _model;
}

/*

 fb member: { id: '805008941',
 name: 'Dave Edelhart',
 first_name: 'Dave',
 last_name: 'Edelhart',
 link: 'http://www.facebook.com/dave.edelhart',
 username: 'dave.edelhart',
 about: 'Attack of Happy Dave!',
 birthday: '11/20/1966',
 location: { id: '114952118516947', name: 'San Francisco, California' },
 gender: 'male',
 email: 'bingomanatee@me.com',
 timezone: -7,
 locale: 'en_US',
 verified: true,
 updated_time: '2011-10-05T04:32:50+0000' }

 */