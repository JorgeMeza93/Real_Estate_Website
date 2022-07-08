import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js";

const app = express();
//Habilitar Routing
app.use(express.static("public"));
app.set("view engine", "pug");
app.set("views", "./views");    //Especificamos el nombre de la carpeta y la ruta
//Routing
app.use("/auth", usuarioRoutes);
const port = 4000;
app.listen(port, () => {
    console.log("El servidor está funcionando en el puerto 4000");
});