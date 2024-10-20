import "./style.css";
import Navigo from "navigo";
import homePage from "./components/homePage";
import companyPage from "./components/companyPage";
import productDetailPage from "./components/detailProduct";
import cartPage from "./components/cartPage";
import axios from "axios";

const router = new Navigo("/");

router
  .on("/", async () => {
    showPage(`<p class="text-center">Đang tải...</p>`);
    const url = "http://localhost:3000/v1/api/products";
    try {
      const response = await axios.get(url);
      showPage(homePage(response.data));
    } catch (error) {
      console.error("Error fetching data:", error);
      showPage(
        "<p class='text-center text-red-500'>Đã xảy ra lỗi khi lấy dữ liệu. Vui lòng thử lại sau.</p>"
      );
    }
  })
  .on("/company", () => {
    showPage(companyPage());
  })
  .on(`/product/:id`, async (params) => {
    const productId = params.data.id;
    const url = `http://localhost:3000/v1/api/products/${productId}`;

    try {
      const response = await axios.get(url);
      console.log(response);

      showPage(productDetailPage(response.data));
    } catch (error) {
      console.error("Error fetching product details:", error);
      showPage(
        "<p>Error fetching product details. Please try again later.</p>"
      );
    }
  })
  .on("/cart", async () => {
    showPage(`<p class="text-center">Đang tải giỏ hàng...</p>`);
    const url = "http://localhost:3000/v1/api/cart";
    try {
      const response = await axios.get(url);
      showPage(cartPage(response.data.cart));
    } catch (error) {
      console.error("Error fetching cart data:", error);
      showPage(
        "<p class='text-center text-red-500'>Đã xảy ra lỗi khi lấy giỏ hàng. Vui lòng thử lại sau.</p>"
      );
    }
  });

function showPage(htmlPage) {
  const app = document.querySelector("#app");
  app.innerHTML = htmlPage;

  router.updatePageLinks();
}

router.resolve();

async function addToCart(productId, quantity = 1) {
  const url = "http://localhost:3000/v1/api/cart/add";
  try {
    const response = await axios.post(url, { productId, quantity });
    alert(response.data.message);
    window.dispatchEvent(new Event("cartUpdated"));
  } catch (error) {
    console.error("Error adding to cart:", error);
    alert("Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng.");
  }
}

async function removeFromCart(productId) {
  const url = "http://localhost:3000/v1/api/cart/remove";
  try {
    const response = await axios.post(url, { productId });
    alert(response.data.message);
    window.dispatchEvent(new Event("cartUpdated"));
    router.navigate("/cart");
  } catch (error) {
    console.error("Error removing from cart:", error);
    alert("Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng.");
  }
}

async function clearCart() {
  const url = "http://localhost:3000/v1/api/cart/clear";
  try {
    const response = await axios.post(url);
    alert(response.data.message);
    window.dispatchEvent(new Event("cartUpdated"));
    router.navigate("/cart");
  } catch (error) {
    console.error("Error clearing cart:", error);
    alert("Đã xảy ra lỗi khi xóa giỏ hàng.");
  }
}
