var mongoose = require("mongoose");
//Schema and collections
var postsSchema = new mongoose.Schema({
    title:String,
    image:String,
    imageId:String,
    body:String,
    created: {type: Date, default: Date.now},
    author: {
      id:{
           type: mongoose.Schema.Types.ObjectId,
           ref:"User"
      },
      username: String
 }
   });
      
   var Posts = mongoose.model("Posts", postsSchema);
   module.exports = Posts;