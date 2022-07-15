import Usuario from "../models/Usuario.js";
import { check, validationResult } from "express-validator";
import { generarID } from "../helpers/tokens.js";
import { emailRegistro } from "../helpers/emails.js";
import { NUMERIC } from "sequelize";

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
    //Almacenar un usuario
    const usuario = await Usuario.create({
        nombre: req.body.nombre,
        email: req.body.email,
        password: req.body.password,
        token: generarID()

    });
    //Enviar email de confirmacion
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })
    //Mostrar mensaje de confirmacion
    res.render("templates/mensaje", {
        pagina: "Cuenta creada correctamente",
        mensaje: "Hemos enviado un Email de confirmación, presiona en el enlace"
    })
}
const confirmar = async (req, res, next) => {
    //Verificar si el token es válido
    const usuario = await Usuario.findOne({ where: { token: req.params.token } } )
    if(!usuario){
        return res.render("auth/confirmar-cuenta", {
            pagina: "Error al confirmar tu cuenta",
            mensaje: "Hubo un error al confirmar tu cuenta, intenta nuevamente", 
            error: true
        })
    }
    next();
}

const formularioOlvidePassword = (req, res) => {
    res.render("auth/olvidePassword", {
        pagina: "¿Olvidaste tu password? Recuperala"
    })
}

export { formularioLogin, formularioRegistro, formularioOlvidePassword, registrar, confirmar };