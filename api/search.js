export default async function handler(req, res) {
    console.log("Incoming /api/search request...");

    const apiKey = process.env.DY_API_KEY_CLIENT;
    if (!apiKey) {
        return res.status(500).json({ error: "Missing DY_API_KEY_CLIENT in environment." });
    }

    try {
        const { dyid, search } = req.body || {};

        const payload = {
            user: {
                dyid: dyid || "",
                dyid_server: "",
            },
            session: {
                dy: ""
            },
            query: {
                pagination: {
                    numItems: 24,
                    offset: 0
                },
                text:  search || "",
                filters: []
            },
            context: {
                page: {
                    type: "SEARCH",
                    data: [],
                    location: "https://dy-implementation-demo.vercel.app/",
                    locale: "none",
                    referrer: ""
                },
                device: {
                    userAgent: "Mozilla/5.0"
                }
            },
            selector: {
                "name": "Semantic Search"
            },
        };

        const response = await fetch("https://dy-api.com/v2/serve/user/search", {
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