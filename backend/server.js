const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/node-angular";

const express = require('express');
const app = express();


const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const path = require("path");

const checkAuth = require("./middleware/check-auth");
const userController = require('./controllers/user.js');
const postController = require('./controllers/post.js');
const extractFile = require('./middleware/file');

app.listen( port, () => {
    console.log("Connected to port : ",  port);
});

mongoose.connect(mongoURI)
.then(() => {
    console.log("Mongo server is now connected");
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/images", express.static(path.join("backend/images")));
app.use("/", express.static(path.join(__dirname, "angular")));

app.post("/login", userController.userLogin);

app.post("/signup", userController.userSignup);

app.get("/posts", checkAuth, postController.getPosts);

app.post("/post/create", checkAuth, extractFile, postController.insertPost);

app.post("/post", postController.getPostInfo);

app.put("/post/update/:id", checkAuth, extractFile, postController.updatePost);

app.delete("/post/delete/:id", checkAuth, postController.deletePost);

app.get("/", (req,res) => {
    
    res.sendFile(path.join(__dirname, "angular", "index.html"));
});
    

app.get("/test", (req,res,next) => {
    res.status(200).send("Congratz");
});