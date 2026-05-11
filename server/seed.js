require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

// ─── Настройки админа ────────────────────────────────────────────────────────
const ADMIN = {
  username: "zuhrbek",
  password: "zuhrbek",
  displayName: "Administrator",
  email: "zuhrbek3@gmail.com",
  isAdmin: true,
};
// ─────────────────────────────────────────────────────────────────────────────

async function seed() {
  const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://localhost:27017/quizapp";

  console.log(`Подключение к MongoDB: ${MONGODB_URI}`);
  await mongoose.connect(MONGODB_URI);
  console.log("Подключено.");

  const existing = await User.findOne({ username: ADMIN.username });

  if (existing) {
    console.log(
      `Пользователь "${ADMIN.username}" уже существует. Обновляю isAdmin=true...`
    );
    existing.isAdmin = true;
    await existing.save();
    console.log("Готово.");
  } else {
    await User.create(ADMIN);
    console.log(`Админ создан:`);
    console.log(`  username : ${ADMIN.username}`);
    console.log(`  password : ${ADMIN.password}`);
  }

  await mongoose.disconnect();
  console.log("Отключено. Seed завершён.");
}

seed().catch((err) => {
  console.error("Ошибка:", err);
  process.exit(1);
});
