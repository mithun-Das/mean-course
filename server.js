const express = require('express');
const app = express();
const port = process.env.PORT || 3000 ;

const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const multer = require("multer");

const MIME_TYPE_MAP = {
    'image/png' : 'png',
    'image/jpeg' : 'jpg',
    'image/jpg' : 'jpg'
};

const Post = require('./backend/models/post.js');
const storage = multer.diskStorage({

    destination : (req, file, cb) => {
        var isValid = MIME_TYPE_MAP[file.mimetype];
        var error = new Error("Invalid mime type");

        if(isValid) { error = null ; }

        cb(error,"backend/images");
    },
    filename : (req,file,cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('_');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '_' + Date.now() + '.' + ext);
    }
});


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
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
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


app.post("/api/posts", multer({storage : storage}).single("image") ,(req,res,next) => {

    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        title : req.body.title,
        content : req.body.content,
        imagePath : url + "/images/" + req.file.filename
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

app.post("/post", (req,res,next) => {

    var obj = {};

    if(req.body.id) { obj._id = req.body.id; } 
    if(req.body.title) { obj.title =  req.body.title; } 
    if(req.body.content) { obj.content = req.body.content; }     

    Post.find(obj).then((response) => {
        res.status(200).send(response);
    }).catch((err) => {
        res.status(400).send(err);
    });
});


app.put("/api/posts/:id", (req,res,next) => {
    
    const post = new Post({
        _id : req.params.id,
        title : req.body.title,
        content : req.body.content,
    })

    Post.updateOne({_id : req.params.id}, post).then((response) => {
        res.status(200).json({
            message : "Updated succesfully",
            data : post
        });
    }).catch((err) => {
        res.status(400).json({
            message : "Something went wrong",
            data : []
        });

    });
});

app.delete("/api/posts/:id", (req, res, next) => {

    Post.deleteOne({_id : req.params.id}).then(result => {
        res.status(200).json({ message : "Post Deleted !!!", status : "success" });
    }).catch((err) => {
        res.status(400).json({ message : "Something went wrong", status : "failure" });
    });
});