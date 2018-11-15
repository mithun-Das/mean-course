const mongoose = require("mongoose");

const Post = require('./../models/post.js');


exports.insertPost =  (req,res,next) => {

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
};

exports.getPosts =  (req, res) => {

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
};

exports.getPostInfo = ((req,res,next) => {

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

exports.updatePost = (req,res,next) => {

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
        creator : req.userData.userId
    })

    Post.updateOne({_id : req.params.id, creator : req.userData.userId}, post).then((response) => {

        if(response.n > 0) {
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
};

exports.deletePost =  (req, res, next) => {

    Post.deleteOne({_id : mongoose.Types.ObjectId(req.params.id), creator : mongoose.Types.ObjectId(req.userData.userId)}).then((result) => {
       if(result.n > 0){
            res.status(200).json({ message : "Post Deleted !!!", status : "success" });
       }else{
           res.status(401).json({ message : "Not Authorized !!!", status : "Fail" });
       }
    }).catch((err) => {
        res.status(400).json({ message : "Something went wrong", status : "failure" });
    });
};