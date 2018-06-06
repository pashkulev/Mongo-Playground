const mongoose = require("mongoose");

let imageSchema = mongoose.Schema({
    imageUrl: {type: mongoose.Schema.Types.String, required: true, unique: true},
    imageTitle: {type: mongoose.Schema.Types.String, required: true},
    creationDate: {type: mongoose.Schema.Types.Date},
    description: {type: mongoose.Schema.Types.String},
    tags: [{type: mongoose.Schema.Types.String}]
});

module.exports = mongoose.model("Image", imageSchema);