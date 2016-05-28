var path = require('path');
var api_key = '702A6579FF7D3F81D418F7B53C1BD5F5';
module.exports = function(app, request, moment) {
    app.get('/', function(req, res) { // the root home page
        res.render('home');
    });

    app.get('/steam-news', function(req, res, next) {
        var url = "http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?"
        var context = {};
        context.items = [];
        var appid = "440";
        var count = "3";
        request(url + "appid=" + appid + "&count=" + count + "&maxlength=300&format=json",
            function(err, response, newsJson) {
                if (!err & response.statusCode < 400) {
                    context.news = JSON.parse(newsJson);
                    //context.newsitem=context.news.newsitem["title"];
                    for (item in context.news.appnews.newsitems) {
                        context.items[item] = context.news.appnews.newsitems[item];
                    }
                    res.render('news', context);
                } else {
                    if (response) {
                        console.log(response.statusCode);
                    }
                    next(err);
                }
            });
    });

    app.post('/steam-news', function(req, res, next) {
        console.log("post request made");
        var url = "http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?"
        var context = {};
        context.items = [];
        var appid = req.body["newsappID"] || appid;
        var count = "3";
        request(url + "appid=" + appid + "&count=" + count + "&maxlength=300&format=json",
            function(err, response, newsJson) {
                if (!err & response.statusCode < 400) {
                    context.news = JSON.parse(newsJson);
                    for (item in context.news.appnews.newsitems) {
                        context.items[item] = context.news.appnews.newsitems[item];
                    }
                    res.render('news', context);
                } else {
                    if (response) {
                        console.log(response.statusCode);
                        if (response.statusCode = 403) {
                            context.items[0] = {
                                'contents': "The appid '" + appid +
                                    "' does not exist"
                            };
                            res.render('news', context);
                        }
                    }
                }
            });
    });

    app.get('/steamid', function(req, res, next) {
        var url = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?";
        var context = {};
        context.items = [];
        var steamid = "76561197979155270";
        request(url + "key=" + api_key + "&steamids=" + steamid,
            function(err, response, idJson) {
                if (!err & response.statusCode < 400) {
                    context.steam = JSON.parse(idJson);
                    context.steam.username = context.steam.response.players[0]["personaname"];
                    context.steam.picture = context.steam.response.players[0]["avatarfull"];
                    context.steam.unixTime = context.steam.response.players[0]["timecreated"];
                    var day = moment.unix(context.steam.unixTime);
                    context.steam.date = day.format();
                    res.render('steamid', context);
                    /* console.log(context.steam);
                     console.log(context.steam.username);
                     console.log(context.steam.picture);
                     console.log(context.steam.unixTime);
                     console.log(context.steam.date);
                     */
                } else {
                    if (response) {
                        console.log(response.statusCode);
                    }
                    //next(err);
                }
            });
    });

    app.post('/steamid', function(req, res, next) {
        var url = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?";
        var context = {};
        var steamid = req.body["steamid"] || steamid;
        request(url + "key=" + api_key + "&steamids=" + steamid,
            function(err, response, idJson) {
                if (!err & response.statusCode < 400) {
                    context.steam = JSON.parse(idJson);
                    console.log(context.steam.response.players[0]);
                    if (context.steam.response.players[0] !== undefined) {
                        context.steam.username = context.steam.response.players[0]["personaname"];
                        context.steam.picture = context.steam.response.players[0]["avatarfull"];
                        context.steam.unixTime = context.steam.response.players[0]["timecreated"];
                        var day = moment.unix(context.steam.unixTime);
                        context.steam.date = day.format();
                        /* console.log(context.steam);
                         console.log(context.steam.username);
                         console.log(context.steam.picture);
                         console.log(context.steam.unixTime);
                         console.log(context.steam.date);
                         */
                        res.render('steamid', context);
                    } else {
                        res.render('steamidnouser');
                    }
                } else {
                    if (response) {
                        console.log(response.statusCode);
                        res.render('steamid', context.steam.username = "No such user");
                    }
                    //next(err);
                }
            });
    });

    app.get('/games', function(req, res, next) {
        var url = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?";
        var context = {};
        var steamid = "76561197979155270";
        request(url + "key=" + api_key + "&steamid=" + steamid + "&include_appinfo=1&include_played_free_games=1&format=json",
            function(err, response, games) {
                if (!err & response.statusCode < 400) {
                    context.games = JSON.parse(games).response;
                    context.gameCount = context.games.game_count;
                    context = topThreeGames(context);
                    for (item in context.topGames) {
                        context.topGames[item].url = "http://media.steampowered.com/steamcommunity/public/images/apps/" +
                            context.topGames[item].appid + "/" + context.topGames[item].hash + ".jpg";
                        context.topGames[item].time = context.topGames[item].time / 60;
                    }
                    console.log(context.topGames);
                    res.render('games', context);
                } else {
                    if (response) {
                        console.log(response.statusCode);
                    }
                    //next(err);
                }
            });
    });



    app.post('/games', function(req, res, next) {
        var url = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?";
        var context = {};
        var steamid = req.body["steamid"] || steamid;
        request(url + "key=" + api_key + "&steamid=" + steamid + "&include_appinfo=1&include_played_free_games=1&format=json",
            function(err, response, games) {
                if (!err & response.statusCode < 400) {
                    context.games = JSON.parse(games).response;
                    if (context.games.games !== undefined) {
                        context.gameCount = context.games.game_count;
                        context = topThreeGames(context);
                        for (item in context.topGames) {
                            context.topGames[item].url =
                                "http://media.steampowered.com/steamcommunity/public/images/apps/" +
                                context.topGames[item].appid + "/" +
                                context.topGames[item].hash + ".jpg";

                            context.topGames[item].time = context.topGames[item].time / 60;
                        }
                        console.log(context.topGames);
                        res.render('games', context);
                    } else {
                        res.render('gamesprivate');
                    }
                } else if (response.statusCode == 500) {
                    res.render('gamesnot');
                } else {
                    if (response) {
                        console.log(response.statusCode);
                    }
                    //next(err);
                }
            });
    });


    app.get('/all-together-now', function(req, res, next) {
        var profile_url = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?";
        var games_url = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?";
        var news_url = "http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?"

        var steamid = "76561197979155270";
        var context = {};
        var count = "3";

        request(profile_url + "key=" + api_key + "&steamids=" + steamid,
            function(err, response, idJson) {
                if (!err & response.statusCode < 400) {
                    context.steam = JSON.parse(idJson);
                    if (context.steam.response.players[0] !== undefined) {
                        context.steam.username = context.steam.response.players[0]["personaname"];
                        context.steam.picture = context.steam.response.players[0]["avatarfull"];
                        context.steam.unixTime = context.steam.response.players[0]["timecreated"];
                        var day = moment.unix(context.steam.unixTime);
                        context.steam.date = day.format();

                        request(games_url + "key=" + api_key + "&steamid=" + steamid + "&include_appinfo=1&include_played_free_games=1&format=json",
                            function(err, response, games) {
                                if (!err & response.statusCode < 400) {
                                    context.games = JSON.parse(games).response;
                                    context.gameCount = context.games.game_count;
                                    console.log(context.gameCount);
                                    context = topThreeGames(context);
                                    console.log(context.topGames);
                                    for (item in context.topGames) {
                                        context.topGames[item].url =
                                            "http://media.steampowered.com/steamcommunity/public/images/apps/" +
                                            context.topGames[item].appid + "/" +
                                            context.topGames[item].hash + ".jpg";
                                            context.topGames[item].time = context.topGames[item].time / 60;
                                    }
                               res.render('alltogether',context);
                                }
                            });
                    }
                }
            });
    });
    app.post('/all-together-now', function(req, res, next) {
        var profile_url = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?";
        var games_url = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?";

        var steamid = req.body["steamid"] || steamid;
        var context = {};
        var count = "3";

        request(profile_url + "key=" + api_key + "&steamids=" + steamid,
            function(err, response, idJson) {
                if (!err & response.statusCode < 400) {
                    context.steam = JSON.parse(idJson);
                    if (context.steam.response.players[0] !== undefined) {
                        context.steam.username = context.steam.response.players[0]["personaname"];
                        context.steam.picture = context.steam.response.players[0]["avatarfull"];
                        context.steam.unixTime = context.steam.response.players[0]["timecreated"];
                        var day = moment.unix(context.steam.unixTime);
                        context.steam.date = day.format();

                        request(games_url + "key=" + api_key + "&steamid=" + steamid + "&include_appinfo=1&include_played_free_games=1&format=json",
                            function(err, response, games) {
                                if (!err & response.statusCode < 400) {
                                    context.games = JSON.parse(games).response;
                                    context.gameCount = context.games.game_count;
                                    console.log(context.gameCount);
                                    context = topThreeGames(context);
                                    console.log(context.topGames);
                                    for (item in context.topGames) {
                                        context.topGames[item].url =
                                            "http://media.steampowered.com/steamcommunity/public/images/apps/" +
                                            context.topGames[item].appid + "/" +
                                            context.topGames[item].hash + ".jpg";

                                        context.topGames[item].time = context.topGames[item].time / 60;
                                    }
                                    res.render('alltogether', context);
                                }
                            });
                    }
                }
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

function topThreeGames(context) {
    var emptyGame1 = {}
    var emptyGame2 = {}
    var emptyGame3 = {}
    emptyGame1.title = "";
    emptyGame2.title = "";
    emptyGame3.title = "";
    emptyGame1.time = "-1";
    emptyGame2.time = "-1";
    emptyGame3.time = "-1";
    emptyGame1.appid = "";
    emptyGame2.appid = "";
    emptyGame3.appid = "";
    emptyGame1.hash = "";
    emptyGame2.hash = "";
    emptyGame3.hash = "";
    context.topGames = [emptyGame1, emptyGame2, emptyGame3];
    console.log(context.topGames);
    for (item in context.games.games) {
        //   console.log(item);
        for (item2 in context.topGames) {
            //       console.log(context.games.games[item].playtime_forever + ">" + context.topGames[item2].time);
            if (context.games.games[item].playtime_forever > context.topGames[item2].time) {
                var new_name = context.games.games[item].name;
                var new_time = context.games.games[item].playtime_forever;
                var new_appid = context.games.games[item].appid;
                var new_hash = context.games.games[item].img_logo_url;
                var itr = item2;
                var tmp_name, tmp_time, tmp_appid, tmp_hash;
                do {
                    tmp_name = context.topGames[itr].title;
                    tmp_time = context.topGames[itr].time;
                    tmp_appid = context.topGames[itr].appid;
                    tmp_hash = context.topGames[itr].hash;
                    context.topGames[itr].title = new_name;
                    context.topGames[itr].time = new_time;
                    context.topGames[itr].appid = new_appid;
                    context.topGames[itr].hash = new_hash
                    new_name = tmp_name;
                    new_time = tmp_time;
                    new_appid = tmp_appid;
                    new_hash = tmp_hash;
                    itr++;
                    //            console.log(context.topGames);
                } while (itr < 3);
                break;
            }
        }
    }
    return context;
}
