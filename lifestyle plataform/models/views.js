var mongoose=  require("mongoose");
var visitCounter = require('express-visit-counter').Loader;

var viewsPageSchema = new mongoose.Schema({
    visitorsAltogether:String,
    visitorsActivities: String,
    visitorsPosts: String
});


var ViewsPage = mongoose.model("ViewsPage", viewsPageSchema);
module.exports= ViewsPage;


