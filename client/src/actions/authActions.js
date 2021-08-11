import axios from 'axios'; //make httprequests
import setAuthToken from '../utils/setAuthToken'; 
import jwtDecode from 'jwt-decode'; //Decode json web tokens

import {
    GET_ERRORS,
    SET_CURRENT_USER,
    USER_LOADING
} from '../actions/types';


//Call register user from backkend
export const constRegisterUser = (userData,history) => dispatch => {
    axios.post("api/users/register",userData)
        .then(res=>history.push("/login")) //then is called if register successful , then we will redirect to the login page ---res=successful MCMR
        .catch(err=>dispatch({ // this will be called if the register fails or has any errors - same difference ---err=error MCMR
            type: GET_ERRORS,
            payload: err.response.data
        })
        );
};
//Authenticate user , 
export const loginUser = userData => dispatch =>{
    axios.post("/api/users/login",userData).then(
        res=>{
            //Save token to local storage
            const {token} = res.data; // stuff like this can also be written res.data.token, we are declaring const and access val same time  --MCMR
            //a not on this above , our api in users.js returns the data with token in it , it is not a thumb suck , this is what we defined it as , we  
            //could even define it smellycunt if we want to , as long as we reference/access it as what we return it as from the API(Backend)

            localStorage.setItem("jwtToken",token); // Locally store our authentication as jwtToken -- Key value pair 

            setAuthToken(token) //set the auth token to the header , we export a function in setAuthToken that expects the jwtToken
            //here we do not care about parameter/variable names , it will accept what we give it and throw a fuckup if it doesn't worth 

            //Now we need to decode our token to get the data in it , since we signed it in our login function (API Function)

            const decode = jwtDecode.decode(token); //this will extract the logged in users data 
            
            dispatch(setCurrentUser(decode))
        }
    )
    .catch( //we handle fuckups here 
        err=>dispatch({
            type:GET_ERRORS,
            payload:err.response.data
        })
    ) 
}

export const setCurrentUser = decoded /*Parameter name doesnt matter , we call it from line 38*/ => {
    return {
        type: SET_CURRENT_USER,
        payload : decoded //this is the ALREADY DECODED user data 
    };
};

export const setUserLoading = () => {
    return {
        type: USER_LOADING
    };
};

//log user out 
export const logoutUser = () => {
    //Remove token from local storage
    localStorage.removeItem("jwtToken");
    //remove auth header for future requests , we do not want users doing things when they are not authenticated 
    setAuthToken(false); //set auth token receives a paramater , it will pass if either we send through valid token OR true , but true will cause shit because we cant 
    //set the authentication header to just true 
    // Set current user to empty object {} which will set isAuthenticated to false
    dispatch(setCurrentUser({})); //set current user will receive this as the decoded parameter and therefore set the payload to an emnpty object i.e no user 
}