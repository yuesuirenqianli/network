import path from "path";
import { Sequelize } from "sequelize";
import { fileURLToPath } from "url";

// 获取当前模块的文件名和目录名
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 数据库连接配置 (SQLite 文件放在根目录)
const dbPath = path.resolve(__dirname, "../../test.db");

// 初始化 Sequelize 实例
export const sequelize = new Sequelize(`sqlite:${dbPath}`, {
  logging: false, // 关闭 SQL 打印，避免控制台太乱
});

export const connectDB = async () => {
  try {
    // 测试数据库连接
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    // 引入 User 模型，确保同步时模型已注册
    const { User } = await import("../models/user.mjs");

    // 同步数据库结构（如果表不存在则创建）
    await sequelize.sync();
    console.log("Database models synced successfully.");

    // 插入一条测试数据供登录使用 (如果数据库是空的)
    const userCount = await User.count();
    if (userCount === 0) {
      await User.create({
        email: "test@example.com",
        name: "Test User",
        password: "password123",
      });
      console.log("Seed data created: test@example.com / password123");
    }
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
