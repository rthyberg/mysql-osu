var path = require('path');
module.exports = function(app, request, mysql) {

    app.get('/', function(req, res, next) {
        var context = {};
        res.render('home');
    });

    app.post('/', function(req, res, next) {
        res.render('home');
    });

    app.get('/insert', function(req, res, next) {
        var context = {};
        if (req.query.name != "") {
            mysql.pool.query("INSERT INTO workouts (`name`,`reps`,`weight`,`date`,`lbs`)VALUES (?,?,?,?,?)", [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs]);
        }
        mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields) {
            if (err) {
                next(err);
                return;
            }
            context.results = JSON.stringify(rows);
            res.send(context.results);
        });
    });
    app.get('/getdata', function(req, res, next) {
        var context = {};
        mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields) {
            if (err) {
                next(err);
                return;
            }
            context.results = JSON.stringify(rows);
            res.send(context.results);
        });
    });

    app.get('/delete', function(req, res, next) {
        var context = {};
        mysql.pool.query("DELETE FROM workouts WHERE id=?", [req.query.row_id]);
        res.send("success");
    });

    app.get('/simple-update', function(req, res, next) {
                    console.log(req.query.name);
                    console.log(req.query.reps);
                    console.log(req.query.weight);
                    console.log(req.query.date);
                    console.log(req.query.row_id);
        mysql.pool.query("UPDATE workouts SET `name` = ?, `reps` = ?, `weight`=?, `date`=? , `lbs`=? WHERE `id`=? ", [req.query.name, req.query.reps, req.query.weight, req.query.date,req.query.lbs, req.query.row_id],
            function(err, result) {
                if (err) {
                    next(err);
                    return;
                }
                res.send("success");
            });
    });

    app.get('/reset-table', function(req, res, next) {
        var context = {};
        mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err) {
            var createString = "CREATE TABLE workouts(" +
                "id INT PRIMARY KEY AUTO_INCREMENT," +
                "name VARCHAR(255) NOT NULL," +
                "reps INT," +
                "weight INT," +
                "date DATE," +
                "lbs BOOLEAN)";
            mysql.pool.query(createString, function(err) {
                context.results = "Table reset";
                res.render('home', context);
            })
        });
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
