const express = require("express");

const artController = require("../controller/artRouteController");

const router = express.Router();

router.route("/").get(artController.homePage);
router.route("/art-Modifiers").get(artController.homeRedirect);
router.route("/about-art").get(artController.aboutArt);
router.route("/popup-video").get(artController.popupVideoPage);
router.route("/video").get(artController.popupVideo);
router.route("/gallery").get(artController.gallery);
router.route("/about-Henk").get(artController.aboutHenk);

module.exports = router;
