import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path:"variables.env"});

const emailRegistro = async (datos) =>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.ENV_PORT,
        auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
        }
    });
    const { email, nombre, token } = datos;
    //Enviar el email
    await transport.sendMail({
        from: "BienesRaicesPipo",
        to: email,
        subject: "Reestablece tu password de Bienes Raices Pipo",
        text: "Reestablece tu password de Bienes Raices Pipo",
        html: `
            <p>Hola ${nombre} has solicitado restablecer tu password en BienesRaices Pipo </p>
            <p>Reestablecela haciendo click en el siguiente enlace</p>
            <p><a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 4000}/auth/confirmar/${token}">Confirmar cuenta </a></p>
            <p>Si tu no has creado esta cuenta, ignora este mensaje</p>
        `
    });
}

const emailOlvidePassword = async (datos) =>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.ENV_PORT,
        auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
        }
    });
    const { email, nombre, token } = datos;
    //Enviar el email
    await transport.sendMail({
        from: "BienesRaicesPipo",
        to: email,
        subject: "Confirma tu cuenta en Bienes Raices Pipo",
        text: "Confirma tu cuenta en Bienes Raices Pipo",
        html: `
            <p>Hola ${nombre} confirma tu cuenta en BienesRaices Pipo </p>
            <p>Tu cuenta ya está lista, sólo necesitas confirmarla haciendo click en el siguiente enlace</p>
            <p><a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 4000}/auth/olvide-password/${token}">Restablecer Password</a></p>
            <p>Si tu no has solicitado este cambio, ignora este mensaje</p>
        `
    });
}

export { emailRegistro, emailOlvidePassword };