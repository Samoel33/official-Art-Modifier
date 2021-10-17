const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const comments = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },

    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blogs",
    },
    text: {
        type: String,
        required: true,

    },
    date: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });


const BlogComment = mongoose.model("Comments", comments)
module.exports = BlogComment;