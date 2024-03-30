const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.requireSignIn = async(req, res, next) => {
    try{
        //extract token first
        const token = req.header("Authorization").replace("Bearer ","");
        //if token missing return response
        if(!token) {
            return res.status(401).json({
                success: false,
                message:'Token is missing!!'
            })
        }
        //verifying token
        try{

            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log("payload: ",decode);
            //add user to request object
            req.user = decode;
            // Check for token expiration
            const currentTimestamp = Math.floor(Date.now() / 1000); // Get current time in seconds
            if (decode.exp && decode.exp < currentTimestamp) {
                return res.status(401).json({
                    success: false,
                    message: 'Token has expired!!'
                });
            }
            next();
        }
        catch(error) {
            console.log(error);
            return res.status(401).json({
                success: false,
                message:'Token is invalid!!'
            })
        }
    } catch(err) {
        return res.status(401).json({
            success: false,
            message:'Something went wrong while  validating the token'
        })
    }
}