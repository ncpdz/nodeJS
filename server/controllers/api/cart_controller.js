const Product = require("../../models/product");
const Cart = require("../../models/cart");

class CartController {
  static async addToCart(req, res) {
    const { productId, quantity } = req.body;

    if (!req.session.userId) {
      return res.status(401).json({ error: "Vui lòng đăng nhập." });
    }

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({
        error: "Product ID và quantity là bắt buộc và quantity phải lớn hơn 0.",
      });
    }

    try {
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ error: "Sản phẩm không tồn tại." });
      }

      let cartItem = await Cart.findOne({
        where: {
          userId: req.session.userId,
          productId: productId,
        },
      });

      if (cartItem) {
        cartItem.quantity += parseInt(quantity);
        cartItem.price = product.price;
        await cartItem.save();
      } else {
        cartItem = await Cart.create({
          userId: req.session.userId,
          productId: productId,
          quantity: parseInt(quantity),
          price: product.price,
        });
      }

      return res.json({
        message: "Đã thêm sản phẩm vào giỏ hàng.",
        cart: cartItem,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      return res
        .status(500)
        .json({ error: "Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng." });
    }
  }

  static async getCart(req, res) {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated." });
      }

      const cartItems = await Cart.findAll({
        where: { userId: userId },
        include: [{ model: Product, attributes: ["name", "price"] }],
      });

      const detailedCart = cartItems.map((item) => ({
        productId: item.productId,
        name: item.Product.name,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
      }));

      return res.json({ cart: detailedCart });
    } catch (error) {
      console.error("Error fetching cart:", error);
      return res.status(500).json({ error: "Đã xảy ra lỗi khi lấy giỏ hàng." });
    }
  }

  static async removeFromCart(req, res) {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "Product ID là bắt buộc." });
    }

    try {
      const cartItem = await Cart.findOne({
        where: {
          userId: req.session.userId,
          productId: productId,
        },
      });

      if (!cartItem) {
        return res
          .status(404)
          .json({ error: "Sản phẩm không có trong giỏ hàng." });
      }

      await cartItem.destroy();

      return res.json({ message: "Đã xóa sản phẩm khỏi giỏ hàng." });
    } catch (error) {
      console.error("Error removing from cart:", error);
      return res
        .status(500)
        .json({ error: "Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng." });
    }
  }

  static async clearCart(req, res) {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated." });
      }

      await Cart.destroy({
        where: { userId: userId },
      });

      return res.json({ message: "Đã xóa toàn bộ giỏ hàng." });
    } catch (error) {
      console.error("Error clearing cart:", error);
      return res.status(500).json({ error: "Đã xảy ra lỗi khi xóa giỏ hàng." });
    }
  }
}

module.exports = CartController;
