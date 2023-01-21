import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generarID from "../helpers/generarId.js";

const VeterinarioSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true //elimina los espacios en blanco de inicio y fin
    },
    password:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono:{
        type: String,
        default: null,
        trim: true
    },
    web:{
        type: String,
        default: null
    },
    token:{
        type: String,
        default: generarID()
    },
    confirmado:{
        type: Boolean, //cuando verifique la cuenta pasara a true
        default: false
    }
});

//lo que hara antes de guardarlo
VeterinarioSchema.pre('save',async function(next){
    //encriptar el password
    if (!this.isModified("password")) { //si ya modifico la clave no lo haga, evitar inconvenientes
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);

});

//metodo para comparar password
VeterinarioSchema.methods.comprobarPassword = async function(password){
    return await bcrypt.compare(password,this.password);  //primero es el password del formulario y el otro el hasheado
}

const Veterinario = mongoose.model("Veterinario",VeterinarioSchema);

export default Veterinario;