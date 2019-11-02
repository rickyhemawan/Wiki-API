//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Article = mongoose.model("Article", {
  title: String,
  content: String,
});

app.route("/articles")

  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      res.send(err ? err : foundArticles);
    });
  })

  .post(function(req, res) {
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save(function(err) {
      res.send(err ? err : "Successfully added a new article");
    });

  })

  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      res.send(err ? err : "Successfully delete article(s)");
    });
  });

app.route("/articles/:articleTitle")

    .get(function(req, res){

      Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        res.send(foundArticle ? foundArticle : err);
      });
    })
    .put(function(req,res){
      Article.update(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
          res.send(err ? err : "Successfully Updated");
        }
      );
    })
    .patch(function(req,res){
      Article.update(
        {title: req.params.articleTitle},
        {$set: req.body},
        (err) => res.send(err ? err : "Successfully Updated")
      );
    }).delete(function(req,res){
      Article.deleteOne(
        {title: req.params.articleTitle},
        (err) => res.send(err ? err : "Successfully Deleted")
      );  
    });

app.listen(3000, function() {
  console.log("Server started on port 3000");
}); // /articles end
