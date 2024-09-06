import { Sequelize, DataTypes } from "sequelize";

export const sequelize = new Sequelize("sqlite:test.db");

export const User = sequelize.define(
  "User",
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    email: {
      unique: true,
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "users",
  }
);
