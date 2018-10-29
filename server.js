const express = require('express');
const app = express();
const port = process.env.PORT || 3000 ;

const mongoose = require("mongoose");

var bodyParser = require('body-parser');

const Post = require('./backend/models/post.js');

mongoose.connect("mongodb+srv://Mithun:esu!0rtc8@cluster0-xnbba.mongodb.net/test?retryWrites=true")
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

    const posts = new Post({
        title : req.body.title,
        content : req.body.content
    });

    console.log(posts);

    res.status(201).json({
        message : "Data inserted successfully"
    });

});

app.get("/api/posts", (req, res) => {

    const posts = [
        {id: "1", title : "first title" , content : " First Server Response"},
        {id: "2", title : "second title" , content : " second Server Response"},
        {id: "3", title : "third title" , content : " third Server Response"}
    ];

    res.status(200).json({
        message : "Server sent you the response",
        posts : posts
    });

    res.send("Got it");
});

// module.exports = {
//     app : app
// }
