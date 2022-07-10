import Sequelize from "sequelize";
import dotenv from "dotenv";

dotenv.config({ path:"variables.env"})
const db = new Sequelize(process.env.BD_NOMBRE, process.env.BD_USER, process.env.BD_PASSWORD ?? "", {
    host: process.env.HOST,
    port: "3306",
    dialect: "mysql",
    define: {
        timestamps: true,
    },
    pool: {
        max: 6,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorsAliases: false
});

export default db;