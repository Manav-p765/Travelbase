document.addEventListener("DOMContentLoaded", () => {
  const address = window.listingAddress;
  console.log("Searching address:", address); // 🔍 Check this

  const map = L.map("map").setView([20.5937, 78.9629], 5); // Default view

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  if (!address) {
    console.error("No address found.");
    return;
  }

  axios
    .get(`https://nominatim.openstreetmap.org/search`, {
      params: {
        q: address,
        format: "json",
        addressdetails: 1,
        limit: 1,
      },
      headers: {
        'Accept-Language': 'en', // helps improve accuracy
        'User-Agent': 'ManavTestApp/1.0 (your@email.com)' // required by Nominatim
      }
    })
    .then((response) => {
      console.log("Nominatim Response:", response.data); // 🔍 Check this

      if (!response.data || response.data.length === 0) {
        alert("Location not found.");
        return;
      }

      const { lat, lon, display_name } = response.data[0];

      L.marker([lat, lon])
        .addTo(map)
        .bindPopup(`<b>${display_name}</b>`)
        .openPopup();

      map.setView([lat, lon], 16);
    })
    .catch((err) => {
      console.error("Geocoding error:", err);
      alert("Error locating address.");
    });
});
