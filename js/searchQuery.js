// ---------- Elements ----------
const searchInput = document.getElementById("search-input");
const overlay = document.getElementById("search-overlay");
const overlayInput = document.getElementById("overlay-search-input");
const closeBtn = document.getElementById("close-search");

// ---------- Shared Search Logic ----------
async function runSearch(query) {
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

// ---------- Open & Close Overlay ----------
if (searchInput) {
  searchInput.addEventListener("focus", () => {
    overlay.classList.add("show");
    overlayInput.focus();
  });
}

if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    overlay.classList.remove("show");
    searchInput.blur();
  });
}

// ESC key to close
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    overlay.classList.remove("show");
  }
});

// ---------- Search Input (Original in Navbar) ----------
if (searchInput) {
  searchInput.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      runSearch(event.target.value.trim());
    }
  });
}

// ---------- Search Input (Overlay Input) ----------
if (overlayInput) {
  overlayInput.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      runSearch(event.target.value.trim());
    }
  });
}