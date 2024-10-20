const express = require("express");
const router = express.Router();
const {
  ApiProductController,
  upload,
} = require("../../controllers/api/product_controller");

router.get("/", ApiProductController.index);
router.get("/:id", ApiProductController.show);
router.post("/create", upload.single("image"), ApiProductController.create);
router.delete("/delete/:id", ApiProductController.delete);
router.put("/update/:id", upload.single("image"), ApiProductController.update);

module.exports = router;
