const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const adminHome = async(req, res) => {
    try {
        const voteCounts = await User.aggregate([
            {
                $group: {
                    _id: "$candidate",
                    count: {$sum: 1}
                }
            }
        ]);
        res.render("home", {voteCounts});
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    adminHome
}