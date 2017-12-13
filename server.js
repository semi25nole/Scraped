//Require your dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");
var eH = require("express-handlebars");



//Require axios and cheerio, our scraping tools
var axios = require("axios");
var cheerio =  require("cheerio");


//Require all models
var db = require("./models");


//Dictate your port
var PORT = 3000;


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


            // If this found element had both a title and a link
            if (title && link && excerpt) {
                // Insert the data in the scrapedData db
                db.data.insert({
                        title: title,
                        link: link,
                        excerpt: excerpt
                    }),
                    function(err, inserted) {
                        if (err) {
                            // Log the error if one is encountered during the query
                            console.log(err);
                        }
                        else {
                            // Otherwise, log the inserted data
                            console.log(inserted);
                        }
                    };
            }
        });
    });

    // Send a "Scrape Complete" message to the browser
    res.send("Scrape Complete");
});


app.listen(PORT, function() {
    console.log("App is running on Port: " + PORT);
});


