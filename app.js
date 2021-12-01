const express= require("express");
const bodyParser = require("body-parser");
const mongoose= require("mongoose");
const _ =require("lodash");
// const date= require(__dirname + "/date.js");


const app = express();

// As data is temporaryly being stored we'll add mongoose here 
// const items= [];
// const workItems=[];

// to use ejs
app.set('view engine', 'ejs');

//to use body-bodyParser
app.use(bodyParser.urlencoded({extended:true}));

// to access css/imges
app.use(express.static("public"));

//1. connection url
mongoose.connect("mongodb://localhost:27017/todolistDB");
//2. item SChema
const itemsSchema = {
  name: String
};
//3. Mongoose model
const Item = mongoose.model("Item",itemsSchema);

// new documents 
const item1 = new Item({
  name:"Welcome to your ToDO-list!"
});
const item2 = new Item({
  name:"Hit the + button to add a new item."
});
const item3 = new Item({
  name:"<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

const listSchema ={
   name: String,
   items: [itemsSchema]
};

const List= mongoose.model("List",listSchema);

// Item.insertMany(defaultItems,function(err){
//   if(err){
//     console.log(err);
//   }else{
//     console.log("items inserted in db!")
//   }
// });


app.get("/", function(req,res){
  // const day= date.getDate();

  Item.find({},function(err, foundItems){
    
    if(foundItems.length === 0){
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }else{
          console.log("items inserted in db!")
        }
});
res.redirect("/");
    } else{
      res.render("list",{ listTitle: "Today", newListItems: foundItems});
    }
  });



});

app.get("/:customListName", function(req,res){
    const customListName =_.capitalize(req.params.customListName);

    List.findOne({name:customListName},function(err,foundList){
      if(!err){
        if(!foundList){
          // Create a new list
          const list = new List({
            name: customListName,
            items: defaultItems
          });

           list.save();
           res.redirect("/" + customListName);

        }else{
          // Show an existing list
          res.render("list", { listTitle: foundList.name, newListItems: foundList.items})
        }
      }
    });

});

app.post("/",function(req,res){

  // console.log(req.body);
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name:itemName
  });

  if(listName === "Today"){
    item.save();
    res.redirect("/");
  }else{
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
  

  // if(req.body.list === "Work"){
  //   workItems.push(item);
  //   res.redirect("/work");
  // }else{
  //   items.push(item);
  //   res.redirect("/");
  // }

});

//new route for deleted items
app.post("/delete",function(req,res){
  const checkedItemId =req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "Today"){
    Item.findByIdAndRemove(checkedItemId,function(err){
      if(!err){
        console.log("Successfully deleted checked item.");
        res.redirect("/");
      };
    });

  }else{
    List.findOneAndUpdate({name: listName},{$pull: {items:{_id:checkedItemId}}}, function(err, foundList){
      if(!err){
        res.redirect("/" + listName);
      }
    });
  }


});

// app.get("/work",function(req,res){
//   res.render("list",{listTitle: "Work List", newListItems: workItems});
// });

app.get("/about",function(req,res){
  res.render("about");
});



app.listen(4004,function(){
  console.log("Server is up on port 4004");
});
