const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async (req, res) => {
  const vin = req.query.vin;
  const part = req.query.part;
  if (!vin || !part) {
    return res.status(400).json({ error: "Missing vin or part" });
  }

  const url = `https://parts.ford.com/shop/en/us/search?vin=${encodeURIComponent(vin)}&keyword=${encodeURIComponent(part)}`;

  try {
    const htmlRes = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    const $ = cheerio.load(htmlRes.data);

    const item = $(".product-grid-item").first();
    const partNumber = item.find(".part-number").text().trim() || "Not found";
    const price = item.find(".price").first().text().trim() || "Not found";

    return res.json({ vin, searchTerm: part, partNumber, price, url });
    
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
