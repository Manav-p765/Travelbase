require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const { data } = require("./data");


async function connectToDB() {
  try {
    await mongoose.connect(process.env.ATLASURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ Connection error:", err);
    process.exit(1);
  }
}

async function seedDB() {
  try {
    await Listing.deleteMany({});
    console.log("✅ Database seeded with listings");
  } catch (err) {
    console.error("❌ Seeding error:", err);
  } finally {
    mongoose.connection.close();
  }
}

connectToDB().then(seedDB);
