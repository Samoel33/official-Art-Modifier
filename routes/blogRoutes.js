const express = require("express");
const multer = require("multer");

const blogRoute = express.Router();
const viewController = require("../controller/viewController");
const blogController = require('../controller/blogController');
const { isLoggedIn, protect, loggedIn } = require("../controller/authController");


blogRoute.route('*').get(isLoggedIn);
blogRoute.route("/create-blog").get(loggedIn, viewController.blogForm);
blogRoute.route('/blogs/:id').get(loggedIn, viewController.blogId);
blogRoute.route('/blogs/:id/comments').get(viewController.comment);
blogRoute.route("/blogs/createBlog").post(isLoggedIn, blogController.uploadBlogCover, blogController.createBlog);
blogRoute.post('/blogs/:id/comment', blogController.addComment);
blogRoute.delete('/blogs/:id', protect, isLoggedIn, blogController.deletePost);


module.exports = blogRoute;