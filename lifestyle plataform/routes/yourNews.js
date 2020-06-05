var express = require("express");
var router = express.Router();
var YourNews = require("../models/yourNews");
var Posts = require("../models/Posts");
var Campgrounds = require("../models/campground");


 router.get("/yournews", function(req, res){
  
  if(req.query.search){
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    YourNews.find({"title": regex}, function(err, news){
      if(err){
        console.log(err);
      }
      else{
      res.render("resultNews",{news:news});
      }
    });
  } else{ 
  


  YourNews.find({}, function(err, news){

    if(err){
      console.log(err);
    } else{
      //for first section
      YourNews.find({"Category":"Fashion"}, function(err, Fashion){
        if(err){
          console.log(err);
        } else{
            
          //second
          
            YourNews.find({"Category":"Money"}, function(err, Money){
              if(err){
                 console.log(err);
               } else{
                //terceiro
                  
                    YourNews.find({"Category":"Politics"}, function(err, Politics){
                       if(err){
                          console.log(err);
                        } else{
                          //quarto
                    
                              YourNews.find({"Category":"Sport"}, function(err, Sport){
                                if(err){
                                 console.log(err);
                               } else{
                                  //quinto
                                    
                                      YourNews.find({"Category":"Famous"}, function(err, Famous){
                                       if(err){
                                        console.log(err);
                                        } else{
                                            //sexto
                                            YourNews.find({"Category":"Society"}, function(err, Society){
                                              if(err){
                                               console.log(err);
                                               } else{
                                                  //sexto
                                                    YourNews.find({"Category":"Technology"}, function(err, Technology){
                                                     if(err){
                                                      console.log(err);
                                                      } else{
                                                         //try getting breaking news feactures
                                                          YourNews.find({"Category":"Breaking News"}, function(err, Breaking){
                                                          
                                                          if(err){
                                                            console.log(err)
                                                          } else{
                                                            //opinion
                                                            //try getting breaking news feactures
                                                          YourNews.find({"Category":"Opinion"}, function(err, Opinion){
                                                          
                                                            if(err){
                                                              console.log(err)
                                                            } else{
                                                              res.render("yournews",{news, /*news*/ Fashion:Fashion, Money:Money, Politics:Politics, Sport:Sport, Famous:Famous, Society:Society, Technology:Technology,Breaking, Opinion});
                                                            }
      
                                                              });
                                                           //try to getting breaking news feactures
                                                            //opinion
                                                          }
    
                                                            });
                                                         //try to getting breaking news feactures
                                                        //
                                                      
            
                                                       }
                                                    });
                                            //fim sexto
                                                }
                                            });
                                            //fim sexto
            
                                        }
                                      });

                                  //fim quinto
            
                                }
                              });
         
                          //fim quarto
            
                       }
                    });
         
                //fim terceiro
            
              }
            });
         
          //end second

            
        }
        });
         //end for first section
    }
    });
  }
    });
    
    router.get("/yournews/new", isLoggedIn, function(req,res){
      res.render("newNews");
   
    });
    
    router.post("/yournews", function(req, res){
      /*var name= req.body.name;
      var image= req.body.image;
      var description = req.body.description;
      var lacation= req.body.location;
      
      var newTrans = {name:name, image:image, description:description,location:location, price:price}*/
      req.body.yournews.author = {
        id: req.user._id,
        username: req.user.username
      }
      YourNews.create(req.body.yournews, function(err, newsDone){
    if(err){
      console.log(err);
    } else{
      console.log(newsDone);
     res.redirect("/yournews");
    }
      });
    });

    /*YourNews.create({
      name:"bla bla bla",
      location:"bla bla",
      price:12,
      description:"bla vla fndsm"
    }, function(err, done){
       if(err){console.log(err);}
       else{console.log(done);}
    });*/

    /*for aleatory element lists*/


// show news


router.get("/yournews/:id", function(req, res){
// specific news
YourNews.findById(req.params.id, function(err, news){
  var category = news.Category;

  if(err){
    console.log(err);
    res.redirect("/yournews");
}  else{  

  //try as a louco
  YourNews.find({"Category":category}, function(err, moreNews){
    var allMix = moreNews;
    allMix = shuffle(allMix);
    if(err){
      console.log(err);
      res.redirect("/yournews");
  } else{
    
    res.render("eachNews",{news:news, allMix });
  //console.log(news);
  }
    
  });
  //try as a louco
}
});
//

});


//show news end

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

  //midleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } 
  res.redirect("/login");
}

//searching engine
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};



    module.exports= router;







    
  



























/*router.get("/yournews/:id", function(req, res){
// specific news
YourNews.find({}, function(err, news){
  if(err){
    console.log(err);
    res.redirect("/yournews");
}  else{  

  //try as a louco
  YourNews.findById(req.params.id, function(err,allnews ){
    if(err){
      console.log(err);
      res.redirect("/yournews");
  } else{
    
    res.render("eachNews",{news:news, allNews });
  console.log(news);
  }
    
  });
  //try as a louco*/