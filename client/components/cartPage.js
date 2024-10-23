export default function cartPage(cart) {
  let totalPrice = 0;

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) {
      return "0 VND";
    }
    return amount.toLocaleString() + " VND";
  };

  const cartItemsHTML =
    cart && cart.length
      ? cart
          .map((item) => {
            const productPrice = item.price || 0;
            const productTotal = productPrice * item.quantity;
            totalPrice += productTotal;

            return `
              <tr class="bg-white border-b hover:bg-gray-100">
                <td class="p-4 text-center">
                  <img src="http://localhost:3000/uploads/${item.image}" alt="${
              item.name
            }" class="w-24 h-24 object-cover">
                </td>
                <td class="p-4">${item.productId}</td>
                <td class="p-4">${item.name}</td>
                <td class="p-4">${formatCurrency(item.price)}</td>
                <td class="p-4">${item.quantity}</td>
                <td class="p-4">${formatCurrency(productTotal)}</td>
                <td class="p-4 text-center">
                  <button data-product-id="${
                    item.productId
                  }" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-all remove-btn">
                    Xóa
                  </button>
                </td>
              </tr>
            `;
          })
          .join("")
      : `<tr><td colspan="7" class="text-center p-4 text-gray-500">Giỏ hàng trống!</td></tr>`;

  const html = `
    <div class="container mx-auto mt-2 w-[90%]">
      <h2 class="text-2xl font-semibold mb-4 text-gray-800">Giỏ Hàng Của Bạn</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white shadow-lg rounded-lg text-center">
          <thead>
            <tr class="bg-gray-200 text-gray-600 uppercase leading-normal text-base">
              <th class="py-3 px-6 text-center">Hình Ảnh</th>
              <th class="py-3 px-6 text-center">Mã Sản Phẩm</th>
              <th class="py-3 px-6 text-center">Tên Sản Phẩm</th>
              <th class="py-3 px-6 text-center">Giá</th>
              <th class="py-3 px-6 text-center">Số Lượng</th>
              <th class="py-3 px-6 text-center">Tổng Tiền</th>
              <th class="py-3 px-6 text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody class="text-gray-700 text-base">
            ${cartItemsHTML}
          </tbody>
        </table>
      </div>
      <div class="mt-6 flex justify-between items-center">
        <h3 class="text-xl font-semibold text-gray-800">Tổng Cộng: ${formatCurrency(
          totalPrice
        )}</h3>
        <div>
          <button class="bg-yellow-500 text-white px-4 py-2 rounded mr-2 hover:bg-yellow-600 transition-all clear-cart">
            Xóa Toàn Bộ Giỏ Hàng
          </button>
          <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-all checkout-btn">
            Thanh Toán
          </button>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    document.querySelectorAll(".remove-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        const productId = event.target.dataset.productId;
        console.log(`Removing product with ID: ${productId}`);
      });
    });

    document.querySelector(".clear-cart").addEventListener("click", () => {
      console.log("Clearing the cart");
    });

    document.querySelector(".bg-green-500").addEventListener("click", () => {
      console.log("Proceeding to payment");
    });
  }, 0);

  return html;
}
