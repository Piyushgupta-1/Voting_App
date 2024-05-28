const express = require("express");
const admin_route = express();
const controller = require("../controllers/adminController");
const bodyParser = require("body-parser");
config = require("../config/config");
const session = require("express-session");

admin_route.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
}));

admin_route.set("view engine", "ejs");
admin_route.set("views", "./views/admins")

admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));

admin_route.get("/home", controller.adminHome);

module.exports = admin_route;