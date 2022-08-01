import bcrypt from "bcrypt";

const usuarios = [
    {
        nombre: "Jorge",
        email: "jorberiver@gmail.com",
        confirmado: 1,
        password: bcrypt.hashSync("password", 10)
    }
]

export default usuarios;