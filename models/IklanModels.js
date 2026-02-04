import { Sequelize } from "sequelize";
import db from "../config/database.js";
import users from "./UserModel.js";

const { DataTypes } = Sequelize;

const iklan = db.define(
  "iklan",
  {
    nama: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
    },
    deskripsi: {
      type: DataTypes.STRING,
    },
   
    is_active: {
      type: DataTypes.BOOLEAN,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    freezeTableName: true,
  },
);

users.hasMany(iklan, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
iklan.belongsTo(users, { foreignKey: "userId" });

export default iklan;
