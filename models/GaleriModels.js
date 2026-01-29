import { Sequelize } from "sequelize";
import db from "../config/database.js";
import users from "./UserModel.js";

const { DataTypes } = Sequelize;

const galeri = db.define(
  "galeri",
  {
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jenis_kegiatan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    gambar: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tanggal: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    freezeTableName: true,
  },
);

users.hasMany(galeri);
galeri.belongsTo(users, { foreignKey: "userId", onDelete : 'CASCADE', onUpdate : 'CASCADE' });

export default galeri;
