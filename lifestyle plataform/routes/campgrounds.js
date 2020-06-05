var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var multer = require('multer');


//for update

var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary').v2;
cloudinary.config({ 
  cloud_name: '...', 
  api_key:'.....', 
  api_secret:'.....' 
});
// /*'letbeedson' */ /*'344865456579861' */ /*'0jPjZxdAkONwJbe5r_IS-CRlu1s' */
//end of updating photo

//this is my camp/touristic places to visit templanttttttttttttttttttttttttttttttttttttttttttttttt
router.get("/activities", function(req, res){
  if(req.query.search){
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Campground.find({"name": regex}, function(err, allcamp){
      if(err){
        console.log(err);
      } else{
        res.render("campgrounds", {campgrounds:allcamp});
      }
    }); 
  } else
        { 
          //get all campgrounds from db
    Campground.find({}, function(err, allcamp){
      var campgrounds = allcamp;
campgrounds = shuffle(campgrounds);

//try to create the timer logic
//var countDownDate = new Date(allcamp.cre).getTime();
//end of timer logic

// console.log(arr);
      if(err){
        console.log(err);
      } else{
        res
        .title('Activities!')
        .render("campgrounds", {campgrounds});
      }
    }); 

        } 

   
   
   });
  
   router.post("/activities", isLoggedIn, upload.single('image'), function(req, res){

   /* var name= req.body.name;
    var image= req.body.image;
    var local = req.body.local;
    var description= req.body.description;
    var author= {
      id: req.user._id,
      username: req.user.username
    }
    var newCampground = {name:name, local:local, image:image, description:description, author: author}*/

    cloudinary.uploader.upload(req.file.path, function(err, result) {
        if (err){
          console.log(err)
          return res.redirect('back');
        }
      // add cloudinary url for the image to the campground object under image property
      req.body.newCampground.image = result.secure_url;
      //add images public_id to campground object
      req.body.newCampground.imageId = result.public_id;
      // add author to campground
      req.body.newCampground.author = {
        id: req.user._id,
        username: req.user.username
      }
      Campground.create(req.body.newCampground, function(err, campground) {
        
        if (err) {
          //req.flash('error', err.message);
          console.log(err);
          return res.redirect('back');
        }
        res.redirect('/activities/' + campground.id);
      });
    });


    /*
     //get data from for and add in cmpground array
     var name= req.body.name;
     var image= req.body.image;
     var local = req.body.local;
     var description= req.body.description;
     var author= {
       id: req.user._id,
       username: req.user.username
     }
     var newCampground = {name:name, local:local, image:image, description:description, author: author}

     Campground.create(newCampground, function(err, newly){
      if(err){
        console.log(err);
        res.redirect("/campgrounds/new");
      } else{
        //redirect to campgerounds page
        res.redirect("/campgrounds");
      }
     });*/
  
   
   
  });
  
  router.get("/activities/new", isLoggedIn, function(req, res){
  res.render("newcamp");
  });
  
  //show campground
  router.get("/activities/:id", function(req, res){
    
   Campground.find({}, function(err, moreCamp){
var arr = moreCamp;
arr = shuffle(arr);
// console.log(arr);
   
    if(err){
      console.log(err);
    } else{
      Campground.findById(req.params.id).populate("comments").exec(function(err, found){
        var reference = found.references;
        var location = found.local;
        if(err){
          console.log(err);
        } else{
         //var user= req.user;
         res.render("showcamp", {camp: found, allCamp:moreCamp, arr, location, reference});
         //console.log(found);
        }
       
         }); 
    }
   });
  });

  //edit campgrounds
  router.get("/activities/:id/edit",checkCamp, function(req, res){

      Campground.findById(req.params.id, function(err, edit){
            res.render("editcamp", {camp: edit});
      });
      });
  

  //update campgrounds
  router.put("/activities/:id",checkCamp, upload.single('image'), function(req, res){
    
    Campground.findById(req.params.id, async function(err, campground){
      if(err){
        console.log(err);
      } else{
        if(req.file) {
          try{
            await cloudinary.v2.uploader.destroy(campground.imageId);
            var result = await cloudinary.uploader.upload(req.file.path);
            campground.imageId = result.public_id;
            campground.image = result.secure_url;
          } catch{
            return res.redirect('back');
          }
        }
        campground.name = req.body.name;
        campground.local = req.body.local;
        campground.description = req.body.description;
        campground.save();
        res.redirect("/activities/" + req.params.id);
      }
    })
  });

  /*Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err, updated){
      if(err){
        console.log(err);
      } else{
        res.redirect("/campgrounds/" + req.params.id);
      }
    })*/
   
  //delete campground
  router.delete("/activities/:id",checkCamp, function(req, res){
    Campground.findById(req.params.id, async function(err, campground){
      if(err){
        return console.log(err);
      } 
      try{
        await cloudinary.uploader.destroy(campground.imageId);
        campground.remove();
        res.redirect("/activities");
      } catch(err) {
        if(err){
          return console.log(err);
        } 
      }
     
    })
  });

  //midleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } 
  res.redirect("/login");
}

function checkCamp (req, res, next) {
  if(req.isAuthenticated()){

    Campground.findById(req.params.id, function(err, edit){
      if(err){
        res.redirect("back");
      } else{
        if(edit.author.id.equals(req.user._id)){
         next();
        } else{
          res.redirect("back");
        }
        
      }
    });

  } else{
    res.redirect("back");
  }
}


function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

    /*for aleatory element lists*/
function shuffle(array) {
var currentIndex = array.length, temporaryValue, randomIndex;

// While there remain elements to shuffle...
while (0 !== currentIndex) {

// Pick a remaining element...
randomIndex = Math.floor(Math.random() * currentIndex);
currentIndex -= 1;

// And swap it with the current element.
temporaryValue = array[currentIndex];
array[currentIndex] = array[randomIndex];
array[randomIndex] = temporaryValue;
}

return array;
}



/*timer



// Set the date we're counting down to
var countDownDate = new Date("Jan 5, 2020 00:54:00").getTime();
    
// Update the count down every 1 second
var x = setInterval(function() {

  // Get today's date and time
  var now = new Date().getTime();
  
    var passou =new Date(countDownDate+(1*60*1000)).getTime();
    var fim = now + passou;
  // Find the distance between now and the count down date
  var distance = countDownDate - now;
  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
}, 1000);*/
  module.exports= router;