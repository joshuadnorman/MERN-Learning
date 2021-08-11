const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose"); //access db functions 
const user = mongoose.model("users"); //get user model 
const keys = require("../config/keys"); //to get secretOrKey 

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); 
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts,(jwt_paylod,done) => {
            User.findById(jwt_paylod.id).then((user) =>{
                if (user){
                    return done(null,user)
                }
                return done(null,false) 
            })
            .catch((error) =>{
                console.log(error);
            })
        })
    )
}