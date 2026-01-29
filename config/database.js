import { Sequelize } from "sequelize";

const db = new Sequelize('surya_insani','root', '',{
    host : 'localhost',
    dialect : "mysql",
})

export default db