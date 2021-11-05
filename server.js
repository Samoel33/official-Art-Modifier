const dotenv = require("dotenv");
const mongoose = require('mongoose');
process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");



const DB_CLUSTER = process.env.DATABASE_CLUSTER.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
// connect(DB, {
//connect(DB_CLUSTER,{connect(process.env.DATABASE_LOCAL, {
mongoose
    .connect(DB_CLUSTER, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => {
        console.log("u are connected to your database man!");
    });
const port = process.env.PORT || 5080;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on("SIGTERM", () => {
    console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
    server.close(() => {
        console.log("💥 Process terminated!");
    });
});