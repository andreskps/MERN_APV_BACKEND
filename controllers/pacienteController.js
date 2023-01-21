import Paciente from "../models/Paciente.js";

const agregarPaciente=async(req,res) => {
    //console.log(req.body);

    const paciente = new Paciente(req.body);
    paciente.veterinario = req.veterinario._id; //lo trae del authmiddleware
    try {
        const pacienteSave = await paciente.save();
        res.json(
            pacienteSave
        )
    } catch (error) {
        console.log(error);
    }
}

const obtenerPacientes=async (req,res) => {
   const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario); //nos trae todos los pacientes del veterinario que inicio sesion
   
    res.json(
        pacientes
    )
}

const obtenerPaciente=async (req,res) => {
    //console.log(req.params.id);
    const {id} = req.params;
    const paciente = await Paciente.findById(id);

    //validamos que alguien que no creo el paciente no acceda a el
    if(!paciente) {
        return res.status(404).json({
            msg: "Paciente no encontrado"
        })
    }
    if(paciente.veterinario.toString() !== req.veterinario._id.toString()){ 
        return res.status(401).json({
            msg: "No tiene permiso"
        })
    }

    res.json({
        paciente
    })
}

const actualizarPaciente=async (req,res) => {
    const {id} = req.params;
    const paciente = await Paciente.findById(id);

    //validamos que alguien que no creo el paciente no acceda a el
    if(!paciente) {
        return res.status(404).json({
            msg: "Paciente no encontrado"
        })
    }
    if(paciente.veterinario.toString() !== req.veterinario._id.toString()){ 
        return res.status(401).json({
            msg: "No tiene permiso"
        })
    }

    //Actualizar Paciente, si no estan presentes en el req body lo deja igual
    paciente.nombre =req.body.nombre || paciente.nombre;
    paciente.propietario =req.body.propietario || paciente.propietario;
    paciente.email= req.body.email || paciente.email;
    paciente.fecha =req.body.fecha || paciente.fecha;
    paciente.sintomas=req.body.sintomas || paciente.sintomas;

    try {

        const pacienteUpdate = await paciente.save();
        res.json(
            pacienteUpdate
        )
        
    } catch (error) {
        console.log(error);
    }
}

const eliminarPaciente=async (req,res) => {
    const {id} = req.params;
    const paciente = await Paciente.findById(id);

    //validamos que alguien que no creo el paciente no acceda a el
    if(!paciente) {
        return res.status(404).json({
            msg: "Paciente no encontrado"
        })
    }
    if(paciente.veterinario.toString() !== req.veterinario._id.toString()){ 
        return res.status(401).json({
            msg: "No tiene permiso"
        })
    }

    try {

        await Paciente.deleteOne();
        res.json({
            msg: "Paciente eliminado"
        })
        
    } catch (error) {
        console.log(error);
    }
}
export{
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}