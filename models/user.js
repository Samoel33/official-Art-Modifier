const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const users = new Schema({
    userName: {
        type: String,
        required: [true, "User Name is a requirement"],
        unique: [true, "User Name already taken"],
    },
    email: {
        type: String,
        unique: [true, "email already registered, please login"],
        lowercase: true,
        validate: [validator.isEmail, "please provide a valid email"],
    },
    photo: {
        type: String,
        default: "default.jpg",
    },
    password: {
        type: String,
        minlength: [8, "password must be 8 char long"],
        required: [true, "please provide password"],
        select: false,
    },
    passwordConfirm: {
        type: String,
        minlength: 8,
        required: [true, "please provide password"],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function(el) {
                return el === this.password;
            },
            message: "Passwords are not the same!",
        },
    },
    blogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blogs",
    }, ],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comments",
    }, ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
}, { timestamps: true });

users.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();
})

users.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// users.statics.login = async function(email, password) {
//     const user = await this.findOne({ email })
//     console.log(user);
//     if (user) {
//         user.select("+password");
//         const auth = await bcrypt.compare(password, user.password);
//         if (auth) {
//             return user;
//         }
//     }
// }

const User = mongoose.model("Users", users);

module.exports = User;