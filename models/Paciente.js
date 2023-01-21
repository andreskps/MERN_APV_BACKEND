import mongoose from "mongoose"


const pacientesSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true
    },
    propietario:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    sintomas:{
        type: String,
        required: true,
    },
    veterinario:{ //relacionamos con el veterinario
        type: mongoose.Schema.Types.ObjectId,
        ref: "Veterinario",
    },
},{
    timestamps: true //nos cree las columnas de creado y editado
});

const Paciente = mongoose.model("Paciente",pacientesSchema);

export default Paciente;