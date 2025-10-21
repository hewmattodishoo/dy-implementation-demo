
    async function loadHero() {
      try {
        const storedDyid = localStorage.getItem("DYID");

        const res = await fetch("/api/hero", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dyid: storedDyid }),
        });

        const data = await res.json();
        console.log("DY API response:", data);

        const dyid = data?.cookies?.find(c => c.name === "_dyid_server")?.value;
        if (dyid) localStorage.setItem("DYID", dyid);

        // ============ HERO ============
        const bannerChoice = data.choices.find(c => c.name === "HP Banner");
        const payload = bannerChoice.variations[0].payload.data;

        const heroSection = document.querySelector("#hero");
        const heroImg = heroSection.querySelector(".hero-img");
        const heroTitle = heroSection.querySelector(".hero-copy h1");
        const heroSubtitle = heroSection.querySelector(".hero-copy p");
        const heroBtn = heroSection.querySelector(".hero-copy .btn");

        heroImg.classList.remove("skeleton");
        heroTitle.classList.remove("skeleton-text");
        heroSubtitle.classList.remove("skeleton-text");
        heroBtn.classList.remove("skeleton-text");

        heroImg.style.backgroundImage = `url(${payload.image})`;
        heroTitle.textContent = payload.title;
        heroSubtitle.textContent = payload.subtitle;
        heroBtn.textContent = payload.cta;
        heroBtn.href = payload.link || "#";

        // ============ RECOMMENDATIONS ============
        const recsChoice = data.choices.find(c => c.name === "API-recs");
        const slots = (recsChoice.variations[0].payload.data.slots || []).slice(0, 4);

        const recContainer = document.querySelector("#rec-slider");
        recContainer.innerHTML = slots.map(slot => {
          const p = slot.productData;
          return `
          <div class="item">
            <img src="${p.image_url}" alt="${p.name}" />
            <h3>${p.name}</h3>
            <p class="price">${p.dy_display_price || p.price} €</p>
            <button class="add-btn"><i class="fa-solid fa-cart-shopping"></i> Add to cart</button>
          </div>
        `;
        }).join("");

      } catch (err) {
        console.error("Error in loadHero():", err);
      }
    }

    loadHero();
