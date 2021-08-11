//this will be used to append the auth header of our axios requests to our backend , to determine whether the user is logged in or not 
import axios from 'axios';

const setAuthToken = token => {
    if (token){
        // Apply authorization token to every request if logged in
        axios.defaults.headers.common["Authentication"] = token;
    } else {
        //Remove authentication headers if the user is not logged in 
        delete axios.default.headers.common["Authentication"];
    }
}

export default setAuthToken;