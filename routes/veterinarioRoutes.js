import express from 'express';
import {registrar,perfil,confirmarUser,autenticar,olvidePassword,comprobarToken,actualizarPassword,actualizarPerfil,nuevoPassword} from '../controllers/veterinarioController.js';
import verificarAuteticacion from '../middleware/authmiddleware.js';

const router = express.Router();

//Area publica
router.post('/',registrar) //post porque enviamos datos al servidor
router.get("/confirmar/:token", confirmarUser)
router.post("/login",autenticar) //post porque enviaremos datos 
router.post("/olvide-password",olvidePassword) //enviaremos correo donde podamos validar que existe
router.get("/olvide-password/:token",comprobarToken) //obtenemos el token desde el email
router.post("/olvide-password/:token",actualizarPassword) //actualizamos la contraseña

//Area privada
//una vez que visita el perfil primero abre el middleware para saber a quien pertenece y luego la funcion de perfil
router.get("/perfil",verificarAuteticacion,perfil) //get para obtenr dstos del servidor
router.put("/perfil/:id",verificarAuteticacion,actualizarPerfil)
router.put("/cambiar-password/:id",verificarAuteticacion,nuevoPassword)
export default router;