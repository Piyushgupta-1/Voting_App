const User = require("../models/userModel");
const bcrypt = require("bcrypt");

// Password hasing and salting
const securePassword = async(password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message)
    }
}

const showRegister = async(req, res) => {
    try {
        res.render("registration");
    } catch (error) {
        console.log(error.message);
    }
}

const addUser = async(req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            return res.render("registration", { errorMessage: "Email already registered"});
        }

        const spassword = await securePassword(req.body.password);

        const user = User({
            username: req.body.username,
            password: spassword,
            email: req.body.email,
            mobile: req.body.mobile,
            role: req.body.role
        });

        await user.save();
        // res.render("registration", {successMessage: "You have successfully registered"});
        res.redirect("/login");
           
    } catch (error) {
        res.render("registration", { errorMessage: "Your registration has failed"});
        console.log(error.message);
    }
}

const showLogin = async(req, res) => {
    try {
        res.render("login");
    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async(req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        const userData = await User.findOne({username:username});

        if(userData) {
            const matchPassword = await bcrypt.compare(password, userData.password);
            if(matchPassword){
                if(userData.role === "admin") {
                    req.session.user_id = userData._id;
                    res.redirect("../admin/home")
                }
                res.redirect("/home");
            } else {
                res.render("login", {message: "Username and password is incorrect"});
            } 
        } else {
            res.render("login", {message: "Username and password is incorrect"});
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

const votingPage = async(req, res) => {
    try {
        if(!req.session.user_id) {
            return res.redirect("/login");
        }

        // Check if user has already voted
        const user = await User.findById(req.session.user_id);
        if (user.isVoted) {
            res.render("vote-dashboard", {message: "You have already voted"});
        }

        // If user hasn't voted, render the voting
        res.render("home");
    } catch (error) {
        console.log(error.message);
    }
}

const voteDashboard = async(req, res) => {
    try {
        if(!req.session.user_id) {
            return res.redirect("/login");
        }
        const user = await User.findById(req.session.user_id);
        if(user.isVoted) {
            return res.render("home", {message: "You have already voted"});
        }
        // Update user's vote
        user.isVoted = true;
        await user.save();
        res.render("home", {vmessage: "Vote submitted successfully"});
    } catch (error) {
        console.log(error.message);
    }
}
    
const userLogout = async(req, res) => {
    try {
        req.session.destroy();
        res.redirect("/");
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    showRegister,
    addUser,
    showLogin,
    verifyLogin,
    votingPage,
    voteDashboard,
    userLogout

}