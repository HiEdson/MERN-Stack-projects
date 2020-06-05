var mongoose = require("mongoose");
var yourNewsSchema = new mongoose.Schema ({
    title: String,
    image:String,
    Category:String,
    description:String,
    yournewsCreat: {type: Date, default: Date.now},
    author : {
        id: {type:mongoose.Schema.Types.ObjectId,
        ref:"User"},
        username:String
     },
     typeContent: String
    
     });
     var YourNews = mongoose.model("YourNews", yourNewsSchema);
     module.exports = YourNews;