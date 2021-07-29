const express = require("express");
const morgan = require("morgan");
const path = require("path");
const compresion = require("compression");
const app = express();
const AppError = require("./utils/appError");
const globalError = require("./controller/errorController");
const artRouter = require("./routes/artRoutes");

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}
// app.use(compresion);
app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
});
//app.use("/", artRouter);
app.use("/", artRouter);
app.use("*", (req, res, next) => {
	// const err = new Error(`cant find ${req.originalUrl} on this server`);
	// err.status="fail";
	// err.statusCode=404;

	next(new AppError(`cant find ${req.originalUrl} on this server`, 404));
});
//four argument required for error
app.use(globalError);

module.exports = app;
