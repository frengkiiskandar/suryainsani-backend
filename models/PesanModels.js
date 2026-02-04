import { Sequelize } from "sequelize";
import db from "../config/database.js";

const {DataTypes} = Sequelize

const pesan = db.define('pesan',{
    nama :{
        type :DataTypes.STRING,
        allowNull:false,
        validate : {
            notNull : true
        }
    },
    email :{
        type :DataTypes.STRING,
        allowNull:false,
        validate : {
            notNull : true
        }
    },
    telp :{
        type :DataTypes.STRING,
        allowNull:false,
        validate : {
            notNull : true
        }
    },
    subjek :{
        type : DataTypes.STRING,
        allowNull:true,
    },
    pesan :{
        type :DataTypes.STRING
    }

},{
    freezeTableName:true
})

export default pesan