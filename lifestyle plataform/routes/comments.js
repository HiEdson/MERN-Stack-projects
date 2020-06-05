var express= require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment  = require("../models/comment");


//to campground comments
router.get("/activities/:id/comments", isLoggedIn, function(req, res){
    Campground.findById(req, params.id, function(err, camp){
      if(err){
        console.log(err);
      } else{
        res.render("campgrounds",{camp: camp});
      }
    });
  });

  router.post("/activities/:id/comments",isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
      if(err)
      { console.log(err);
      } else{
        Comment.create(req.body.comment, function(err, comment){
          if(err){
            console.log(err);
          } else{
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            comment.save();
            campground.comments.push(comment);
            campground.save();
            res.redirect("/activities/"+ campground._id);
            console.log(comment)
          }
        });
      }
    });
  });

  
// end of campgrounds comments


////// edit comments
/*
router.get("/campgrounds/:id/comments/:comments/edit", function(req, res){
  Comment.findById(req.params.comments, function(err, burada){
    if(err){
      res.render("back");
    } else{
      res.render("editcomment",{camp_id:req.param.id, comment:burada});

    }
  });
});
*/



//midleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
      return next();
    } 
    res.redirect("/login");
  }

module.exports= router;