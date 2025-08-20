const mongoose = require("mongoose");

let isConnected;

const db = async () => {
  if (isConnected) return; // ⚡ reuse existing connection

  try {
    const conn = await mongoose.connect(process.env.mongouri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = conn.connections[0].readyState;
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};

module.exports = db;
