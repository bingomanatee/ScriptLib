var express = require('express');

module.exports = {
    start_server: function(server, frame, cb){
        var oneYear = 31557600000;
        server.use(express.static(frame.path + '/public', {maxAge: oneYear}));
        cb();
    }
}