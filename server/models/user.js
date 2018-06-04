var { mongoose } = require("./../db/mongoose");

var User = mongoose.model("User", {
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    }
});

module.exports = {
    User
}