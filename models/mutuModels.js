import { Sequelize } from "sequelize";
import db from "../config/database.js";
import users from "./UserModel.js";

const { DataTypes } = Sequelize;

const mutu = db.define(
  "mutu",
  {
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: true,
      },
    },
  },
  {
    freezeTableName: true,
  },
);

users.hasMany(mutu, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
mutu.belongsTo(users, { foreignKey: "userId" });

export default mutu;
