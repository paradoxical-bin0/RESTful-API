const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//connection
mongoose.connect("mongodb://0.0.0.0:27017/wikiDB");
//schema
const articleSchema = new mongoose.Schema({
    name:  String,
    content: String
});
//model
const Article = mongoose.model("Article", articleSchema);

/////Requests targetting all articles

app.route("/articles")
.get(function(req,res){
    Article.find().then((foundArticles) => {
        res.send(foundArticles);
    }).catch((err) => {
        console.log(err);
    });
})
.post(function(req,res){

    const newArticle = new Article({
        name: req.body.name,
        content: req.body.content
    });
    newArticle.save().then(() => {
        console.log("Succesfully added article!");
    }).catch((err) => {
        console.log(err);
    });
})
.delete(function(req,res){
    Article.deleteMany().then(() => {
        res.send("Successfully deleted all the articles.")
    }).catch((err) => {
        res.send(err);
    });
});

//////Requests targetting a specific article

app.route("/articles/:articleTitle")

.get(function(req,res){
    const title = req.params.articleTitle;
    Article.findOne({name: title}).then((found_article) => {
        res.send(found_article);
    }).catch((err) => {
        res.send(err);
    });
})

.put(function(req,res){
    Article.updateOne(
        {name: req.params.articleTitle},
        {name: req.body.name, content: req.body.content}
    ).then(() => {
        res.send("Successfully Update!");
    }).catch((err) => {
        res.send(err);
    });
})

.patch(function(req,res){
    Article.updateOne(
        {name: req.params.articleTitle},
        {$set: req.body}
    ).then(() => {
        res.send("Successfully Update!");
    }).catch((err) => {
        res.send(err);
    });
})


.delete(function(req,res){
    Article.deleteOne({name: req.params.articleTitle}).then(() => {
        res.send("Deletion Successful");
    }).catch((err) => {
        res.send(err);
    });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});



/**
 [
    {
        "_id": "640c80dcef5907b8b8bf7c54",
        "name": "test",
        "content": "test"
    },
    {
        "_id": "640c820def5907b8b8bf7c55",
        "name": "test2",
        "content": "test2"
    },
    {
        "_id": "640c8226ef5907b8b8bf7c56",
        "name": "test3",
        "content": "test3"
    },
    {
        "_id": "640c8282f2dd056a7fd24cd5",
        "name": "test4",
        "content": "test4"
    },
    {
        "_id": "640c8bfe9eae776753f0761d",
        "name": "shreya",
        "content": "test5",
        "__v": 0
    }
]
 */