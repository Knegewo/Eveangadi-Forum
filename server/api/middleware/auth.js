//this comes for the frontend that does the authontication 

const jwt = require("jsonwebtoken");
require("dotenv").config();


const auth = (req, res, next) => {
    try {
        const token = req.header("x-auth-token"); //this token comes from frontend 
        if (!token)
            return res
                .status(401)
                .json({ msg: "No authentication token, authorization denied." });

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        // if there is a token verify by using secret key. conlose log shows token time created and exire
        console.log(verified);
        if (!verified)
            return res
                .status(401)
                .json({ msg: "Token verification failed, authorization denied." });

        req.id = verified.id;
        next(); //it login after verificaton it goes to getuseerbyin in user.control.js
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = auth;