var mm = require('support/mongoose_model');
var mongoose = require('mongoose');
var util = require('util');
var _ = require('underscore');

var schema = new mongoose.Schema({
    title: String,
    type: [String],
    year: Number,
    summary: String,
    deleted: {type: Boolean, default: false}
});
var _model = mm.create(schema,
    {name:"sl_script", type:"model"}
);

module.exports = function () {
    return _model;
}
