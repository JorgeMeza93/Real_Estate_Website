import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import propiedadesRoutes from "./routes/propiedadesRoutes.js";
import db from "./config/db.js";
import csrf from "csurf";
import cookieParser from "cookie-parser";


const app = express();
// Habilitar lectura de datos de formularios
app.use( express.urlencoded({ extended: true }))
//Habilitar Cookie Parser
app.use(cookieParser());
//Habilitar Cookie Parser
app.use( csrf({ cookie: true }));
//Conexión a la base de datos
try {
    await db.authenticate();
    db.sync();
    console.log("Conexión exitosa a la base de datos")
} 
catch (error) {
    console.log("Error en la conexión a la base de datos \n" + error);
}
//Carpeta pública
app.use(express.static("public"));
//Habilitar Pug
app.set("view engine", "pug");
app.set("views", "./views");    //Especificamos el nombre de la carpeta y la ruta
//Routing
app.use("/auth", usuarioRoutes);
app.use("/", propiedadesRoutes);
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log("El servidor está funcionando en el puerto 4000");
});