const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const connectionString = "mongodb://pashkulev:abc123@ds247310.mlab.com:47310/mongo_playground";

module.exports = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(connectionString)
            .catch(err => reject(err));

        let database = mongoose.connection;
    
        database.once("open", (err) => {
            if (err) {
                reject(err);
            }
    
            console.log("Connected!");
            resolve();
        });
    
        database.on("error", err => {
            reject(err);
        });
    
        require("../models/ImageSchema");
        require("../models/TagSchema");
    });
}