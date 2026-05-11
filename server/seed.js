require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ─── Настройки админа ────────────────────────────────────────────────────────
const ADMIN = {
  username: "zuhrbek",
  password: " zuhrbek",
  displayName: "Administrator",
  email: " zuhrbek3@gmail.com",
};
// ─────────────────────────────────────────────────────────────────────────────

async function seed() {
  const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://localhost:27017/quizapp";

  console.log(`Подключение к MongoDB: ${MONGODB_URI}`);
  await mongoose.connect(MONGODB_URI);
  console.log("Подключено.");

  const db = mongoose.connection.db;
  const users = db.collection("users");

  const existing = await users.findOne({ username: ADMIN.username });

  if (existing) {
    console.log(
      `Пользователь "${ADMIN.username}" уже существует. Обновляю isAdmin=true...`
    );
    await users.updateOne(
      { username: ADMIN.username },
      { $set: { isAdmin: true, isBlocked: false } }
    );
    console.log("Готово.");
  } else {
    // Хешируем пароль вручную (как при регистрации через pre('save'))
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN.password, salt);

    await users.insertOne({
      username: ADMIN.username,
      password: hashedPassword,
      displayName: ADMIN.displayName,
      email: ADMIN.email,
      isAdmin: true,
      isBlocked: false,
      createdAt: new Date(),
    });

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
