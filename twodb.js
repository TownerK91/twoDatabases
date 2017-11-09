var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    PORT: 3306,
    user: "root",
    password: "TwoFour66",
    database: "top_songsDB"
});

connection.connect(function(err) {
    if (err) throw err;
    runSearch();
});

var runSearch = function() {
    inquirer.prompt({
        name: "action",
        type: "rawlist",
        message: "what you trying to do?",
        choices: [
            "Find songs by artist",
            "Find all artists who appear more than once",
            "Find data within a specific song",
            "Find artists with top song and top album within the same year"
        ]
    }).then(function(answer) {
        switch (answer.action) {
            case "Find songs by artist":
                artistSearch();
                break;

            case "Find all artists who appear more than once":
                multiSearch();
                break;

            case "Find data within a specific range":
                rangeSearch();
                break;

            case "Search for a specific song":
                songSearch();
                break;

            case "Find artists with a top song and top album in the same year":
                songAndAlbumSearch();
                break;
        }
    });
}

var artistSearch = function() {
    inquirer.prompt({
        name: "artist",
        type: "input",
        message: "Which Artist?"
    }).then(function(answer) {
        var query = "SELECT position, song, year FROM top5000 WHERE ?";
        connection.query(query, { artist: answer.artist }, function(err, res) {
            for (var i = 0; i < res.length; i++) {
                console.log("Position: " + res[i].position + " || Song: " + res[i].song + " || Year: " + res[i].year);
            }
            runSearch();
        });
    });
}


function multiSearch() {
    inquirer.prompt({
        name: "number",
        type: "input",
        message: "How many instances are we loading??"
    }).then(function(answer) {
        var query = "SELECT artist FROM top5000 GROUP BY artist HAVING count(*) > 1";
        connection.query(query, function(err, res) {
            for (var i = 0; i < res.length; i++) {
                console.log(res[i].artist);
            }
            runSearch();
        });
    });
}