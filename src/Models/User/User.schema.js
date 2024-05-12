const mongoose = require("mongoose");
const bcrypt= require("bcrypt");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:{
        type: String,
        maxLength: 50,
        required: true
    },
    company: {
        type: String,
        maxLength: 50,
        required: true
    },
    address: {
        type: String,
        maxLength: 100,
    },
    phone: {
        type: Number,
        maxLength: 10,
        required: true
    },
    email: {
        type: String,
        maxLength: 50,
        required: true
    },
    password: {
        type: String,
        minLength: 8,
        maxLength: 100,
        required: true
    },
    refreshJWT: {
        token: {
            type: String,
            maxLength: 500,
            default:""
        },
        addedAt: {
            type:   Date,
            required: true,
            default: Date.now()
        }
    }
})

UserSchema.pre('save', async function() {
    console.log(`this... ${this}`)
    this.password = await bcrypt.hash(this.password, 10)
    console.log(this.password)
  });

module.exports = {
    UserSchema: mongoose.model("user", UserSchema)
}