//controls the datas
const { register, userById, getUserByEmail, profile } = require('./user.service');

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

    }
}