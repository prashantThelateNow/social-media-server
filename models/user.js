const mongoose = require('mongoose');

const registerUserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    name:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    isAdmin:{
        type: Boolean,
        default: false
    }
},{timestamps: true});

const userLoginSchema = new mongoose.Schema({
   username:{
        type: String,
        required: true,
   },
   password:{
        type: String,
        required: true
    } 
});

/** Register user model creation */
const RegisterUser = mongoose.model('RegisterUser', registerUserSchema);

module.exports = { RegisterUser, userLoginSchema };