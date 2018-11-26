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
app.use(express.static(__dirname));
app.use("/images", express.static(path.join("backend/images")));

app.post("/login", userController.userLogin);

app.post("/signup", userController.userSignup);

app.get("/posts", checkAuth, postController.getPosts);

app.post("/post/create", checkAuth, extractFile, postController.insertPost);

app.post("/post", postController.getPostInfo);

app.put("/post/update/:id", checkAuth, extractFile, postController.updatePost);

app.delete("/post/delete/:id", checkAuth, postController.deletePost);

app.get("/*", (req,res) => {

    res.sendFile(path.join(__dirname+'/dist/index.html'));
});

app.get("/test", (req,res,next) => {
    res.status(200).send("Congratz");
});