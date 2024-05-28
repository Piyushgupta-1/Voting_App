const express = require("express");
const user_route = express();
const controller = require("../controllers/userController");
const bodyParser = require("body-parser");
config = require("../config/config");
const session = require("express-session");

user_route.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
}));

user_route.set("view engine", "ejs");
user_route.set("views", "./views/users")

user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));

user_route.get("/register", controller.showRegister);

user_route.post("/register", controller.addUser);

user_route.get("/", controller.showLogin);

user_route.get("/login", controller.showLogin);

user_route.post("/login", controller.verifyLogin);

user_route.get("/home", controller.votingPage);

user_route.post("/home", controller.voteDashboard)

user_route.get("/logout", controller.userLogout);

module.exports = user_route;