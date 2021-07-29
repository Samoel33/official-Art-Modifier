exports.homeRedirect = (req, res, next) => {
	res.status(404).json({
		status: "Fail",
		message: "sorry looks like you are lost",
	});
};
