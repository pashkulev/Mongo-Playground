const mongoose = require("mongoose");

// const connectionString = "mongodb://localhost:27017/mongo_playground";
const connectionString = "mongodb://pashkulev:abc123@ds247310.mlab.com:47310/mongo_playground";

module.exports = () => {
    mongoose.connect(connectionString).catch(err => console.log(err));

    let database = mongoose.connection;

    database.once("open", (err) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log("Connected!");
    });

    database.on("error", err => {
        console.log(err);
    });

    require("../models/ImageSchema");
    require("../models/TagSchema");
}