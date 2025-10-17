export default async function handler(req, res) {
  console.log("🔍 Incoming /api/hero request...");

  // Quick environment check
  const apiKey = process.env.DY_API_KEY;
  console.log("DY_API_KEY starts with:", apiKey?.slice(0, 6));
  console.log("DY_API_KEY length:", apiKey?.length);

  if (!apiKey) {
    console.error("❌ Missing DY_API_KEY in environment variables.");
    return res.status(500).json({ error: "Missing DY_API_KEY in environment." });
  }

  try {
    // Build the payload
    const payload = {
      user: {
        active_consent_accepted: false,
        dyid: "",
        dyid_server: "",
      },
      session: {
        dy: "",
      },
      context: {
        page: {
          type: "HOMEPAGE",
          data: [""],
          location: "https://sugoi-ne.com/men-pants/p7383723-010",
          referrer: "https://sugoi-ne.com/men-pants",
          locale: "en_US",
        },
        device: {
          userAgent:
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
          ip: "54.100.200.255",
        },
        pageAttributes: {
          customPageAttribute: "someValue",
        },
      },
      selector: {
        names: ["HP Banner"],
      },
      options: {
        isImplicitPageview: false,
        returnAnalyticsMetadata: false,
        isImplicitImpressionMode: true,
        isImplicitClientData: false,
      },
    };

    console.log("🛰️ Sending request to DY API...");

    const response = await fetch("https://dy-api.com/v2/serve/user/choose", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "DY-API-KEY": process.env.DY_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    console.log("📡 DY API response status:", response.status);

    // If unauthorized, log full details
    if (response.status === 401) {
      const errText = await response.text();
      console.error("❌ DY API returned 401 Unauthorized. Body:", errText);
      return res.status(401).json({ error: "Unauthorized from DY API" });
    }

    const data = await response.json();
    console.log("✅ DY API success. Choices length:", data?.choices?.length);

    return res.status(200).json(data);
  } catch (error) {
    console.error("💥 Error calling Dynamic Yield API:", error);
    return res.status(500).json({ error: "Failed to fetch from Dynamic Yield API" });
  }
}