var title = require('express-title');
var cors = require('cors');
var express = require("express");
 var app = express();
var bodyParser= require("body-parser");
var mongoose = require("mongoose");
//authentication
passport = require("passport");
LocalStrategy = require("passport-local");
//end authentication
var methodOverride= require("method-override");
var expressSanitizer= require("express-sanitizer");
//-----------schemas
//require Campground.js schema
var Campground = require("./models/campground");
//require comment.js schema
var Comment = require("./models/comment");
//require User.js schema
var User = require("./models/User");
//require Posts.js schema
var Posts = require("./models/Posts");
//require translator.js schema
var YourNews = require("./models/yourNews");
//require accomodation.js schema
var Accomodation = require("./models/accomodation");
//users views
var viewsPage = require("./models/views");
//-----------end schemas 
//require seeds
var seedDB = require("./seeds");
/*for apdate
var path = require("path");
var crypto = require("crypto");
var */


//»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» routes
var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
var accomodationRoutes = require("./routes/accomodation");
var postsRoutes = require("./routes/posts");
var yourNewsRoutes = require("./routes/yourNews");
var authenticationRoutes = require("./routes/auth");
var viewsPageRoutes = require("./routes/viewsPage");

//recente tentativa com hossii usando a nova pass, esta duro isso aqui.

//is impotant to keep the previous DB because of development porpose.
mongoose.connect("mongodb://localhost:27017/guidepla",{useNewUrlParser: true});


//perfect one
/*mongoose.connect("mongodb+srv://hossii:estaduro@cluster0-ulsyt.mongodb.net/test?retryWrites=true&w=majority" ,{
  useNewUrlParser: true,
  //cluster0-shard-00-00-cn6hz.mongodb.net:27017
  useCreateIndex: true
 }).then(() => {
   console.log('connected to DB!');
 }).catch(err => {
   console.log('ERROR: ', err.message);
 });*/















/*
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://hossii:estaduro@cluster0-ulsyt.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

*/




















/*
const MongoClient = require('mongodb').MongoClient;

// replace the uri string with your connection string.
const uri = "mongodb+srv://hossii:thisisthepw@cluster0-ulsyt.mongodb.net/test?retryWrites=true&w=majority"
MongoClient.connect(uri, function(err, client) {
   if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
   }
   console.log('Connected...');
});*/
/*
new way that does not work
const URI ="mongodb+srv://hossii:thisisthepw@cluster0-ulsyt.mongodb.net/test?retryWrites=true&w=majority";

const connectDB = async () => {
  await mongoose.connect(URI, {
    //useUnifiedTopology: true,
   useNewUrlParser: true 
  });
  console.log('db connected..!');
};
connectDB();
*/

/* //////// connectDB();
app.use(express.json({ extended: false }));
app.use('/api/userModel', require('./Api/User'));
const Port = process.env.Port || 3000;

app.listen(Port, () => console.log('Server started'));*/

//to here
//create a db





 /*
 /*este aqui é do segundo email. hossii2 account/  mongoose.connect("mongodb+srv://hossii:agorahossii@cluster0-cn6hz.mongodb.net/test?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  //cluster0-shard-00-00-cn6hz.mongodb.net:27017
  useCreateIndex: true
 }).then(() => {
   console.log('connected to DB!');
 }).catch(err => {
   console.log('ERROR: ', err.message);
 });
*/





/*mongoose.connect("mongodb+srv://hossii:thisisthepw%401@cluster0-ulsyt.mongodb.net/test?retryWrites=true&w=majority"
,{useNewUrlParser: true}).then(() =>{
  console.log("connected to db");
} ).catch(err => {
  console.log("ERROR:", err.message);
});*/


//00

/*const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://hossii:thisisthepw%401@cluster0-ulsyt.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});*/

//00
//884 mongoose.connect("mongodb+srv://hossii:thisisthepw%401@cluster0-ulsyt.mongodb.net/test?retryWrites=true&w=majority");


/*
 const MongoClient = require('mongodb').MongoClient;
 const uri = "mongodb+srv://hossii:thisisthepw@cluster0-ulsyt.mongodb.net/test?retryWrites=true&w=majority";
 const client = new MongoClient(uri, { useNewUrlParser: true });
 
 mongodb+srv://hossii:<password>@cluster0-ulsyt.mongodb.net/test?retryWrites=true&w=majority
*/


/*const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://hossii:thisisthepw@cluster0-ulsyt.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});*/






app.use(expressSanitizer());
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); //to css also

app.use(methodOverride("_method"));

//seedDB(); 


 
//««««««««««««««««««««««passport configuration
app.use(require("express-session")({
  secret:"edson bey is creating this app",
  resave: false,
  saveUninitialized: false
}));

// users count 
var visitCounter = require('express-visit-counter');

app.use(visitCounter.initialize());
// users count 

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(require('express-title')());
app.set('title', '|| Hossii');
app.use(title());
// to user currentUser in many places
app.use(function(req, res, next){
  res.locals.currentUser =req.user;
  next();
  });




app.use(authenticationRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(postsRoutes);
app.use(accomodationRoutes);
app.use(yourNewsRoutes);







app.get("/letssee", async function(req, res, next){
  var visitCounter = require('express-visit-counter').Loader;
  let visitorsAltogether = await visitCounter.getCount();
let visitorsActivities = await visitCounter.getCount("/activities");
let visitorsPosts = await visitCounter.getCount("/posts");
let visitorsNews = await visitCounter.getCount("/yournews");
  try{
    res.send(`
    <b>visitors altogether:</b> ${visitorsAltogether}<br /><br />
    <b>In our main services:</b> <br />
    <b>visitors on activities section  :</b> ${visitorsActivities}<br />
    <b>visitors on Posts section :</b> ${visitorsPosts}<br />
    <b>visitors on News section :</b> ${visitorsNews}<br />

  
  `);
  } catch (err) {
    next(err);
  }
  

});


app.post("/letssee", async function(req, res){

  let visitorsAltogether = await visitCounter.getCount();
let visitorsActivities = await visitCounter.getCount("/activities");
let visitorsPosts = await visitCounter.getCount("/posts");
let all ={visitorsAltogether:visitorsAltogether, visitorsActivities:visitorsActivities, visitorsPosts:visitorsPosts };

ViewsPage.create(all, function(err, all){
    if(err){
        console.log(err);
    } else{
        console.log("=============");
        console.log(all);
    }
});
});






// PLEASE DON´T FORGET TO CREATE A CAMPGROUND_COMMENT ROUTE RSRSRSRSR 



var port = process.env.PORT || 3500;
app.listen(port, function(req, res){
console.log("Wey Edson, it is working, go on!")
});
