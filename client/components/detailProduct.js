function productDetailPage({ id, name, description, image, price, Category }) {
  const imageBaseURL = "http://localhost:3000/uploads/";

  return `
    <div class="bg-gray-100">
      <div class="container mx-auto px-4 py-8">
        <div class="flex flex-wrap -mx-4">
          <!-- Hình Ảnh Sản Phẩm -->
          <div class="w-full md:w-1/2 px-4 mb-8 flex justify-center">
            <img src="${imageBaseURL}${image}" alt="${name}"
                 class="w-[80%] h-auto rounded-lg shadow-md mb-4" id="mainImage">
          </div>

          <!-- Chi Tiết Sản Phẩm -->
          <div class="w-full md:w-1/2 px-4">
            <h2 class="text-3xl font-bold mb-2">${name}</h2>
            <p class="text-gray-600 mb-4">Danh mục: ${Category.name}</p>
            <div class="mb-4">
              <span class="text-2xl font-bold mr-2">${price} VND</span>
            </div>
            <p class="text-gray-700 mb-6">${description}</p>

            <div class="mb-6">
              <label for="quantity" class="block text-sm font-medium text-gray-700 mb-1">Số lượng:</label>
              <input type="number" id="quantity" name="quantity" min="1" value="1"
                     class="w-12 text-center rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
            </div>

            <div class="flex space-x-4 mb-6">
              <button onclick="addToCart(${id}, document.getElementById('quantity').value)"
                class="bg-indigo-600 flex gap-2 items-center text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Thêm vào giỏ hàng
              </button>
              <button onclick="addToWishlist(${id})"
                class="wishlist-btn bg-gray-200 flex gap-2 items-center text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                Yêu thích
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export default productDetailPage;
