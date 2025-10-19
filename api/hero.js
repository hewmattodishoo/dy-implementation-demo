export default async function handler(req, res) {
  console.log("Incoming /api/hero request...");

  const apiKey = process.env.DY_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing DY_API_KEY in environment." });
  }

  try {
    const { dyid } = req.body || {};

    const payload = {
      user: {
        active_consent_accepted: false,
        dyid: dyid || "",
        dyid_server: "",
      },
      session: { dy: "" },
      context: {
        page: {
          type: "HOMEPAGE",
          data: [""],
          location: "https://sugoi-ne.com/men-pants/p7383723-010",
          referrer: "https://sugoi-ne.com/men-pants",
          locale: "en_US",
        }
      },
      selector: {
        names: ["HP Banner", "API-recs"],
      },
      options: {
        isImplicitPageview: false,
        returnAnalyticsMetadata: false,
        isImplicitImpressionMode: true,
        isImplicitClientData: false,
      },
    };

    const response = await fetch("https://dy-api.com/v2/serve/user/choose", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "DY-API-KEY": apiKey,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error("Error calling Dynamic Yield API:", error);
    return res.status(500).json({ error: "Failed to fetch from Dynamic Yield API" });
  }
}