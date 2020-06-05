var express = require("express");
var router = express.Router();
var passport= require("passport");
var User = require("../models/User");
var Posts = require("../models/Posts");
var Campground = require("../models/campground");
var Accomodation = require("../models/accomodation");
var Translator = require ("../models/yourNews");




router.get("/", async function(req, res, next){
  //users count

  var visitCounter = require('express-visit-counter').Loader;

//router.get('/', async function (req, res, next) {
  let visitorsAltogether = await visitCounter.getCount();
  let visitorsActivities = await visitCounter.getCount("/activities");
  let visitorsPosts = await visitCounter.getCount("/posts");

  let visitorsLogAltogether = await visitCounter.getLog(); 

  //let visitorsLogSite1 = await visitCounter.getLog("/site1");

  res.render("home"); //{tela: tela}
// for get inside});

  //users count
});




/*
this code is very importante pra mim, respeita

res.send(`
    <b>visitors altogether:</b> ${visitorsAltogether}<br />
    <b>visitors on site 1:</b> ${visitorsSite1}<br />
    <b>visitors on site 2:</b> ${visitorsSite2}<br />

    <p>
    <b>The whole log as JSON-String:</b><br />
    ${JSON.stringify(visitorsLogAltogether)}
    </p>

    <p>
    <b>The log of site1 as JSON-String:</b><br />
    
    </p>
  `);
*/ 







  /*Campground.find({}, function(err, tela){
    if(err){
      console.log(err);
    } else
      {
        /*Campground.findById(req.params.id).populate("posts").exec(function(err, telaposts){
          if(err){
            console.log(err);
          } else{
           res.render("home", {tela: tela, telaposts:telaposts});
           console.log(telaposts);
          }
        });*
        res.render("home", {tela: tela});
        }
  });
}); 


/*
Campground.find({}, function(err, tela){
  if(err){
    console.log(err);
  } else{
    Campground.findById(req.params.id).populate("posts").exec(function(err, telaposts){
      if(err){
        console.log(err);
      } else{
       res.render("home", {tela: tela, telaposts:telaposts});
      }
    
  }
});       
*/

//================================================================================authentication
//register form
router.get("/register", function(req, res){
    res.render("register");
  });
  router.post("/register", function(req, res){
    var newsPer = req.body.newsPer;
      var newUser = new User({username: req.body.username, lastName: req.body.lastName, email: req.body.email});
      User.register(newUser, req.body.password, function(err, Good){
          if(err){
            console.log(err);
            res.redirect("/register");
          } 
            passport.authenticate("local")(req, res,function(){
              console.log("registered");
              res.redirect("/");
            });
          
      });
  });
  
  //login
  router.get("/login", function(req, res){
    res.render("login");
  });
  
  router.post("/login",passport.authenticate("local", 
  {
    /*"/campgrounds"
    "/posts" 
    
     router.post("/login",passport.authenticate("local", 
  {
    
    successRedirect:next, 
    failureRedirect:back
}), function(req, res){});
*/
      successRedirect:"/", 
      failureRedirect:"/login"
  }), function(req, res, next){});
  
  //logout
  router.get("/logout", function(req, res){
     req.logout();
     res.redirect("/");
  });
  //end authentication=============================================================================
  router.get("/contactUs", function (req, res){
    res.render("contact_Us");
  });

  
  //midleware
  function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
      return next();
    } 
    res.redirect("/login");
  }

  module.exports = router;