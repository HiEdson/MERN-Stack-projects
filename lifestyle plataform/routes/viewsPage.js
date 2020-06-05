var express = require("express");
var app = express();
var Translator = require("../models/views");

app.get("/letssee", function(req, res){
    res.send("good....");

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
