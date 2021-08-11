const Validator = require("validator");
const isEmpty = require("is-empty");


module.exports = function validateRegisterInput(data){
    let errors = {};

    // Convert empty fields to an empty string so we can use Validator functions
    data.name = !isEmpty(data.name) ? data.name : ""
    data.password = !isEmpty(data.password) ? data.password : ""
    data.password2 = !isEmpty(data.password2) ? data.password2 : ""
    data.email = !isEmpty(data.email) ? data.email : ""

    //Name Checks
    if (Validator.isEmpty(data.name)){
        errors.name = "Name field is required"
    }

    //Email Checks
    if (Validator.isEmpty(data.email)){
        errors.email = "email field is required"
    } else if (!Validator.isEmail(data.email)){
        errors.email = "Not a valid email address"
    }

    //Password Checks
    if (Validator.isEmpty(data.password)){
        errors.password = "Password is required"
    }
    if (Validator.isEmpty(data.password2)){
        errors.password2 = "Confirm Password is required"
    }

    if (!Validator.isLength(data.password,{min:6,max:30})){
        errors.password = "Password must be between 6 and 30 characters"
    }

    if (!Validator.equals(data.password,data.password2)){
        errors.password2 = "Passwords must be identical"
    }

    return{
        errors,
        isValid: isEmpty(errors) //return valid if no errors are added
    }
}