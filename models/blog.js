const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const blogSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is a requirement"],
        unique: true,
    },
    snippet: {
        type: String,
        required: [true, "snippet is a requirement"],
        unique: true,
    },
    body: {
        type: String,
        required: [true, "body is a requirement"],
    },
    photo: {
        type: String,
        default: "favicon1.png",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comments",

    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },

}, { timestamps: true });
blogSchema.virtual('url').get(function() {
    return '/blog/' + this._id
});

const Blog = mongoose.model("Blogs", blogSchema);
module.exports = Blog;