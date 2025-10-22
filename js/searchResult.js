// ====== READ RESULTS & FACETS FROM STORAGE ======
const grid = document.getElementById("category-grid");
const storedResults = localStorage.getItem("SEARCH_RESULTS");

let slots = [];
let facets = [];

if (!storedResults) {
    grid.innerHTML = "<p>No results found.</p>";
} else {
    const data = JSON.parse(storedResults);
    slots = data?.choices?.[0]?.variations?.[0]?.payload?.data?.slots || [];
    facets = data?.choices?.[0]?.variations?.[0]?.payload?.data?.facets || [];

    if (!slots.length) {
        grid.innerHTML = "<p>No results found.</p>";
    } else {
        renderProductGrid(slots);
        renderFacets(facets);
    }
}

// ====== RENDER PRODUCT GRID ======
function renderProductGrid(data) {
    grid.innerHTML = data.map(slot => {
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

// ====== RENDER FACETS ======
function renderFacets(facets) {
    facets.forEach(facet => {
        if (facet.column === "categories") renderCategoryFacet(facet);
        if (facet.column === "Brand") renderBrandFacet(facet);
        if (facet.column === "price") renderPriceFacet(facet);
    });

}

function renderCategoryFacet(facet) {
    const container = document.getElementById("facet-category");
    container.innerHTML = facet.values.map(v => `
    <label>
      <input type="checkbox" class="facet-category" value="${v.name}" />
      ${v.name} (${v.count})
    </label>
  `).join("");
}

function renderBrandFacet(facet) {
    const container = document.getElementById("facet-brand");
    container.innerHTML = facet.values.map(v => `
    <label>
      <input type="checkbox" class="facet-brand" value="${v.name}" />
      ${v.name} (${v.count})
    </label>
  `).join("");
}

function renderPriceFacet(facet) {
    const container = document.getElementById("facet-price");

    container.innerHTML = `
    <input type="range" id="price-slider" min="${facet.min}" max="${facet.max}" step="1" value="${facet.min}" />
    <div class="price-label">
      Price ≥ €<span id="price-value">${facet.min}</span>
    </div>
  `;

    const slider = document.getElementById("price-slider");
    const label = document.getElementById("price-value");

    slider.addEventListener("input", () => {
        label.textContent = slider.value;
        applyFilters();
    });
}

// ====== APPLY FILTERS ======
function applyFilters() {
    let filtered = slots;

    // category
    const selectedCategories = [...document.querySelectorAll(".facet-category:checked")].map(i => i.value);
    if (selectedCategories.length) {
        filtered = filtered.filter(slot =>
            slot.productData.categories?.some(c => selectedCategories.includes(c))
        );
    }

    // brand
    const selectedBrands = [...document.querySelectorAll(".facet-brand:checked")].map(i => i.value);
    if (selectedBrands.length) {
        filtered = filtered.filter(slot =>
            selectedBrands.includes(slot.productData.Brand)
        );
    }

    // price
    const sliderValue = Number(document.getElementById("price-slider")?.value || 0);
    filtered = filtered.filter(slot =>
        slot.productData.price >= sliderValue
    );

    renderProductGrid(filtered);
}

// ====== SEARCH BAR (UNCHANGED) ======
const input = document.getElementById("search-input");
if (input) {
    input.addEventListener("keydown", async (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            const query = event.target.value.trim();
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
    });
}