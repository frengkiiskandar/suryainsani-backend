import { Sequelize } from "sequelize";
import db from "../config/database.js";
import users from "./UserModel.js";

const {DataTypes}  = Sequelize

const artikel = db.define('artikel',{
    judul : {
        type : DataTypes.STRING,
        allowNull : true
    },
    deskripsi : {
        type : DataTypes.TEXT
    },
    kategori : {
        type : DataTypes.STRING
    },
    tanggal : {
        type : DataTypes.DATEONLY
    },
    gambar : {
        type : DataTypes.STRING
    },
    createdBy : {
        type : DataTypes.STRING
    },
    userId : {
        type : DataTypes.INTEGER
    }
},{
    freezeTableName:true
})

users.hasMany(artikel)
artikel.belongsTo(users, {foreignKey:'userId',onDelete :'CASCADE', onUpdate:'CASCADE'})

export default artikel