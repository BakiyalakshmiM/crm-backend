const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resetPinSchema = new Schema({
    pin:{
        type: Number,
        maxLength: 6,
        minLength: 6
    },
    email:{
        type: String,
        maxLength: 50,
        required: true
    },
    addedAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
})

module.exports = {
    ResetPinSchema : mongoose.model("ResetPin", resetPinSchema)
}