const axios = require('axios');

const URL = 'https://travelbase.onrender.com'; // 🔁 Replace this with your actual Render URL
const INTERVAL = 14 * 60 * 1000; // 14 minutes in milliseconds

const pingSite = async () => {
  try {
    const res = await axios.get(URL);
    console.log(`[${new Date().toLocaleTimeString()}] Pinged ${URL} | Status: ${res.status}`);
  } catch (error) {
    console.error(`[${new Date().toLocaleTimeString()}] Failed to ping ${URL}`, error.message);
  }
};

pingSite(); // Ping immediately on start
setInterval(pingSite, INTERVAL); // Then ping every 14 minutes
