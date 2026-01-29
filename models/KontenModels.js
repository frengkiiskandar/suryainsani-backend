import { Sequelize } from "sequelize";
import db from "../config/database.js";

const {DataTypes} = Sequelize

const konten = db.define('konten',{
    judul :{
        type : DataTypes.STRING,
        allowNull:false
    },
    image :{
        type : DataTypes.STRING,
        allowNull:false
    },
    link :{
        type : DataTypes.STRING,
        allowNull:false
    },
    platform :{
        type : DataTypes.STRING,
        allowNull:false
    },
    deskripsi :{
        type : DataTypes.STRING,
        allowNull:false
    },
    userId :{
        type : DataTypes.INTEGER,
        allowNull:false,
        validate:{
            notEmpty:true
        }
    },
},{
    freezeTableName : true
})

export default konten
