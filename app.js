//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _=require("lodash");
const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/blogDB');
mongoose.connect('mongodb+srv://admin-arun:cluster0holder18@cluster0.qd3fc.mongodb.net/blogDB');

const homeStartingContent = "This is an awesome website you will enjoy posting your blogs. Follow the instructions in the 'Guide blog' to post a blog";
const aboutContent = "Hey guys, this is me :) Arunanda Panigrahi. I hope you would enjoy this. In case of any issue or suggestions please let me know in the Contact section. Have a Good Day";
const contactContent = "email id : arupanigrahi18@gmail.com Phone number : 9438775033" ;

const app = express();


app.set('view engine', 'ejs');

const blogSchema=new mongoose.Schema({
  title: String,
  content: String
});

const Blog=mongoose.model('Blog',blogSchema);

const guideBlog=new Blog({
  title: "Guide",
  content: "To compose a new blog go to COMPOSE NEW section and post your blog"
});

// guideBlog.save();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",function(req,res){

  Blog.find({},function(err,blogsInDB){
    if(blogsInDB.length===0){
      guideBlog.save();
      res.redirect('/');
    }
    else{
      res.render("home", {homeStartingContent: homeStartingContent,allPost: blogsInDB});
    }
  });

  // res.render("home",{homeStartingContent:homeStartingContent,allPost:allPost});
  // console.log(allPost);
});

app.get("/about",function(req,res){
  res.render("about",{aboutContent:aboutContent});
});

app.get("/contact",function(req,res){
  res.render("contact",{contactContent:contactContent});
});

app.get("/compose",function(req,res){
  res.render("compose");
});

app.post("/compose",function(req,res){
  // console.log("content is : " + req.body.postData);
  // var toPost={
  //   title: req.body.postTitle,
  //   content: req.body.postData
  // };

  var newBlog=new Blog({
    title: req.body.postTitle,
    content: req.body.postData
  });
  newBlog.save();
  res.redirect("/");
});

app.post("/posts/:requestName",function(req,res){
  // console.log(req.body.blogid);
  var requestedID=req.body.blogID;
  var requesedTitle=_.lowerCase(req.params.requestName);
  Blog.find({},function(err,blogsInDB){
    blogsInDB.forEach(function(elem){
      var availPost=_.lowerCase(elem.title);
      var availPostID=elem._id;
      availPostID=availPostID.toString();
      // console.log("available : ",typeof(availPostID));
      // console.log("requested : ",typeof(requestedID));
      if(requesedTitle===availPost && availPostID===requestedID){
        res.render("post",{title:elem.title,content:elem.content});
      }
    });
  });

});


app.post('/delete',function(req,res){

  var deleteBlogID=req.body.deleteBlogID
  // console.log("id to be deleted : ",deleteBlogID);
  // Blog.deleteOne({ _id: deleteBlogID});
  Blog.findByIdAndDelete(deleteBlogID, function (err, docs) {
    if (err){
        console.log(err)
    }
    // else{
    //     console.log("Deleted : ", docs);
    // }
  });
  res.redirect("/");
  // Blog.findByIdAndRemove(deleteBlogID,function(err){
  //   if(err){
  //     console.log(err);
  //   }
  //   else{
  //     res.redirect("/");
  //   }
  // });
  // else{
  //   /*we can use for loops to iterate over the list elements and after that again iterate through the items list then update
  //   but this is a simple method using $pull(mongoose remove document from array)*/
  //   List.findOneAndUpdate({name: listName},{$pull: {items: {_id: toDeleteId}}},function(err,foundList){
  //     if(err){
  //       console.log(err);
  //     }
  //     else{
  //       res.redirect("/"+listName);
  //     }
  //   });
  // }

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started without error");
});
