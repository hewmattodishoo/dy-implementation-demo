export default async function handler(req, res) {
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

    // Call the Dynamic Yield API
    const response = await fetch("https://dy-api.com/v2/serve/user/choose", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DY_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    // Parse and forward the API response
    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error("Error calling Dynamic Yield API:", error);
    res.status(500).json({ error: "Failed to fetch from Dynamic Yield API" });
  }
}