const mongoose = require("mongoose")

const contactSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    }
})

const Contact =  mongoose.model("Contact", contactSchema);

module.exports = Contact;