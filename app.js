const express = require("express");
const morgan = require("morgan");
const cookie = require("cookie-parser");
const path = require("path");
const compresion = require("compression");
const app = express();


const AppError = require("./utils/appError");
const globalError = require("./controller/errorController");
const artRouter = require("./routes/artRoutes");
const blogRouter = require('./routes/blogRoutes');
const authRouter = require("./routes/userRoute");
const artControll = require('./controller/artRouteController');

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie());
// app.use(compresion);
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});
//app.use("/", artRouter);
app.get('/', artControll.homePage);
app.use("/artmodifiers", artRouter);
app.use("/artmodifiers/blog/blogs/user", authRouter);
app.use('/artmodifiers/blog', blogRouter);
app.all("*", (req, res, next) => {
    next(new AppError(`cant find ${req.originalUrl} on this server`, 404));
});
//four argument required for error
app.use(globalError);

module.exports = app;