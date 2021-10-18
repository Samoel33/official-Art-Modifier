const multer = require("multer");
const jwt = require("jsonwebtoken");
//const sharp = require('sharp');
const User = require("../models/user");

const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/img/userImage/");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
    },
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(new AppError("Not an Image please upload images only", 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    filter: multerFilter,
});
exports.uploadPp = upload.single("photo");
// exports.resizeUserPhoto = catchAsync(async(req, res, next) => {
//     if (!req.file) return next();

//     req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

//     await sharp(req.file.buffer)
//         .resize(500, 500)
//         .toFormat("jpeg")
//         .jpeg({ quality: 90 })
//         .toFile(`public/img/userImage/${req.file.filename}`);

//     next();
// });
const signToken = id => {
    return jwt.sign({ id }, `${process.env.JWT_SECERET_KEY}`, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
}
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_EXPIRES_COOKIE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === "production") {
        cookieOptions.secure = true;
    }
    res.cookie("jwt", token, cookieOptions);
    user.password = undefined;
    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user
        }
    });
};


exports.signUp = catchAsync(async(req, res, next) => {
    const newUser = await User.create({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        photo: "default.jpg",
    });
    createSendToken(newUser, 201, res);


});
exports.login = catchAsync(async(req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new AppError("Please provide email and password!", 400));
    }
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select("+password");
    //const correct = await user.correctPassword(password, user.password)

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("Incorrect email or password", 401));
    }

    createSendToken(user, 200, res);
});

exports.logout = catchAsync(async(req, res, next) => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.redirect("/artmodifiers/login");
});

exports.getMe = catchAsync(async(req, res, next) => {
    if (req.cookies.jwt) {
        await jwt.verify(req.cookies.jwt, `${process.env.JWT_SECERET_KEY}`, async(err, decodedToken) => {
            if (!err) {
                let user = await User.findById(decodedToken.id).populate({ path: "blogs", });
                if (user) {
                    blogs = user.blogs;
                    res.status(200).render("myAccount", {
                        title: "My Account",
                        blogs,
                    });
                }
            } else {
                return next(
                    new AppError(
                        "Please login before viewing user account info!",
                        400
                    )
                );
            }
        });
    } else {

        return next(new AppError("Please login before viewing user account info!", 400));
    }
});

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};
exports.updateMe = catchAsync(async(req, res, next) => {
    console.log(req.user);
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                "This route is not for password updates. Please use /updateMyPassword.",
                400
            )
        );
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, "userName", "email");
    if (req.file) filteredBody.photo = req.file.filename;

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: "success",
        data: {
            user: updatedUser,
        },
    });
});