const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const postCtrl = require("../controllers/post");


router.delete("/:id", auth, postCtrl.deleteThing);
router.get("/:id", auth, postCtrl.getOneThing);
router.get("/", auth, postCtrl.getAllThings);
router.put("/:id", auth, multer, postCtrl.modifyThing);
router.put("/:id/like", auth, postCtrl.DislikeOrLike);
router.post("/", auth, multer, postCtrl.createThing);

module.exports = router;
