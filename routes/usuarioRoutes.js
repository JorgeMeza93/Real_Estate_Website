import express from "express";
import { formularioLogin, formularioRegistro, formularioOlvidePassword, registrar, confirmar, resetPassword, comprobarTokenPassword, nuevoPassword } from "../controllers/usuarioController.js";

const router = express.Router();

router.get("/login", formularioLogin);
router.get("/registro", formularioRegistro);
router.post("/registro", registrar);
router.get("/olvide-password", formularioOlvidePassword);
router.post("/olvide-password", resetPassword)
router.get("/confirmar/:token", confirmar);

//Almacena el nuevo password
router.get("/olvide-password/:token", comprobarTokenPassword);
router.post("/olvide-password/:token", nuevoPassword);

export default router;