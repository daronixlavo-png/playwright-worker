const express = require("express");
const { chromium } = require("playwright");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

let isRunning = false;
let guiBrowser = null;

const userDataPath = path.join(__dirname, "user-data");

// =======================
// GUI MODE
// =======================
app.get("/start", async (req, res) => {
  if (isRunning) {
    return res.send("⚠ Automation already running.");
  }

  try {
    isRunning = true;

    guiBrowser = await chromium.launchPersistentContext(userDataPath, {
      headless: false
    });

    const page = await guiBrowser.newPage();
    await page.goto("https://www.instagram.com");

    res.send("✅ GUI Started. Login manually. Then hit /stop");
  } catch (error) {
    isRunning = false;
    res.send("❌ Error starting GUI: " + error.message);
  }
});

// =======================
// BACKGROUND MODE
// =======================
app.get("/run", async (req, res) => {
  if (isRunning) {
    return res.send("⚠ Already running in GUI mode.");
  }

  try {
    isRunning = true;

    const browser = await chromium.launchPersistentContext(userDataPath, {
      headless: true
    });

    const page = await browser.newPage();
    await page.goto("https://www.instagram.com");

    console.log("✅ Session reused successfully.");

    // 🔹 Yaha apna automation code daalna

    await browser.close();
    isRunning = false;

    res.send("✅ Background automation completed.");
  } catch (error) {
    isRunning = false;
    res.send("❌ Error in background automation: " + error.message);
  }
});

// =======================
// STOP GUI
// =======================
app.get("/stop", async (req, res) => {
  if (!guiBrowser) {
    return res.send("⚠ No GUI running.");
  }

  await guiBrowser.close();
  guiBrowser = null;
  isRunning = false;

  res.send("🛑 GUI stopped.");
});

// =======================
// KEEP ALIVE
// =======================
app.get("/ping", (req, res) => {
  res.send("🚀 Server alive.");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
