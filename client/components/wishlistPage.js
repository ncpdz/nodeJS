export default function wishlistPage(wishlist) {
    const wishlistItemsHTML =
      wishlist && wishlist.length
        ? wishlist
            .map((item) => {
              return `
                  <div class="wishlist-item flex items-center border-b border-gray-300 py-4">
                    <img src="http://localhost:3000/uploads/${item.image}" alt="${item.name}" class="product-image w-24 h-24 object-cover rounded-md">
                    <div class="ml-4 flex-grow">
                      <h3 class="text-lg font-semibold">${item.name}</h3>
                      <p class="text-gray-600">Giá: <span class="font-bold">${item.price} VND</span></p>
                      <a href="/product/${item.productId}" class="read-more-btn mt-2 inline-block bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">Xem Chi Tiết</a>
                    </div>
                    <button data-product-id="${item.productId}" class="remove-wishlist-btn bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">Xóa khỏi yêu thích</button>
                  </div>
                `;
            })
            .join("")
        : `<p class="text-center text-gray-500">Danh sách yêu thích trống!</p>`;
  
    return `
        <div class="wishlist-container w-[1200px] mx-auto p-6 bg-white shadow-md rounded-lg">
          <h2 class="text-2xl font-bold mb-4">Danh sách yêu thích của bạn</h2>
          <div class="wishlist-items">
            ${wishlistItemsHTML}
          </div>
        </div>
      `;
  }
  