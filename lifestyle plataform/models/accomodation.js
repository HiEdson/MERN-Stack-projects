var mongoose = require("mongoose");

var accomodationSchema = new mongoose.Schema({
    name:String,
    image: String,
    description: String,
    price: String,
    location:String,
    placeCreated: {type: Date, default: Date.now},
    author: {
         id:{
              type: mongoose.Schema.Types.ObjectId,
              ref:"User"
         },
         username: String
    },
    });
    
    var Accomodation = mongoose.model("Accomodation", accomodationSchema);

    module.exports = Accomodation;