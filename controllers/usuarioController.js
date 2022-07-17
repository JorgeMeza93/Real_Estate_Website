import Usuario from "../models/Usuario.js";
import { check, validationResult } from "express-validator";
import { generarID } from "../helpers/tokens.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/emails.js";
import bcrypt from "bcrypt";

const formularioLogin = (req, res) => {
    res.render("auth/login", {
        pagina: "Iniciar Sesión",
        csrfToken: req.csrfToken()
    });
}
const formularioRegistro = (req, res) => {
    res.render("auth/registro", {
        pagina: "Crear Cuenta",
        csrfToken: req.csrfToken()
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
            csrfToken: req.csrfToken(),
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
            csrfToken: req.csrfToken(),
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
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();
    res.render("auth/confirmar-cuenta", {
        pagina: "Cuenta confirmada",
        mensaje: "La cuenta se ha confirmado correctamente", 
        error: false
    })
    next();
}

const formularioOlvidePassword = (req, res) => {
    res.render("auth/olvidePassword", {
        pagina: "¿Olvidaste tu password? Recuperala",
        csrfToken: req.csrfToken()
    })
}

const resetPassword = async (req, res) => {
    //Validación
    await check("email").isEmail().withMessage("Eso no parece un email").run(req);
    let resultado = validationResult(req);
    //Verificacion del resultado este vacío
    if(!resultado.isEmpty()){
        //Si hay errotes
        return res.render("auth/olvidePassword", {
            pagina: "Recupera tu acceso a Bienes Raíces Pipo",
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }
    //Buscar al usuario del email
    const { email } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });
    if( !usuario ){
        return res.render("auth/olvidePassword", {
            pagina: "Recupera tu acceso a Bienes Raíces Pipo",
            csrfToken: req.csrfToken(),
            errores: [{ mensaje: "El email introducido no pertence a ningun usuario"} ]
        });
    }
    //Generar un token y enviarlo al email encontrado
    usuario.token = generarID();
    await usuario.save();
    //Enviar un email
    emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    });
    //Renderizar vista con mensaje
    res.render("templates/mensaje", {
        pagina: "Restablece tu password",
        mensaje: "Hemos enviado un correo electrónico con las instrucciones"
    })
}

const comprobarTokenPassword = async (req, res, next) => {
    const { token } = req.params;
    const usuario = await Usuario.findOne( {where: {token}} );
    if( !usuario ){
        return res.render("auth/confirmar-cuenta", {
            pagina: "Restablece tu password",
            mensaje: "Hubo un error al validar tu información, intenta nuevamente", 
            error: true
        })
    }
    //El usuario comprobó el token correctamente y se muestra formulario para modificar password
    res.render("auth/reset-password", {
        pagina: "Restablece tu password",
        csrfToken: req.csrfToken()

    })
}
const nuevoPassword = async (req, res) => {
    //Validar el nuevo password
    await check("password").isLength({ min: 6 }).withMessage("El password debe ser de al menos 6 cáracteres").run(req);
    let resultado = validationResult(req);
    if( !resultado.isEmpty() ){
        //errores
        return res.render("auth/reset-password",{
            pagina: "Restablece tu password",
            csrfToken: req.csrfToken(), 
            errores: resultado.array()
        });
    }
    const { token } = req.params;
    const { password } = req.body
    //Identificar el usuario que ha hecho el reset
    const usuario = await Usuario.findOne( { where: {token}});
    //Hashear el nuevo password
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);
    usuario.token = null;
    await usuario.save();
    res.render("auth/confirmar-cuenta", {
        pagina: "Password Restablecido",
        mensaje: "El password se guardó correctamente"
    })
}

 //Autenticar
 const autenticar = async (req, res) => {
    console.log("Autenticando");
    //Validación
    await check("email").isEmail().withMessage("El email es obligatorio").run(req);
    await check("password").notEmpty().withMessage("El password es obligatorio").run(req);
    let resultado = validationResult(req);
    if( !resultado.isEmpty() ){
        return res.render("auth/login", {
            pagina: "Iniciar Sesión",
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }
}
export { formularioLogin, formularioRegistro, formularioOlvidePassword, registrar, confirmar, resetPassword, comprobarTokenPassword, nuevoPassword, autenticar };
