const express = require('express');
const app = express();
const port = process.env.PORT || 3000 ;

const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const path = require("path");

const checkAuth = require("./backend/middleware/check-auth");
const userController = require('./backend/controllers/user.js');
const postController = require('./backend/controllers/post.js');
const extractFile = require('./backend/middleware/file');

mongoose.connect("mongodb://localhost:27017/node-angular")
.then(() => {
    console.log("Server is now connected");
})
.catch((err) => {
    console.log("Connection failed : ",err);
});

app.listen(port, () => {
    console.log("Connect to port : ", port);
});

app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
});

app.use(bodyParser.json());
app.use("/images", express.static(path.join("backend/images")));

app.post("/login", userController.userLogin);

app.post("/signup", userController.userSignup);

app.get("/api/posts", checkAuth, postController.getPosts);

app.post("/api/posts", checkAuth, extractFile, postController.insertPost);

app.post("/post", postController.getPostInfo);

app.put("/api/posts/:id", checkAuth, extractFile, postController.updatePost);

app.delete("/api/posts/:id", checkAuth, postController.deletePost);