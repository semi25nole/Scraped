//Require your dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var mongojs = require("mongojs");


//Require axios and cheerio, our scraping tools
var axios = require("axios");
var cheerio =  require("cheerio");


//Require all models
var db = require("./models");


//Dictate your port
var PORT = 3000;


//Initialize express
var app = express();


//Configure the database
var databaseUrl = "Articles";
var collections = ["Data"];


//Hook into the database
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
    console.log("Database Error:", error);
});


//Retrieve data from the DB
app.get("/all", function(req, res) {
    // Find all results from the scrapedData collection in the db
    db.Data.find({}, function(error, found) {
        // Throw any errors to the console
        if (error) {
            console.log(error);
        }
        // If there are no errors, send the data to the browser as json
        else {
            res.json(found);
        }
    });
});


//Use morgan logger for logging requests
app.use(logger("dev"));
//Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({extended: false}));
//Use express.static to serve the public folder as a static directory
app.use(express.static("public"));


//Set mongoose to leverage built in JavaScript
//Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/Scraped", {
    useMongoClient: true
});


//Routes
//Create a get route to scrape the website
app.get("/scrape", function(req, res) {
    axios.get("http://www.espn.com/college-football/team/_/id/52/florida-state-seminoles").then(function(response) {

        var $ = cheerio.load(response.data);

        $("h2.c-entry-box--compact__title").each(function(i, element) {

            var results = [];

            results.title = $(this)
                .children("a")
                .text();
            results.link = $(this)
                .children("a")
                .attr("href");

            db.Article
                .create(results)
                .then(function(dbArticle) {

                    res.send("Scrape Complete");
                })
                .catch(function(err) {
                    res.json(err);
                });
        });

    });

});


app.get("/articles", function(req, res) {
    db.Article.find({}).then(function(dbArticle) {
        res.json(dbArticle);
    })
        .catch(function(err) {
            res.json(err);
        });
});


app.get("articles/:id", function(req, res) {
    db.Article.findOne({_id: req.params.id}).populate("note").then(function(dbArticle) {
        res.json(dbArticle);
    })
        .catch(function(err) {
        res.json(err);
    });
});


app.listen(PORT, function() {
    console.log("App is running on Port: " + PORT);
});


