import Usuario from "../models/Usuario.js";
import { check, validationResult } from "express-validator";
import { generarID } from "../helpers/tokens.js";

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
    const password = req.body.password;
    //Validación
    await check("nombre").notEmpty().withMessage("El nombre no puede ir vacío").run(req);
    await check("email").isEmail().withMessage("Eso no parece un email").run(req);
    await check("password").isLength({ min:6 }).withMessage("El password debe de ser al menos de 6 caracteres").run(req);
    await check("repetir-password").equals(password).withMessage("Los passwords no son iguales").run(req)
    let resultado = validationResult(req);
    //Verificacion del resultado este vacío
    if(!resultado.isEmpty()){
        //Si hay errotes
        return res.render("auth/registro", {
            pagina: "Crear Cuenta",
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }
    //Si existe un correo ya registrado mandar mensaje de error
    const existeUsuario = await Usuario.findOne({ where: { email: req.body.email } });
    if(existeUsuario){
        return res.render("auth/registro", {
            pagina: "Crear Cuenta",
            errores: [{msg: "El usuario ya esta registrado"}],
            usuario: {
                nombre: req.body.nombre,   // <-- Evitamos que los datos de los campos del formulario se pierdan
                email: req.body.email
            }
        })
    }
    const usuario = await Usuario.create({
        nombre: req.body.nombre,
        email: req.body.email,
        password: req.body.password,
        token: generarID()

    });
    res.json(usuario)
}
const formularioOlvidePassword = (req, res) => {
    res.render("auth/olvidePassword", {
        pagina: "¿Olvidaste tu password? Recuperala"
    })
}

export { formularioLogin, formularioRegistro, formularioOlvidePassword, registrar };