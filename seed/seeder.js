import categorias from "./categorias.js";
import db from "../config/db.js";
import precios from "./precios.js";
import { exit } from "node:process";
import { Precio, Categoria } from "../models/index.js"

const importarDatos = async () => {
    try {
        //Autenticar en la base de datos
        await db.authenticate();
        //Generar las columnas
        await db.sync();
        //Insertar los datos
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios)
        ])
        console.log("Datos importados correctamente");
        exit();
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

const eliminarDatos = async () => {
    try {
        await Promise.all([
            Categoria.destroy({ where: {} }),
            Precio.destroy({ where: {} })
        ]);
        console.log("Datos eliminados correctamente");
        exit();
    } catch (error) {
        console.log("Error al eliminar")
        console.log(error);
        exit(1);
    }
}

// Si mando a llamar a la funcion desde el script asociado a este seeder ejecuta importar datos
if(process.argv[2] === "-i"){
    importarDatos();
}
//Eliminar desde el command line
if(process.argv[2] === "-e"){
    eliminarDatos();
}