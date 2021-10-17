const express = require("express");

const artController = require("../controller/artRouteController");
const viewController = require('../controller/viewController');

const router = express.Router();

router.route("/").get(artController.homePage);
router.route("/homePage").get(artController.homeRedirect);
router.route("/signup").get(artController.signUp);
router.route("/login").get(viewController.login);
router.route('/blogs').get(viewController.blogs);
router.route("/about-art").get(artController.aboutArt);
router.route("/popup-video").get(artController.popupVideoPage);
router.route("/video").get(artController.popupVideo);
router.route("/gallery").get(artController.gallery);
router.route("/about-Henk").get(artController.aboutHenk);
router.route("/shop").get(artController.shop);

module.exports = router;