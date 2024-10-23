const Product = require('../../models/product');
const Wishlist = require('../../models/wishlist');

class WishlistController {
  static async addToWishlist(req, res) {
    const { productId } = req.body;

    if (!req.session.userId) {
      return res.status(401).json({ error: 'Vui lòng đăng nhập.' });
    }

    if (!productId) {
      return res.status(400).json({ error: 'Product ID là bắt buộc.' });
    }

    try {
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ error: 'Sản phẩm không tồn tại.' });
      }

      const existingItem = await Wishlist.findOne({
        where: {
          userId: req.session.userId,
          productId: productId,
        },
      });

      if (existingItem) {
        return res.status(400).json({ error: 'Sản phẩm đã có trong mục yêu thích.' });
      }

      const wishlistItem = await Wishlist.create({
        userId: req.session.userId,
        productId: productId,
      });

      return res.json({
        message: 'Đã thêm sản phẩm vào mục yêu thích.',
        wishlistItem,
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return res.status(500).json({ error: 'Đã xảy ra lỗi khi thêm sản phẩm vào mục yêu thích.' });
    }
  }

  static async getWishlist(req, res) {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Vui lòng đăng nhập.' });
    }

    try {
      const wishlistItems = await Wishlist.findAll({
        where: {
          userId: req.session.userId,
        },
        include: [
          {
            model: Product,
            attributes: ['id', 'name', 'price', 'image'],
          },
        ],
      });

      const wishlist = wishlistItems.map((item) => ({
        productId: item.productId,
        name: item.Product.name,
        price: item.Product.price,
        image: item.Product.image,
      }));

      return res.json({ wishlist });
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      return res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy danh sách yêu thích.' });
    }
  }

  static async removeFromWishlist(req, res) {
    const { productId } = req.body;

    if (!req.session.userId) {
      return res.status(401).json({ error: 'Vui lòng đăng nhập.' });
    }

    if (!productId) {
      return res.status(400).json({ error: 'Product ID là bắt buộc.' });
    }

    try {
      const wishlistItem = await Wishlist.findOne({
        where: {
          userId: req.session.userId,
          productId: productId,
        },
      });

      if (!wishlistItem) {
        return res.status(404).json({ error: 'Sản phẩm không có trong mục yêu thích.' });
      }

      await wishlistItem.destroy();

      return res.json({ message: 'Đã xóa sản phẩm khỏi mục yêu thích.' });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa sản phẩm khỏi mục yêu thích.' });
    }
  }

  static async clearWishlist(req, res) {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Vui lòng đăng nhập.' });
    }

    try {
      await Wishlist.destroy({
        where: {
          userId: req.session.userId,
        },
      });

      return res.json({ message: 'Đã xóa toàn bộ mục yêu thích.' });
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      return res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa mục yêu thích.' });
    }
  }
}

module.exports = WishlistController;
