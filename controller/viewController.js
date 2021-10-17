const Blog = require("../models/blog");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.signUp = (req, res, next) => {
    res.status(200).render("signUp", { title: "Register Your Account" });
};
exports.login = (req, res, next) => {
    res.status(200).render("login", {
        title: "Login to your Account",
    });
};
exports.blogs = catchAsync(async(req, res, next) => {
    await Blog.find()
        .sort({ createdAt: -1 })
        .populate({ path: "user" })
        .populate({ path: "comments", populate: { path: "user" } })
        .then((results) => {
            if (!results) {
                res.redirect("/artmodifiers/blog/blogs");
            }
            if (results) {
                res.status(200).render("blog", {
                    status: "success",
                    results,
                });
            }
        })
        .catch((e) => {
            res.redirect("/home");
        });
});
exports.blogForm = (req, res, next) => {
    res.status(200).render("createBlog", {
        title: "create Blog",
    });
};
exports.blogId = catchAsync(async(req, res, next) => {
    const blog = await Blog.findOne({ _id: req.params.id })
        .populate({
            path: "user",
        })
        .populate({ path: "comments", populate: { path: "user", model: "Users" } });
    if (!blog) {
        return next(new AppError("there is no blog with such id", 404));
    }
    if (blog) {
        res.status(200).render("blogId", {
            status: "success",
            message: "blog fetched successfully",
            blog,
        });
    }
});
exports.comment = catchAsync(async(req, res, next) => {
    await BlogComment.find()
        .sort({ createdAt: -1 })
        .then((results) => {
            if (results) {
                console.log(results);
                res.status(200).render("commentForm", {
                    results,
                });
            }
        });
});