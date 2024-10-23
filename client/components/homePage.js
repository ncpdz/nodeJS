function homePage(data) {
  // Create a search function
  const renderProducts = (filteredData) => {
    return filteredData
      .map((item) => {
        return `
        <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <a href="">
            <img class="rounded-t-lg" src="http://localhost:3000/uploads/${item.image}" alt="${item.name}" />
          </a>
          <div class="p-5">
            <a href="#">
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                ${item.name}
              </h5>
            </a>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
              ${item.price}
            </p>
            <a
              href="/product/${item.id}"
              class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Read more
              <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
              </svg>
            </a>
          </div>
        </div>`;
      })
      .join("");
  };

  // Navigation with search input
  const navigation = `
    <nav id="store" class="w-[97%] z-30 top-0 px-6 py-1">
      <div class="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 px-2 py-3">
        <a class="uppercase tracking-wide no-underline hover:no-underline font-bold text-gray-800 text-xl" href="#">
          Store
        </a>
        <div class="flex items-center" id="store-nav-content">
          <input type="text" id="search-input" placeholder="Search products..." class="border rounded-lg p-2" />
        </div>
      </div>
    </nav>
  `;

  // Render the initial product list
  let displayedProducts = data;

  // Event listener for search input
  const handleSearch = () => {
    const searchQuery = document.getElementById('search-input').value.toLowerCase();
    displayedProducts = data.filter(item => item.name.toLowerCase().includes(searchQuery));
    document.getElementById('product-container').innerHTML = renderProducts(displayedProducts);
  };

  // Set up event listener
  setTimeout(() => {
    document.getElementById('search-input').addEventListener('input', handleSearch);
  }, 0);

  return `
    ${navigation}
    <div id="product-container" class="mx-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        ${renderProducts(displayedProducts)}
    </div>
  `;
}

export default homePage;