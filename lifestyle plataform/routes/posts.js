var express = require("express");
var router = express.Router();
var Posts = require("../models/Posts");
var expressSanitizer= require("express-sanitizer");
var visitCounter = require('express-visit-counter').Loader;




//our postssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
//for update
var multer = require('multer');
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

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'hhoo', 
  api_key:'457277892154548', 
  api_secret:'pI3efWt6glpiZeHCyO7a2f7TngA' 
});
/*cloudinary.config({ 
  cloud_name: 'letbeedson', 
  api_key:'344865456579861', 
  api_secret:'0jPjZxdAkONwJbe5r_IS-CRlu1s'
});*/
//and of updating photo


 router.get("/posts", function(req, res){
  var http = require('http');

  var userCount = 0;
  
  var server = http.createServer(function (req, res) {
  
      userCount++;
  
      res.writeHead(200, { 'Content-Type': 'text/plain' });
  
      res.write('Hello!\n');
  
      console.log('We have had ' + userCount + ' visits!\n');
  
      res.end();
  
  });
   //kkkkkk
  if(req.query.search){
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Posts.find({"title": regex}, function(err, posts){
      if(err){
        console.log(err);
      }
      else{
      res.render("posts",{Posts:posts});
      }
    });
  } else{

    Posts.find({}, function(err, posts){
      var Posts = posts;
      Posts = shuffle(Posts);
      if(err){
        console.log(err);
      }
      else{
      res.render("posts",{Posts});
      }
    });
  }
 
});


//post
router.post("/posts", isLoggedIn, upload.single('image'), function(req, res){
  /*req.body.Posts.body = req.sanitize(req.body.Posts.body);

  var title = req.body.title;
  var image = req.body.image;
  var body = req.body.body;
  var author= {
    id: req.user._id,
    username: req.user.username
  }

  var newPostes = {title: title, image: image, body: body, author: author}
  
  
Posts.create(newPostes, function(err, newpost){

if(err){
  console.log(err)
} else{
  console.log(newpost);
  res.redirect("/posts");
}
});*/

//------------------------------
cloudinary.v2.uploader.upload(req.file.path, function(err, resultble) {
  if (err){
    console.log(err);
    return res.redirect('back');
  }
// add cloudinary url for the image to the campground object under image property
req.body.Posts.image = resultble.secure_url;
//add images public_id to campground object
req.body.Posts.imageId = resultble.public_id;
// add author to campground
req.body.Posts.author = { 
  id: req.user._id,
  username: req.user.username
}
Posts.create(req.body.Posts, function(err, post) {
  if (err) {
    //req.flash('error', err.message);
    console.log(err);
    return res.redirect('back');
  }
  res.redirect('/posts/' );
});
});
}); 

//new post
router.get("/posts/new",isLoggedIn, function(req, res){
  res.render("postsnew");
});


//show posts
router.get("/posts/:id", function(req, res){

  Posts.find({}, function(err,mainPost){
    var allPosts = mainPost;
    allPosts = shuffle(allPosts);

    if(err){ console.log(err);} 
      else{
        
        Posts.findById(req.params.id, async function(err, post){
          let visitorsPosts = await visitCounter.getCount("/posts/:id");
          if(err){
            console.log(err);
            res.redirect("/posts");
        }  else{  
          res.render("postsshow",{blogs:post, allPosts, visitorsPosts});
      }
    });          
 

    }
  });
});
//louco



 


 

  


/*
router.get("/posts/:id", function(req, res){
    Posts.findById(req.params.id, function(err, post){
      if(err){
        console.log(err);
        res.redirect("/posts");
    }  else{
      res.render("postsshow",{blogs:post, allPosts:Posts.find({})});
  }
 });
}); */


//edit
router.get("/posts/:id/edit",checkPost, function(req, res){
 Posts.findById(req.params.id, function(err, edit){
   if(err){
     res.redirect("/posts");
   } else{
     res.render("postsedit",{blog:edit});
   }
 });
});


//update
router.put("/posts/:id",checkPost, upload.single('image'), function(req, res){
  //-----------------------------
  Posts.findById(req.params.id, async function(err, post){
    if(err){
      console.log(err);
    } else{
      if(req.file) {
        try{
          await cloudinary.v2.uploader.destroy(post.imageId);
          var result = await cloudinary.v2.uploader.upload(req.file.path);
          post.imageId = result.public_id;
          post.image = result.secure_url;
        } catch{
          return res.redirect('back');
        }
      }
      post.title = req.body.title;
      //posts.local = req.body.local;
      post.body = req.body.body;
      post.save();
      res.redirect("/posts/" + req.params.id);
    }
  })


  //----------------------------


  /*req.body.blog.body= req.sanitize(req.body.blog.body);
  Posts.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updated){
    if(err){
      coonsole.log(error);
    } else{
      res.redirect("/posts/"+ req.params.id);
    }
  });*/
});

//delete
router.delete("/posts/:id",checkPost, function(req, res){
 Posts.findByIdAndDelete(req.params.id, function(err){
   if(err){
     console.log(err);
   } else{
     res.redirect("/posts");
   }
 });
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//midleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } 
  res.redirect("/login");
}

function checkPost (req, res, next) {
  if(req.isAuthenticated()){

    Posts.findById(req.params.id, function(err, edit){
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
module.exports= router;