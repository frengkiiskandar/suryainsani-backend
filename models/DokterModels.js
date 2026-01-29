import { Sequelize } from "sequelize";
import db from "../config/database.js";
const {DataTypes} = Sequelize

const dokter = db.define('dokter',{
    nama: {
        type : DataTypes.STRING
    },
    bagian: {
        type : DataTypes.STRING
    },
    kontak: {
        type : DataTypes.STRING
    },
    email: {
        type : DataTypes.STRING
    },
    image: {
        type : DataTypes.STRING
    },

},{
    freezeTableName :true
})

export default dokter