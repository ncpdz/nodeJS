const express = require("express");
const multer = require("multer");
const router = express.Router();
const ProductsController = require("../controllers/products_controller");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

var upload = multer({ storage: storage });

router.get("/", ProductsController.index);
router.get("/create", ProductsController.new);
router.post("/", upload.single("image"), ProductsController.create);
router.get("/edit/:id", ProductsController.edit);
router.put("/:id", upload.single("image"), ProductsController.update);
router.post("/delete/:id", ProductsController.delete);

module.exports = router;
