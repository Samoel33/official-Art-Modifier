const multer = require("multer");
const jwt = require("jsonwebtoken");
const BlogComment = require("../models/comment");
const Blog = require("../models/blog");
const User = require("../models/user");


const AppError = require("../utils/appError");
const catchAsync = require('../utils/catchAsync');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/img/blogCover/");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `${file.fieldname}-${Date.now().toLocaleString()}.${ext}`);
    }
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError('Not an Image please upload images only', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    filter: multerFilter,
})
exports.uploadBlogCover = upload.single("photo");

exports.blogs = catchAsync(async(req, res, next) => {
    await Blog.find()
        .sort({ createdAt: -1 })
        .populate({ path: "user" })
        .populate({ path: "comments", populate: { path: "user" } })
        .then((results) => {
            console.log(results);
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
            res.redirect("/artmodifiers/home");
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
        res.status(200).json({
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
                res.status(200).json({
                    status: "success",
                    message: "comments fetched succesfully😀",
                    results,
                });
            }
        });
});
exports.addComment = catchAsync(async(req, res, next) => {
    const id = req.params.id;
    const token = req.cookies.jwt;
    if (token) {
        await jwt.verify(token, `${process.env.JWT_SECERET_KEY}`, async(err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                res.redirect('/artmodifiers/login');
            } else {
                let user = await User.findById(decodedToken.id);
                if (user) {
                    const newComment = new BlogComment({
                        text: req.body.text,
                        blog: id,
                        user: user.id,
                    });
                    await newComment.save();
                    const postRelated = await Blog.findById(id);
                    // push the comment into the post.comments array
                    postRelated.comments.push(newComment._id);
                    // save and redirect...
                    await postRelated.save(function(err) {
                        if (err) {
                            console.log(err);
                        }
                        console.log(req.originalUrl.slice(0, -8))
                        req.body.text = '';
                        res.redirect(req.originalUrl.slice(0, -8));
                    });
                }
            }

        })
    }
});
exports.createBlog = catchAsync(async(req, res, next) => {
    const id = req.params.id;
    const token = req.cookies.jwt;
    if (req.file) {
        if (token) {
            await jwt.verify(token, `${process.env.JWT_SECERET_KEY}`, async(err, decodedToken) => {
                if (err) {
                    res.locals.user = null;
                    res.redirect('artmodifiers/login');
                } else {
                    let user = await User.findById(decodedToken.id).select('blogs');
                    const blog = new Blog({
                        title: req.body.title,
                        snippet: req.body.snippet,
                        body: req.body.body,
                        photo: req.file.filename,
                        user: user.id,
                    });
                    await blog.save();
                    if (user) {
                        const blogAD = user.blogs.push(blog);
                        user.save(blogAD, function(err) {
                            if (err) {
                                console.log(err);
                            } else {

                                res.redirect('/artmodifiers/blogs');
                            }
                        })
                    }
                }
            });
        }

    } else {
        const id = req.params.id;
        if (token) {
            await jwt.verify(token, `${process.env.JWT_SECERET_KEY}`, async(err, decodedToken) => {
                if (err) {
                    res.locals.user = null;
                    res.redirect('/artmodifiers/login');
                } else {
                    let user = await User.findById(decodedToken.id).select('blogs');
                    const blog = new Blog({
                        title: req.body.title,
                        snippet: req.body.snippet,
                        body: req.body.body,
                        photo: "favicon1.png",
                        user: user.id,
                    });
                    await blog.save();
                    if (user) {
                        const blogAD = user.blogs.push(blog);
                        user.save(blogAD, function(err) {
                            if (err) {
                                console.log(err);
                            } else {

                                // res.json({ status: "success" })
                                res.status(200).redirect('/artmodifiers/blogs');
                            }
                        })
                    }
                }
            });
        }
    }
});


exports.deletePost = catchAsync(async(req, res, next) => {
    token = req.cookies.jwt;
    if (token) {
        await jwt.verify(token, `${process.env.JWT_SECERET_KEY}`, async(err, decodedToken) => {
            let user = await User.findById(decodedToken.id).populate({ path: "blogs" });
            let blogID;
            console.log(user.blogs.length);
            if (user.blogs.length > 0) {
                user.blogs.forEach(async blog => {
                    blogID = blog.id;
                    if (blogID === req.params.id) {
                        console.log('we have a match to delete');
                        const blog = await Blog.findByIdAndDelete({
                            _id: req.params.id,
                        }).then(() => {
                            res.status(204).json({
                                status: "success",
                            })
                        });
                    } else {
                        return next(
                            new AppError("You are not authorised to delete this blog, User owned Blog can be deleted", 401));
                    }
                })
            } else {
                return next(
                    new AppError("You are not authorised to delete this blog, User owned Blog can be deleted", 401));
            }
        });
    }
});