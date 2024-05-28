const express = require("express");
const app = express();
const dataBase = require("./database");

// For user route
const userRoute = require("./routes/userRoute");
app.use("/", userRoute);

const adminRoute = require("./routes/adminRoute");
app.use("/admin", adminRoute);

app.listen(3000, () => {
    console.log("listening on port 3000");
});