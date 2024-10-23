const express = require('express');
const router = express.Router();
const WishlistController = require('../../controllers/api/wishlist_controller');

router.post('/add', WishlistController.addToWishlist);
router.get('/', WishlistController.getWishlist);
router.post('/remove', WishlistController.removeFromWishlist);
router.post('/clear', WishlistController.clearWishlist);

module.exports = router;
