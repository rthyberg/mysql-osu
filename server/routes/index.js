var path = require('path');
var api_key = '702A6579FF7D3F81D418F7B53C1BD5F5';
module.exports = function(app, request, moment) {
    app.get('/', function(req, res) { // the root home page
        res.render('home');
    });


    app.use(function(req, res) { // the no page page
        res.status(404);
        res.render('404');
    });

    app.use(function(err, req, res, next) { // server error page
        console.error(err.stack);
        res.type('plain/text');
        res.status(500);
        res.render('500');
    });
}

