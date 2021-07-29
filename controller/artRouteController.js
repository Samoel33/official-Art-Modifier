const path = require("path");
const fs = require("fs");

exports.homePage = (req, res, next) => {
	res.redirect("/art-Modifiers");
};
exports.homeRedirect = (req, res, next) => {
	res.status(200).render("home");
};
exports.aboutArt = (req, res, next) => {
	res.status(200).render("aboutArt");
};
exports.aboutHenk = (req, res, next) => {
	res.status(200).render("henk");
};
exports.popupVideoPage = (req, res, next) => {
	res.status(200).render("popup");
};
exports.popupVideo = function (req, res) {
	const path = "public/videos/VID-20200527-WA0000.mp4";
	const stat = fs.statSync(path);
	const fileSize = stat.size;
	const range = req.headers.range;
	if (range) {
		const parts = range.replace(/bytes=/, "").split("-");
		const start = parseInt(parts[0], 10);
		const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
		const chunksize = end - start + 1;
		const file = fs.createReadStream(path, { start, end });
		const head = {
			"Content-Range": `bytes ${start}-${end}/${fileSize}`,
			"Accept-Ranges": "bytes",
			"Content-Length": chunksize,
			"Content-Type": "video/mp4",
		};
		res.writeHead(206, head);
		file.pipe(res);
	} else {
		const head = {
			"Content-Length": fileSize,
			"Content-Type": "video/mp4",
		};
		res.writeHead(200, head);
		fs.createReadStream(path).pipe(res);
	}
};

exports.gallery = (req, res, next) => {
	res.status(200).render("gallery");
};
