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