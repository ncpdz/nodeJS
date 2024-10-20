export default function cartPage(cart) {
  let totalPrice = 0;

  const cartItemsHTML = cart
    .map((item) => {
      totalPrice += item.total;
      return `
            <tr>
                <td>${item.productId}</td>
                <td>${item.name}</td>
                <td>${item.price} VND</td>
                <td>${item.quantity}</td>
                <td>${item.total} VND</td>
                <td>
                    <button onclick="removeFromCart(${item.productId})" class="btn btn-danger btn-sm">Xóa</button>
                </td>
            </tr>
        `;
    })
    .join("");

  return `
        <div class="container mt-5">
            <h2>Giỏ Hàng Của Bạn</h2>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Mã Sản Phẩm</th>
                        <th>Tên Sản Phẩm</th>
                        <th>Giá</th>
                        <th>Số Lượng</th>
                        <th>Tổng Tiền</th>
                        <th>Thao Tác</th>
                    </tr>
                </thead>
                <tbody>
                    ${cartItemsHTML}
                </tbody>
            </table>
            <h3>Tổng Cộng: ${totalPrice} VND</h3>
            <button onclick="clearCart()" class="btn btn-warning">Xóa Toàn Bộ Giỏ Hàng</button>
            <button class="btn btn-success">Thanh Toán</button>
        </div>
    `;
}
