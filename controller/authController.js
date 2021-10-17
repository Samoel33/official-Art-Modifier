const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/user");
const AppError = require("../utils/appError");
const catchAsync = require('../utils/catchAsync');




exports.protect = catchAsync(async(req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {

        return next(
            new AppError("You are not logged in! Please log in to get access.", 401)
        );
    }

    // 2) Verification token
    const decoded = await jwt.verify(
        token,
        `${process.env.JWT_SECERET_KEY}`
    );
    console.log(decoded);
    // 3) Check if user still exists

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
        return next(
            new AppError(
                "The user belonging to this token does no longer exist.",
                401
            )
        );
    }

    // 4) Check if user changed password after the token was issued
    // if (currentUser.changedPasswordAfter(decoded.iat)) {
    //     return next(
    //         new AppError("User recently changed password! Please log in again.", 401)
    //     );
    // }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
});
exports.loggedIn = catchAsync(async(req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        await jwt.verify(token, `${process.env.JWT_SECERET_KEY}`, async(err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                res.redirect('/artmodifiers/login');
            } else {
                let user = await User.findById(decodedToken.id);
                if (user) {
                    res.locals.user = user;
                    next();
                } else if (!user) {
                    // res.locals.user = null;
                    console.log("user does not exist anymore");
                    return next(
                        new AppError(
                            "The user belonging to this token does no longer exist.",
                            401
                        )
                    );

                }
            }
        })
    } else {
        res.locals.user = null;
        res.redirect("/artmodifiers/login");
    }
    // next();

});
exports.isLoggedIn = catchAsync(async(req, res, next) => {
    if (req.cookies.jwt) {
        try {
            // 1) verify token
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt,
                `${process.env.JWT_SECERET_KEY}`
            );

            // 2) Check if user still exists
            const currentUser = await User.findById(decoded.id);
            if (!currentUser) {
                return next();
            }

            // 3) Check if user changed password after the token was issued
            // if (currentUser.changedPasswordAfter(decoded.iat)) {
            //     return next();
            // }

            // THERE IS A LOGGED IN USER
            res.locals.user = currentUser;

            return next();
        } catch (err) {

            return next();
        }
    }
    next();
});