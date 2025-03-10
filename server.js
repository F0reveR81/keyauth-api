require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// 環境變數 (從 Railway Variables 讀取)
const OWNER_ID = process.env.KEYAUTH_OWNER_ID;
const APP_ID = process.env.KEYAUTH_APP_ID;
const SECRET = process.env.KEYAUTH_SECRET;
const BASE_URL = "https://keyauth.win/api/1.2/";

if (!OWNER_ID || !APP_ID || !SECRET) {
  console.error("❌ 環境變數缺失，請在 Railway 設定 KEYAUTH_OWNER_ID, KEYAUTH_APP_ID, KEYAUTH_SECRET");
  process.exit(1);
}

// ✅ 測試 API 是否正常
app.get("/", (req, res) => {
  res.json({ message: "🚀 KeyAuth API 運行中" });
});

// ✅ 用戶登入 (透過 KeyAuth 驗證)
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "請輸入帳號與密碼" });
  }

  try {
    const response = await axios.post(`${BASE_URL}?type=login`, {
      ownerid: OWNER_ID,
      appid: APP_ID,
      secret: SECRET,
      username,
      pass: password,
    });

    const data = response.data;

    if (data.success) {
      res.json({ success: true, message: "登入成功", token: data.sessionid });
    } else {
      res.status(401).json({ success: false, message: data.message });
    }
  } catch (error) {
    console.error("❌ KeyAuth API 錯誤:", error);
    res.status(500).json({ success: false, message: "伺服器錯誤" });
  }
});

// ✅ 伺服器啟動
app.listen(PORT, () => {
  console.log(`🚀 伺服器運行中：http://localhost:${PORT}`);
});
