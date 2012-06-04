var mm = require('support/mongoose_model');
var mongoose = require('mongoose');
var util = require('util');
var _ = require('underscore');

var schema = new mongoose.Schema({
    name: {type: String, required: true},
    gender: {type: String, enum: ['male', 'female', 'either', 'last'], index: true},
    weight: {type: Number, min: 1, max: 5, 'default': 1},
    complete: Boolean
});

schema.statics.active = function (cb) {
    return this.find('deleted', {'$ne':true}).run(cb);
}

schema.statics.inactive = function (cb) {
    return this.find('deleted', true).run(cb);
}

schema.index({ name: 1, gender: 1, complete: 1}, { unique: true })

var _model = mm.create(schema,
    {name:"gw_name_ideas", type:"model"}
);

module.exports = function () {
    return _model;
}
