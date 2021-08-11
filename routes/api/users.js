//Register Dependencies
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); //This encrypts passwords before we save them in our DB 
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const validateRegisterInput = require("../../validation/register")
const validateLoginInput = require("../../validation/login")
const User = require("../../models/User");
//Register Route
//@route POST api/users/register
//@desc Register User
//@access Public
router.post("/register",(req,res)=>{            //req is our request and res is our Response
    const {errors,isValid} = validateRegisterInput(req.body)  //Validate our request using the register validation script from earlier 
    //The variable is declared this way because this is the format which we return the data from register.js validation script 

    //Check if valid 
    if (!isValid){
        return res.status(400).json(errors);  //If not valid return invalid server status code and any errors
    }

    //If the input is valid we proceed to look for/add the user 
    //User is an exported model using mongoose schema , mongoose provides the .findOne so we can search 
    User.findOne({email:req.body.email}).then(user=>{
        if (user){
            return res.status(400).json({email:"E-mail already exists"}) //User is found therefore cannot REGISTER
        } else {
            const NewUser = new User({  //At this point the form is validated and we know we can proceed 
                email : req.body.email,  //Create a new User object to add to the db 
                password : req.body.password,
                name : req.body.name
            });
            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(NewUser.password,salt,(err,hash)=>{
                    if (err) throw err;
                    NewUser.password = hash;
                    NewUser.save() //Some kind of inbuilt function or what , no idea where it comes from , need to check 
                        .then(user=> res.json(user))
                        .catch(err=> console.log(err))
                })
            })
        }
    })

    
})

//@route POST api/users/register
//@desc Register User
//@access Public
router.post("/login",(req,res)=>{            //req is our request and res is our Response
    const {errors,isValid} = validateLoginInput(req.body)  //Validate our request using the login validation script from earlier 
    //The variable is declared this way because this is the format which we return the data from register.js validation script 

    //Check if valid 
    if (!isValid){
        return res.status(400).json(errors);  //If not valid return invalid server status code and any errors
    }

    const email = req.body.email; //To check for username 
    const password = req.body.password; //to hash and then check against our hashed password

    //Since it is login , we check whether the user exists , if the user does exist we continue through the code below the check , else we return the result
    //with an error and status 
    User.findOne({email}).then(user=>{
        if (!user){
            return res.status(400).json({emailnotfound:"Email Not Found"})
        } else {
            bcrypt.compare(password,user.password).then(isMatch => {
                if (isMatch){
                    //User matched, create jwt payload and return 
                    const payload = {
                        id:user.id,
                        name:user.name,
                    }
        
                    jwt.sign(payload,
                        keys.secretOrKey,
                        {expiresIn : 31556926}, //This is one year in seconds 
                        (err,token) => {
                            res.json({
                                success: true,
                                token: "Bearer "+token
                            })
                        }
                    )
                } else {
                    return res.status(400).json({passwordincorrect:"Password Incorrect"})
                }
            })
        }
    })

    //compare submitted password with the hashed password that we have in the request
    

    //if the password is a match , we sign the request 
    
})

module.exports = router;