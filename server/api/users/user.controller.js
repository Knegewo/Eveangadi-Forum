//controls the datas
const { register, userById, getUserByEmail, profile, getAllUsers } = require('./user.service');
const pool = require('../../config/database')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');//joson web token
require("dotenv").config();

//exporting all methods
module.exports = {
    createUser: (req, res) => {
        //these datas come from the frontend
        const { userName, firstName, lastName, email, password } = req.body;
        //validation 
        if (!userName || !firstName || !lastName || !email || !password)
            return res.status(400).json({ msg: 'Not all fields have been provided!' })
        if (password.length < 8)
            return res
                .status(400)
                .json({ msg: 'Password must be at least 8 characters!' })
        pool.query('SELECT * FROM registration WHERE user_email = ?',
            [email], //request body(eamil acc comes frontside )
            (err, results) => {
                if (err) {
                    return res
                        .status(err)
                        .json({ msg: "database connection err" })
                }
                if (results.length > 0) {
                    return res
                        .status(400)
                        .json({ msg: "An account with this email already exists!" });
                } else {
                    //password encryption                    
                    const salt = bcrypt.genSaltSync();
                    //changing the value of password from req.body with the encrypted password
                    req.body.password = bcrypt.hashSync(password, salt);

                    //sending data to register(in service.js) if there is an error it goes to the callback function in service file
                    register(req.body, (err, results) => {
                        if (err) {
                            console.log(err);
                            return res
                                .status(500)
                                .json({ msg: "database connection err" });
                        }
                        //before registration finish, we need to get the user_id from the database accessing through email
                        pool.query('SELECT * FROM registration WHERE user_email = ?',
                            [email],
                            (err, results) => {
                                if (err) {
                                    return res
                                        .status(err)
                                        .json({ msg: "database connection err" })
                                }
                                //adding user_id to req.body
                                req.body.userId = results[0].user_id;
                                console.log(req.body);

                                //sending data to profile with the user_id included in req.body
                                profile(req.body, (err, results) => {
                                    if (err) {
                                        console.log(err);
                                        return res
                                            .status(500)
                                            .json({ msg: "database connection err" });
                                    }
                                    return res.status(200).json({
                                        msg: "New user added successfully",
                                        data: results
                                    })
                                })
                            }
                        );
                    })
                }
            })
    },
//------------------------------------------------
    getUsers: ((req, res) => {
    getAllUsers((err, results) => {
        if (err) {
            console.log(err);
            return res
                .status(500)
                .json({msg: "database connection err"});
        }
        return res.status(200).json({ data: results })
    })
}
    ),
//------------------------------
    getUserById: (req, res) => {

        //getting req.id from auth middleware
        userById(req.id, (err, results) => {
            if (err) {
                console.log(err);
                return res
                    .status(500)
                    .json({ msg: "database connection err" })
            }
            if (!results) {
                return res.status(404).json({ msg: "Record not found" });
            }
            return res.status(200).json({ data: results })
        })
    },
    login: (req, res) => {

        //this is coming from frontend destructuring req.body
        const { email, password } = req.body;
        
        //validation- to make sure we have this user
        if (!email || !password)
            return res
                .status(400)
                .json({ msg: 'Not all fields have been provided!' })
        
        //sending data to check if email exist on our database (it comes from service.js)
    getUserByEmail(email, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({ msg: "database connection err" })
            }
            if (!results) {
                return res
                    .status(404)
                    .json({ msg: "No account with this email has been registered" })
            }

            //check provided password by the user with the encrypted password from database
            //complare the ecripted and regualr password. If is correct, it matches 
            const isMatch = bcrypt.compareSync(password, results.user_password);
            if (!isMatch)
                return res
                    .status(404)
                    .json({ msg: "Invalid Credentials" })
            
            //creating token for the signed user that expires in 1 hour and using our secret key for creation
            const token = jwt.sign({ id: results.user_id }, process.env.JWT_SECRET, { expiresIn: "1h" });

            //returning token and user-info
            return res.json({
                token,
                user: {
                    id: results.user_id,
                    display_name: results.user_name
                }
            })
        })
    }
}



