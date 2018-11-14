const express = require('express');
const app = express();
const port = process.env.PORT || 3000 ;

const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const multer = require("multer");
const path = require("path");

const Post = require('./backend/models/post.js');
const checkAuth = require('./backend/middleware/check-auth.js');

const userController = require('./backend/controllers/user.js');

const MIME_TYPE_MAP = {
    'image/png' : 'png',
    'image/jpeg' : 'jpg',
    'image/jpg' : 'jpg'
};

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
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
});


app.listen(port, () => {
    console.log("Connect to port : ", port);
});

app.use(bodyParser.json());
app.use("/images", express.static(path.join("backend/images")));

app.post("/api/posts", checkAuth, multer({storage : storage}).single("image") ,(req,res,next) => {

    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        title : req.body.title,
        content : req.body.content,
        imagePath : url + "/images/" + req.file.filename,
        creator : mongoose.Types.ObjectId(req.userData.userId)
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

app.get("/api/posts", checkAuth, (req, res) => {

    var pageSize = +req.query.pageSize ;
    var currentPage = +req.query.currentPage ;
    var postQuery = Post.find();
    var fetchedPosts;
    
    if(pageSize && currentPage) {
        postQuery.skip(pageSize * (currentPage - 1))
                 .limit(pageSize);
    }

    postQuery.then((documents) => {

       fetchedPosts = documents ;
       return Post.count(); 

    }).then((count) => {
        res.status(200).json({
            
            message : "Server sent you the response",
            posts : fetchedPosts,
            maxPosts : count
        }); 
    }).catch((err) => {
        res.status(400).send("Something wrong happened");
    });
});

app.post("/login", userController.userLogin);

app.post("/signup", userController.userSignup);

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


app.put("/api/posts/:id", checkAuth, multer({storage : storage}).single("image"), (req,res,next) => {

    let imagePath;

    if(req.file){
       const url = req.protocol + '://' + req.get("host"); ;
       imagePath = url + "/images/" + req.file.filename;  
    }

    const post = new Post({
        _id : req.params.id,
        title : req.body.title,
        content : req.body.content,
        imagePath : imagePath,
        creator : req.body.creator
    })

    Post.updateOne({_id : req.params.id, creator : req.userData.userId}, post).then((response) => {

        if(response.nModified > 0) {
            res.status(200).json({
                message : "Updated succesfully",
                data : post
            });    
        }else {
            res.status(401).json({
                message : "Not Authorized"});    
        }

    }).catch((err) => {
        res.status(400).json({
            message : "Something went wrong",
            data : []
        });

    });
});

app.delete("/api/posts/:id", checkAuth, (req, res, next) => {

    Post.deleteOne({_id : mongoose.Types.ObjectId(req.params.id), creator : mongoose.Types.ObjectId(req.userData.userId)}).then((result) => {
       if(result.n > 0){
            res.status(200).json({ message : "Post Deleted !!!", status : "success" });
       }else{
           res.status(401).json({ message : "Not Authorized !!!", status : "Fail" });
       }
    }).catch((err) => {
        res.status(400).json({ message : "Something went wrong", status : "failure" });
    });
});