// Render results
const grid = document.getElementById("category-grid");
const storedResults = localStorage.getItem("SEARCH_RESULTS");

if (!storedResults) {
  grid.innerHTML = "<p>No results found.</p>";
} else {
  const data = JSON.parse(storedResults);
  const slots = data?.choices?.[0]?.variations?.[0]?.payload?.data?.slots || [];

  if (!slots.length) {
    grid.innerHTML = "<p>No results found.</p>";
  } else {
    grid.innerHTML = slots.map(slot => {
      const p = slot.productData;
      return `
        <div class="product-card">
          <img src="${p.image_url}" alt="${p.name}" class="product-img" />
          <h3>${p.name}</h3>
          <p class="price">${p.dy_display_price || p.price} €</p>
          <button class="add-btn"><i class="fa-solid fa-cart-shopping"></i> Add to cart</button>
        </div>
      `;
    }).join("");
  }
}

// Search listener (only if the input exists on this page)
const input = document.getElementById("search-input");
if (input) {
  input.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const query = event.target.value.trim();
      if (!query) return;

      console.log("User searched for:", query);

      const storedDyid = localStorage.getItem("DYID");
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search: query, dyid: storedDyid })
      });

      const data = await res.json();
      localStorage.setItem("SEARCH_RESULTS", JSON.stringify(data));
      window.location.href = `/pages/searchResult.html?q=${encodeURIComponent(query)}`;
    }
  });
}