//Require your dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");
var eH = require("express-handlebars");
var mongojs = require("mongojs");
var path = require("path");



//Require axios and cheerio, our scraping tools
var axios = require("axios");
var cheerio =  require("cheerio");


//Require all models
var db = require("./models");


//Dictate your port
var PORT = 3002;


//Initialize express
var app = express();

// Database configuration
var databaseUrl = "article";
var collections = ["data"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
    console.log("Database Error:", error);
});

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));


mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/scraper", {
    useMongoClient: true
});


//Routes

    app.get("/", function (req, res) {
        res.sendFile(path.join(__dirname, "/public/home.html")); //base page
    });


app.get("/all", function(req, res) {

    db.data.find({}, function(error, found) {

        if(error) {
            console.log(error);
        } else {
            res.json(found);

        }
    });
});

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
    // Make a request for the sports section of the onion
    request("https://www.theonion.com/c/sports-news-in-brief", function(error, response, html) {

        db.data.remove({});

        // Load the html body from request into cheerio
        var $ = cheerio.load(html);
        // For each element with a "title" class
        $(".storytype__content article").each(function(i, element) {

            var title = $(element).children().children().children().children(".entry-title a").text();
            var link = $(element).children().children().children("a").attr("href");
            var excerpt = $(element).children().children().children().children(".entry-summary p").text();
            var photo = $(this).children().children().children().children().children().children("source").attr("data-srcset");;

            // If this found element had both a title and a link
            if (title && link && excerpt) {
                // Insert the data in the scrapedData db
                db.data.insert({
                        title: title,
                        link: link,
                        excerpt: excerpt,
                        photo: photo
                    },
                    function(err, inserted) {
                        if (err) {
                            // Log the error if one is encountered during the query
                            console.log(err);
                        }
                        else {
                            // Otherwise, log the inserted data
                            console.log(inserted);
                        }
                    });
                }
            });
        });

    // Send a "Scrape Complete" message to the browser
    res.send("Scrape Complete");
});


app.post("/update/:id", function(req, res) {
    db.data.update({
        "_id":mongojs.ObjectID(req.params.id)
    }, function(error, found) {
        if(error) {
            console.log(error);
            res.send(error);
        } else {
            console.log(found);
            res.send(found);
        }
    });
});



//Separate routes than the articles
//Routes for the notes portion
app.post("/submit", function(req, res) {
    console.log(req.body);
    db.note.insert(req.body, function(error, saved) {
        if(error) {
        console.log(error);
        }
    });
});


app.get("/note", function(req, res) {
    db.note.find({}, function(error, found) {
        if(error) {
            console.log(error);
        } else {
            res.json(found);
        }
    });
});


app.get("/find/:id", function(req, res) {
    db.note.find({"_id": mongojs.ObjectID(req.params.id)
    }, function(error, found) {
        if(error) {
            console.log(error);
            res.send(error);
        } else {
            console.log(found);
            res.send(found);
        }
    });
});


app.get("/update/:id", function(req, res) {
    db.note.update({
        "_id": mongojs.ObjectID(req.params.id)
    }, {
        $set: {
            "note": req.body.note,
            "modified": Date.now()
        }
    }, function(error, edited) {
        if(error) {
            console.log(error);
            res.send(error);
        } else {
            console.log(edited);
            res.send(edited);
        }
    });
});


app.get("/clear", function(req, res) {
    db.note.remove({}, function(error, response) {
        if(error) {
            res.send(error);
        } else {
            res.send(response);
        }
    });
});



app.listen(PORT, function() {
    console.log("App is running on Port: " + PORT);
});


