var mm = require('support/mongoose_model');
var mongoose = require('mongoose');
var util = require('util');
var _ = require('underscore');

var schema = new mongoose.Schema({
    name: {type: String, required: true},
    icon_male: String,
    icon_female: String,
    notes: String,
    looks: Number,
    charm: Number,
    talent: Number,
    smarts: Number,
    stamina: Number

});

schema.statics.active = function (cb) {
    return this.find('deleted', {'$ne':true}).run(cb);
}

schema.statics.inactive = function (cb) {
    return this.find('deleted', true).run(cb);
}

var _model = mm.create(schema,
    {name:"gw_trait_templates", type:"model"}
);

module.exports = function () {
    return _model;
}
