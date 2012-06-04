var mm = require('support/mongoose_model');
var mongoose = require('mongoose');
var util = require('util');
var _ = require('underscore');

var boost = new mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    name: String,
    level: Number
});


var schema = new mongoose.Schema({
    name: String,
    member: {type: mongoose.Schema.ObjectId, ref: 'Members_members'},
    age_at_start: Number,
    gender: {type: String, enum: ['male', 'female']},
    background: String,
    appearance: {},
    personality: {
        dominance: Number,
        ego: Number,
        steadiness: Number,
        formality: Number
    },
    traits: {
        charm: Number,
        looks: Number,
        stamina: Number,
        talent: Number,
        smarts: Number
    },
    boosts: [boost]
});

schema.statics.active = function (cb) {
    return this.find('deleted', {'$ne':true}).run(cb);
}

schema.statics.inactive = function (cb) {
    return this.find('deleted', true).run(cb);
}

var _model = mm.create(schema,
    {name:"Actor", type:"model"}
);

module.exports = function () {
    return _model;
}
