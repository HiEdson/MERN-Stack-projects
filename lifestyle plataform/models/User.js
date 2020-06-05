var mongoose=  require("mongoose");
var passportLocalMongoose= require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
username:String,
lastName: String,
email: String,
password: String,
newsPer : { type: String, default: 'false' }
});

UserSchema.plugin(passportLocalMongoose);

var User = mongoose.model("User", UserSchema);
module.exports= User;