import "./style.css";
import Navigo from "navigo";
import homePage from "./components/homePage";
import productDetailPage from "./components/detailProduct";
import cartPage from "./components/cartPage";
import wishlistPage from "./components/wishlistPage";
import axios from "axios";

const router = new Navigo("/");

function showPage(htmlPage) {
  const app = document.querySelector("#app");
  app.innerHTML = htmlPage;
  router.updatePageLinks();
}

async function fetchAndDisplayUser() {
  const url = "http://localhost:3000/users/current";
  try {
    const response = await axios.get(url, { withCredentials: true });
    const user = response.data;

    console.log("Current user data:", user);

    const userElement = document.querySelector("#userNameHere");
    if (userElement) {
      userElement.textContent = user.username || "Guest";
    }
  } catch (error) {
    console.error(
      "Error fetching user data:",
      error.response?.data || error.message
    );
    const userElement = document.querySelector("#userNameHere");
    if (userElement) {
      userElement.href = "http://localhost:3000/users/login";
    }
  }
}

async function logout() {
  const url = "http://localhost:3000/users/logout";
  try {
    await axios.post(url, {}, { withCredentials: true });
    window.location.href = "http://localhost:3000/users/login"; 
  } catch (error) {
    console.error("Error logging out:", error);
    alert("Đã xảy ra lỗi khi đăng xuất.");
  }
}

const logoutElement = document.querySelector("#logoutLink");
if (logoutElement) {
  logoutElement.addEventListener("click", logout);
}

router
  .on("/", async () => {
    showPage(`<p class="text-center">Đang tải...</p>`);
    const url = "http://localhost:3000/api/products";
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
  .on(`/product/:id`, async (params) => {
    const productId = params.data.id;
    const url = `http://localhost:3000/api/products/${productId}`;

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
    await renderCartPage();
  })
  .on("/wishlist", async () => {
    await renderWishlistPage(); 
  });

router.resolve();
fetchAndDisplayUser();

async function addToCart(productId, quantity = 1) {
  const url = "http://localhost:3000/api/cart/add";
  try {
    const response = await axios.post(
      url,
      { productId, quantity },
      { withCredentials: true }
    );
    alert(response.data.message || "Product added to cart successfully!");

    window.dispatchEvent(new Event("cartUpdated"));
  } catch (error) {
    console.error("Error adding product to cart:", error);
    alert("Failed to add product to cart. Please try again.");
  }
}
window.addToCart = addToCart;

async function removeFromCart(productId) {
  const url = "http://localhost:3000/api/cart/remove";
  try {
    const response = await axios.delete(url, {
      data: { productId },
      withCredentials: true,
    });
    alert(response.data.message);
    window.dispatchEvent(new Event("cartUpdated"));
    await renderCartPage();
  } catch (error) {
    console.error("Error removing from cart:", error);
    alert("Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng.");
  }
}

async function clearCart() {
  const url = "http://localhost:3000/api/cart/clear";
  try {
    const response = await axios.delete(url, { withCredentials: true });
    alert(response.data.message);
    window.dispatchEvent(new Event("cartUpdated"));
    await renderCartPage();
  } catch (error) {
    console.error("Error clearing cart:", error);
    alert("Đã xảy ra lỗi khi xóa giỏ hàng.");
  }
}
async function checkoutCart() {
  const url = "http://localhost:3000/api/cart/checkout";
  try {
    const response = await axios.delete(url, { withCredentials: true });
    alert(response.data.message);
    window.dispatchEvent(new Event("cartUpdated"));
    await renderCartPage();
  } catch (error) {
    console.error("Error clearing cart:", error);
    alert("Đã xảy ra lỗi khi xóa giỏ hàng.");
  }
}

async function renderCartPage() {
  showPage(`<p class="text-center">Đang tải giỏ hàng...</p>`);
  const url = "http://localhost:3000/api/cart";
  try {
    const response = await axios.get(url, { withCredentials: true });
    const cart = response.data.cart;

    showPage(cartPage(cart));
    console.log(cart);

    document.querySelectorAll(".remove-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const productId = button.getAttribute("data-product-id");
        removeFromCart(productId);
      });
    });

    document.querySelector(".clear-cart").addEventListener("click", clearCart);
    document
      .querySelector(".checkout-btn")
      .addEventListener("click", checkoutCart);
  } catch (error) {
    console.error("Error fetching cart data:", error);
    showPage(
      "<p class='text-center text-red-500'>Đã xảy ra lỗi khi lấy giỏ hàng. Vui lòng thử lại sau.</p>"
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const cartLink = document.getElementById("cartLink");

  if (cartLink) {
    cartLink.addEventListener("click", (event) => {
      event.preventDefault();
      router.navigate("/cart");
    });
  }
});

window.addEventListener("cartUpdated", () => {
  console.log("Cart has been updated");
});

async function addToWishlist(productId) {
  const url = "http://localhost:3000/api/wishlist/add";
  try {
    const response = await axios.post(
      url,
      { productId },
      { withCredentials: true }
    );
    alert(response.data.message || "Đã thêm sản phẩm vào mục yêu thích!");
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    alert(
      error.response?.data?.error ||
        "Không thể thêm sản phẩm vào mục yêu thích. Vui lòng thử lại."
    );
  }
}
window.addToWishlist = addToWishlist;

async function renderWishlistPage() {
  showPage(`<p class="text-center">Đang tải danh sách yêu thích...</p>`);
  const url = "http://localhost:3000/api/wishlist";
  try {
    const response = await axios.get(url, { withCredentials: true });
    const wishlist = response.data.wishlist;

    showPage(wishlistPage(wishlist));

    document.querySelectorAll(".remove-wishlist-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const productId = button.getAttribute("data-product-id");
        removeFromWishlist(productId);
      });
    });
  } catch (error) {
    console.error("Error fetching wishlist data:", error);
    showPage(
      "<p class='text-center text-red-500'>Đã xảy ra lỗi khi lấy danh sách yêu thích. Vui lòng thử lại sau.</p>"
    );
  }
}

async function removeFromWishlist(productId) {
  const url = "http://localhost:3000/api/wishlist/remove";
  try {
    const response = await axios.post(
      url,
      { productId },
      { withCredentials: true }
    );
    alert(response.data.message);
    await renderWishlistPage();
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    alert("Đã xảy ra lỗi khi xóa sản phẩm khỏi mục yêu thích.");
  }
}
window.removeFromWishlist = removeFromWishlist;


