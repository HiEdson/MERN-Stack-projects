var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
var Accomodation = require("../models/accomodation");
// accomodation schema and collection
//for apdate
/*var path = require("path");
var crypto = require("crypto");
var multer = require("multer");
var GridFsStorage = require("multer-gridfs-storage");
var  Grid = require = require("gridfs-stream");
*/

//for image

const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
var fs = require('fs');
//end for uplpading image


//upload image locally


//mongo
const mongoURI = 'mongodb://localhost:27017/guidepla';
//mongo connection
const conn = mongoose.createConnection(mongoURI);

//initialize gfs
var gfs ;
conn.once('open', function(){
    //init our stream
     gfs= Grid(conn.db, mongoose.mongo);
     gfs.collection('accomodation'); 
}) 


// Create storage engine

//
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'accomodation'
          };
          resolve(fileInfo);
        });
      });
    }
  });
  const upload = multer({ storage });
  //////////

//end of uploading image locally










 router.get("/places", function(req, res){
  Accomodation.find({}, function(err, places){
    if(err){
      console.log(err);
    } else{
      //console.log("_____________----________________--___________________--");
      //console.log(places);
      gfs.files.find().toArray((err, files) => {

        // Check if files
        if (!files || files.length === 0) {
          res.render('places', { files: false });
          } else {
          files.map(file => {
            if (
              file.contentType === 'image/jpeg' ||
              file.contentType === 'image/png'
            ) {
              file.isImage = true;
            } else {
              file.isImage = false;
            }
          });
           // Check if image
      if (files.contentType === 'image/jpeg' || files.contentType === 'image/png') {
        // Read output to browser
        const readstream = gfs.createReadStream(files.filename);
        readstream.pipe(res);
        res.render("places", {places:places, files:files});
      } else {
        res.status(404).json({
          err: 'Not an image'
        });
      }
         /////////
        }
        
      });
    }
  }); 

  

  /*gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      res.render('places', { files: false });
      } else {
      files.map(file => {
        if (
          file.contentType === 'image/jpeg' ||
          file.contentType === 'image/png'
        ) {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
    
    }
    //res.render('places', {files:files});
    console.log("======");
      console.log(files);
  });*/
  //---------------------------------
    /*Accomodation.find({}, function(err, allplaces){
  if(err){
    console.log(err);
  
  }else{
    res.render("places", {places:allplaces});
  }
    });*/
    
  })
  
  /*var name= req.body.name;
  var location= req.body.location;
  var image= req.body.image;
  var price= req.body.price;*/
  router.post("/places", upload.array('photos', 12), function(req, res){
    //------------------------------
  
  req.body.newPlace.image= gfs.files.filename;
  console.log(gfs.files.filename);
  req.body.newPlace.author = {
    id: req.user._id,
    username: req.user.username
  }
 // var newPlace= {name:name, location:location, image:image, price:price}
  Accomodation.create(req.body.newPlace, function(err, places){
    
    if(err){
      console.log(err);
    } else{
      //res.json(places);
      
      console.log(places);
    //res.redirect("/places");
       res.json({ file: req.file });
    }
  });
  });
  
// @route GET /image/:filename
  // @desc Display Image
  router.get('/image/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
  
      // Check if image
      if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        // Read output to browser
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        res.status(404).json({
          err: 'Not an image'
        });
      }
    });
  });






  router.get("/places/new", function(req, res){
  res.render("newacco");
  });
  

  module.exports= router;