const express = require("express");
const router = express.Router();
const CartController = require("../../controllers/api/cart_controller");

router.post("/add", CartController.addToCart); 
router.get("/", CartController.getCart); 
router.delete("/remove", CartController.removeFromCart);
router.delete("/clear", CartController.clearCart); 
router.delete("/checkout", CartController.checkoutCart); 
module.exports = router;
