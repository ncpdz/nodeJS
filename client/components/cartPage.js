export default function cartPage(cart) {
    let totalPrice = 0;
  
    // Helper function for formatting currency
    const formatCurrency = (amount) => {
      return amount.toLocaleString() + ' VND';
    };
  
    const cartItemsHTML = (cart && cart.length)
      ? cart
          .map((item) => {
            totalPrice += item.total;
            return `
                <tr>
                    <td>${item.productId}</td>
                    <td>${item.name}</td>
                    <td>${formatCurrency(item.price)}</td>
                    <td>${item.quantity}</td>
                    <td>${formatCurrency(item.total)}</td>
                    <td>
                        <button data-product-id="${item.productId}" class="btn btn-danger btn-sm remove-btn">Xóa</button>
                    </td>
                </tr>
            `;
          })
          .join("")
      : `<tr><td colspan="6" class="text-center">Giỏ hàng trống!</td></tr>`; 
  
    const html = `
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
                <h3>Tổng Cộng: ${formatCurrency(totalPrice)}</h3>
                <button class="btn btn-warning clear-cart">Xóa Toàn Bộ Giỏ Hàng</button>
                <button class="btn btn-success">Thanh Toán</button>
            </div>
        `;
  
    // Adding event listeners after rendering HTML
    setTimeout(() => {
      document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', (event) => {
          const productId = event.target.dataset.productId;
          // Handle removal logic here (e.g., call an API to remove the product from the cart)
          console.log(`Removing product with ID: ${productId}`);
        });
      });
  
      document.querySelector('.clear-cart').addEventListener('click', () => {
        // Handle clear cart logic here (e.g., call an API to clear the cart)
        console.log('Clearing the cart');
      });
  
      // Add event listener for payment button if needed
      document.querySelector('.btn-success').addEventListener('click', () => {
        // Handle payment logic here
        console.log('Proceeding to payment');
      });
    }, 0);
  
    return html;
  }
  