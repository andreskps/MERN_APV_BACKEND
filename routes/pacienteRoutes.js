import express from "express";
import { agregarPaciente,obtenerPacientes,obtenerPaciente,actualizarPaciente,eliminarPaciente } from "../controllers/pacienteController.js";
import verificarAuteticacion from "../middleware/authmiddleware.js";

const router = express.Router();

//cuando es la misma ruta 
//en el metodo verificarAutenticacion almacena en el req, el veterinario con dicho token y lo hace disponible para cualquier lugar de la app
router.route('/')
    .post(verificarAuteticacion,agregarPaciente)
    .get(verificarAuteticacion,obtenerPacientes);

    //crud paciente
router.route('/:id')
    .get(verificarAuteticacion,obtenerPaciente)
    .put(verificarAuteticacion,actualizarPaciente)
    .delete(verificarAuteticacion,eliminarPaciente);
        


export default router;