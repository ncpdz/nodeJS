const Product = require('../../models/product');
const Cart = require('../../models/cart'); // Import model Cart

class CartController {
    // Thêm sản phẩm vào giỏ hàng (lưu vào DB)
    static async addToCart(req, res) {
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({ error: 'Product ID và quantity là bắt buộc.' });
        }

        try {
            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(404).json({ error: 'Sản phẩm không tồn tại.' });
            }

            // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
            let cartItem = await Cart.findOne({
                where: {
                    userId: req.session.userId,
                    productId: productId
                }
            });

            if (cartItem) {
                // Cập nhật số lượng
                cartItem.quantity += parseInt(quantity);
                await cartItem.save();
            } else {
                // Tạo mới một mục giỏ hàng
                cartItem = await Cart.create({
                    userId: req.session.userId,
                    productId: productId,
                    quantity: parseInt(quantity),
                    price: product.price
                });
            }

            console.log("Giỏ hàng hiện tại:", cartItem); // Thêm log để kiểm tra

            return res.json({ message: 'Đã thêm sản phẩm vào giỏ hàng.', cart: cartItem });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng.' });
        }
    }

    // Lấy thông tin giỏ hàng (từ DB)
    static async getCart(req, res) {
        try {
            const cartItems = await Cart.findAll({
                where: { userId: req.session.userId },
                include: [{ model: Product, attributes: ['name', 'price'] }]
            });

            const detailedCart = cartItems.map(item => ({
                productId: item.productId,
                name: item.Product.name,
                price: item.price,
                quantity: item.quantity,
                total: item.price * item.quantity
            }));

            return res.json({ cart: detailedCart });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy giỏ hàng.' });
        }
    }

    // Xóa sản phẩm khỏi giỏ hàng (từ DB)
    static async removeFromCart(req, res) {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ error: 'Product ID là bắt buộc.' });
        }

        try {
            const cartItem = await Cart.findOne({
                where: {
                    userId: req.session.userId,
                    productId: productId
                }
            });

            if (!cartItem) {
                return res.status(404).json({ error: 'Sản phẩm không có trong giỏ hàng.' });
            }

            await cartItem.destroy();

            return res.json({ message: 'Đã xóa sản phẩm khỏi giỏ hàng.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng.' });
        }
    }

    // Xóa toàn bộ giỏ hàng (từ DB)
    static async clearCart(req, res) {
        try {
            await Cart.destroy({
                where: { userId: req.session.userId }
            });

            return res.json({ message: 'Đã xóa toàn bộ giỏ hàng.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa giỏ hàng.' });
        }
    }
}

module.exports = CartController;
