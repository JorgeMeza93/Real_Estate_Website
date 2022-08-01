import jwt from "jsonwebtoken";
import { Usuario } from "../models/index.js"

const protegerRuta = async (req, res, next)=> {
    //Verificar si hay un token a través de la existencia del token
    const { _token } = req.cookies;
    if( !_token ){
        return res.redirect("/auth/login");
    }
    //Comprobar el Token
    try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRET);
        const usuario = await Usuario.scope("eliminarPassword").findByPk(decoded.id);
        console.log(usuario);
        //Almacenar el usuario al req
        if(usuario){
            req.usuario = usuario;
        }
        else{
            res.redirect("/auth/login");
        }
        return next();
    } catch (error) {
        return res.clearCookie("_token").redirect("auth/login");
    }
    next();
}

export default protegerRuta;