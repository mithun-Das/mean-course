const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require('./../models/user.js');

exports.userLogin = (req,res,next) => {
    
    var fetchedUser ;

    User.findOne({ email  : req.body.email}).then((user) => {
        if(!user){
            res.status(401).send({
                message : "Authentication Failed !!!"
            });
        }else {
            
            fetchedUser = user;
            return  bcrypt.compare(req.body.password , user.password);
        }
    }).then((result) => {
        if(!result) {
            res.status(401).json({
                message : "Authentication Failed !!!"
            });
        }else {
            const token = jwt.sign({email : fetchedUser.email , userId : fetchedUser._id}, "secret_this_should_be_longer",
                {
                expiresIn : "1h"
            });

            res.status(200).json({
                token : token,
                expiresIn : 3600,
                userId : fetchedUser._id
            });
        }
    }).catch((err) => {
        res.status(401).json({
            message : "Authentication Failed !!!"
        });
    });
}

exports.userSignup =  (req,res,next) => {
    
    bcrypt.hash(req.body.password , 10).then(function(hashedPassword)  {
        
        var user = new User({
            email : req.body.email,
            password : hashedPassword
        });
        
        user.save().then(response => {
            res.status(201).json({
                message : "User created!!!",
                result : response
            });
        }).catch((err) => {
            res.status(500).json({
                message : "User Creation Failed",
                error : err
            });
        })
    }).catch((err) => {
        console.log(err);
    });
}