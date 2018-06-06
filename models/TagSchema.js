const mongoose = require("mongoose");

let tagSchema = mongoose.Schema({
    name: {type: mongoose.Schema.Types.String, required: true, unique: true},
    creationDate: {type: mongoose.Schema.Types.Date},
    images: [{type: mongoose.Schema.Types.ObjectId, ref: "Image"}]
});

tagSchema.virtual("lowercaseName").get(function() {
    return this.name.toLowerCase();
});

module.exports = mongoose.model("Tag", tagSchema);