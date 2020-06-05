var mongoose = require("mongoose");
// campgrounds schema and collection:
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    imageId:String,
    local: String,
    references: String,
    description: String,
    cre: {type: Date, default: Date.now}, 
    author: {  
         id:{
              type: mongoose.Schema.Types.ObjectId,
              ref:"User"
         },
         username: String
    },
     comments: [
          {
               type: mongoose.Schema.Types.ObjectId,
               ref: "Comment"
          }
     ]
    });
     var Campground = mongoose.model("Campground", campgroundSchema);
     module.exports = Campground;