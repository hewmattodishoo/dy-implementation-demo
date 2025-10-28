// elements
const searchInput = document.getElementById("dy-search-input");


// call server-side when at least three characters has been entered
searchInput.addEventListener("input", async (e) => {
    const text = e.target.value.trim();

    if (text.length < 3) return; // wait for 3+ chars

    const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search: text })
    });

    const data = await res.json();

// Render results
    const ul = document.querySelector(".autocomplete-suggestions ul");
    ul.innerHTML = "";

    var suggestions = [];
    if (data.variations && data.variations[0] &&
        data.variations[0].payload &&
        data.variations[0].payload.data &&
        data.variations[0].payload.data.suggestions &&
        data.variations[0].payload.data.suggestions.querySuggestions) {
        suggestions = data.variations[0].payload.data.suggestions.querySuggestions;
    }

    suggestions.forEach(function(item) {
        var li = document.createElement("li");
        li.textContent = item.term;
        ul.appendChild(li);
    });
});
