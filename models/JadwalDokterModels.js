import { Sequelize } from "sequelize";
import db from "../config/database.js";
import dokter from "./DokterModels.js";

const { DataTypes } = Sequelize;

const jadwaldokter = db.define(
  "jadwaldokter",
  {
    hari: {
      type: DataTypes.ENUM(
        "senin",
        "selasa",
        "rabu",
        "kamis",
        "jumat",
        "sabtu",
        "minggu",
      ),
    },
    jam_mulai: {
      type: DataTypes.TIME,
      allowNull:false
    },
    jam_selesai: {
      type: DataTypes.TIME,
        allowNull:false
    },
    dokter_id: {
      type: DataTypes.INTEGER,
        allowNull:false,
        validate :{
            notEmpty : true
        }
    },
  },
  {
    freezeTableName: true,
  },
);

dokter.hasMany(jadwaldokter, {foreignKey : "dokter_id"})
jadwaldokter.belongsTo(dokter, {foreignKey : 'dokter_id'})

export default jadwaldokter
