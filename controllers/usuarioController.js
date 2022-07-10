import Usuario from "../models/Usuario.js";
import { check, validationResult } from "express-validator";

const formularioLogin = (req, res) => {
    res.render("auth/login", {
        pagina: "Iniciar Sesión"
    });
}
const formularioRegistro = (req, res) => {
    res.render("auth/registro", {
        pagina: "Crear Cuenta"
    })
}
const registrar = async (req, res) => {
    //Validación
    await check("nombre").notEmpty().withMessage("El nombre no puede ir vacío").run(req);
    await check("email").isEmail().withMessage("Eso no parece un email").run(req);
    await check("password").isLength({ min:6 }).withMessage("El password debe de ser al menos de 6 caracteres").run(req);
    await check("repetir-password").equals("password").withMessage("Los passwords no son iguales").run(req)
    let resultado = validationResult(req);
    res.json( resultado.array());
    const usuario = await Usuario.create(req.body);
    console.log(usuario);
    res.json(usuario)
}
const formularioOlvidePassword = (req, res) => {
    res.render("auth/olvidePassword", {
        pagina: "¿Olvidaste tu password? Recuperala"
    })
}

export { formularioLogin, formularioRegistro, formularioOlvidePassword, registrar };