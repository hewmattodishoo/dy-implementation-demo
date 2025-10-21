// ---------- Elements ----------
const searchInput = document.getElementById("search-input");
const overlay = document.getElementById("search-overlay");
const overlayInput = document.getElementById("overlay-search-input");
const closeBtn = document.getElementById("close-search");
const backdrop = document.getElementById("search-backdrop");
const suggestionsContainer = document.getElementById("overlay-suggestions");

// ---------- Shared Search Logic (Enter → Full Results) ----------
async function runSearch(query) {
  if (!query) return;

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

// ---------- Render Suggestions (Max 4) ----------
function renderSuggestions(items) {
  suggestionsContainer.innerHTML = items
    .slice(0, 4)
    .map(item => `
      <div class="suggestion-item" onclick="window.location.href='/pages/product.html?id=${item.productId}'">
        <img src="${item.image}" alt="${item.name}" />
        <div class="suggestion-info">
          <div class="name">${item.name}</div>
          <div class="price">${item.price}</div>
        </div>
      </div>
    `)
    .join("");
}

function clearSuggestions() {
  suggestionsContainer.innerHTML = "";
}

// ---------- Autocomplete (3+ characters, debounced) ----------
let typingTimer;
const debounceDelay = 250;

overlayInput.addEventListener("input", () => {
  const query = overlayInput.value.trim();

  clearTimeout(typingTimer);
  if (query.length < 3) {
    clearSuggestions();
    return;
  }

  typingTimer = setTimeout(async () => {
    const storedDyid = localStorage.getItem("DYID");
    const res = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ search: query, dyid: storedDyid })
    });

    const data = await res.json();

    // ✅ Extract slot products from DY response
    const slots = data?.choices?.[0]?.variations?.[0]?.payload?.data?.slots || [];
    const mapped = slots.map(slot => ({
      productId: slot.sku,
      name: slot.productData.description,
      price: slot.productData.dy_display_price,
      image: slot.productData.image_url
    }));

    renderSuggestions(mapped);
  }, debounceDelay);
});

// ---------- Open & Close Overlay ----------
if (searchInput) {
  searchInput.addEventListener("focus", () => {
    overlay.classList.add("show");
    backdrop.classList.add("show");
    overlayInput.focus();
  });
}

if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    overlay.classList.remove("show");
    backdrop.classList.remove("show");
    clearSuggestions();
  });
}

// ESC closes overlay
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    overlay.classList.remove("show");
    backdrop.classList.remove("show");
    clearSuggestions();
  }
});

// ---------- Enter-handling ----------
searchInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    runSearch(event.target.value.trim());
  }
});

overlayInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    runSearch(event.target.value.trim());
  }
});