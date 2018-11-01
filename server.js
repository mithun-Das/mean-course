const express = require('express');
const app = express();
const port = process.env.PORT || 3000 ;

const mongoose = require("mongoose");

var bodyParser = require('body-parser');

const Post = require('./backend/models/post.js');

mongoose.connect("mongodb://localhost:27017/node-angular")
.then(() => {
    console.log("Server is now connected");
})
.catch((err) => {
    console.log("Connection failed : ",err);
});

app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin , X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    next();
});


app.listen(port, () => {
    console.log("Connect to port : ", port);
});

//require('./backend/app.js');

app.use(bodyParser.json());

app.get("/data", (req, res, next) => {
    res.send("Congrats!!!");
});


app.post("/api/posts", (req,res,next) => {

    const post = new Post({
        title : req.body.title,
        content : req.body.content
    });

    post.save().then((response) => {
        res.status(201).json({
            message : "Data inserted successfully",
            data : response
        });    
    }).catch((err) => {
        res.status(400).json({
            message : "Failed to inserted"
        });    
    });

});

app.get("/api/posts", (req, res) => {

    Post.find().then((documents) => {
        res.status(200).json({

            message : "Server sent you the response",
            posts : documents
        });

    }).catch((err) => {
        res.status(400).send("Something wrong happened");
    });

});

app.delete("/api/posts/:id", (req, res, next) => {

    Post.deleteOne({_id : req.params.id}).then(result => {
        res.status(200).json({ message : "Post Deleted !!!", status : "success" });
    }).catch((err) => {
        res.status(400).json({ message : "Something went wrong", status : "failure" });
    });
});