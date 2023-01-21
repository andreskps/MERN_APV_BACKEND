import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarID from "../helpers/generarId.js"; 
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";
import Paciente from "../models/Paciente.js";

//req es lo que mandamos al servidor y res es lo que nos responde el servidor
const registrar = async (req,res) => { //send muestra pantalla y json respuestas json para front
    //console.log(req.body); //para ver lo que se envia desde el front
    const {email,nombre} = req.body;

    //preveinir correos duplicados
    const existeVeterinario = await Veterinario.findOne({email}) //Busca por los diferentes atributos y vemos si existe
    if(existeVeterinario){
        res.status(400).json({
            msg: "El veterinario ya existe"
        });
        return;
    }
   
    try {
        //Guardar nuevo veterinario
        const veterinario = new Veterinario(req.body); //crea un nuevo objeto de veterinario
        const veterinarioGuardado= await veterinario.save();//guarda el objeto en la base de datos

        //Enviar email
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        })

        res.json(veterinarioGuardado); //luego que lo guarde mandamos el veterinario guardado
    } catch (error) {
        console.log(error);
    }
   
}

const perfil = (req,res) => { 
    //console.log(req.veterinario); //muestra el veterinario que esta logeado
    const {veterinario} = req
    res.json(
        veterinario
    );
}

const confirmarUser = async (req,res) => { //confirmara la creacion del usuario

    const {token} = req.params

    const usuarioConfirmar = await Veterinario.findOne({token});

    if(!usuarioConfirmar){
        res.status(400).json({
            msg: "Token no valido"
        });
        return;
    }

    try {
        usuarioConfirmar.confirmado = true;
        usuarioConfirmar.token = null; // se elimina el token
        await usuarioConfirmar.save(); //guarda el usuario ya con el valor de confirmado
        res.json({
            msg: "Confirmando usuario"
        });
    } catch (error) {
        console.log(error);
    }
}

const autenticar = async (req,res) => {
    const {email,password} = req.body; //accedemos a lo que el usuario coloque en el formulario
    
    //comprobar si el usuario existente
    const usuario = await Veterinario.findOne({email}) //mira si el email existe 
    if(!usuario){
        res.status(403).json({
            msg: "El usuario no existe"
        });
        return;
    }
    //comprobar si el usuario si confirmo su cuenta
    if(!usuario.confirmado){
        res.status(403).json({
            msg: "El usuario no ha confirmado su cuenta"
        });
        return;
    }
    //Comprobar clave
    //llama uno de los metodos de la isntancia que se encarga de comprobar el password y parametro el paswwword ingresafo
    const passwordCorrecto = await usuario.comprobarPassword(password); //compara la clave que el usuario coloco con la que esta en la base de datos
    if (!passwordCorrecto) { //si la clave no es correcta
        res.status(403).json({
            msg: "La clave no es correcta"
        })
        return;
    }

    //Autenticar usuario y generar JWT
    usuario.token =generarJWT(usuario.id)  //
    res.json({
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })


    //console.log("Autenticando usuario");
}

const olvidePassword = async(req, res) => {
//Revisar si el correo existe
   const {email} = req.body;

    const usuario = await Veterinario.findOne({email});//revisa si el email enviado existe 

    if(!usuario){
        res.status(403).json({
            msg: "El usuario no existe"
        });
        return;
    }

    try {
        usuario.token = generarID();
        await usuario.save();

        //enviar email con instrucciones
        emailOlvidePassword({
            nombre:usuario.nombre,
            email,
            token:usuario.token
        })
        res.json({
            msg: "Hemos enviado un email con las instrucciones"
        })
    } catch (error) {
        console.log(error);
    }
}

const comprobarToken = async (req, res) => {
    const {token} = req.params

    const user = await Veterinario.findOne({token});

    if(!user){
        res.status(400).json({
            msg: "Token no valido"
        });
        return;
    }

    res.json({
        msg: "Token valido"
    })

}

const actualizarPassword = async (req, res) => {
    const {token} = req.params
    const {password} = req.body

    const veterinario = await Veterinario.findOne({token})

    if(!veterinario){
        res.status(400).json({
            msg: "Hubo un error"
        });
        return;
    }

    try {

        veterinario.password = password;
        veterinario.token = null; 
        await veterinario.save();

        res.json({
            msg: "Contraseña actualizada"
        })
        
    } catch (error) {
        console.log(error);
    }
}

const actualizarPerfil = async (req, res) => {
    const {id} = req.params
    
    const veterinario = await Veterinario.findById(id)

    if(!veterinario){
        res.status(400).json({
            msg: "Hubo un error"
        });
        return;
    }

    const {email} = req.body;
    if(veterinario.email !== req.body.email){ //si ingreso un eamil nuevo
        const existeEmail = await Veterinario.findOne({email})

        if(existeEmail){
            res.status(400).json({
                msg: "El email ya esta registrado"
            });
            return;
        }
    }


    try {

        veterinario.nombre = req.body.nombre ;
        veterinario.email = req.body.email ;
        veterinario.telefono = req.body.telefono ;
        veterinario.web = req.body.web;

        const veterinarioActualizado = await veterinario.save()

        res.json(
            veterinarioActualizado
        )
        
    } catch (error) {
        console.log(error);
    }
    
   
}

const nuevoPassword = async (req, res) => {
    const {id} = req.params
    
    const {pwd_actual,pwd_nuevo} = req.body

    const veterinario = await Veterinario.findById(id)

    if(!veterinario){
        res.status(400).json({
            msg: "Hubo un error"
        });
        return;
    }

    try {

        const passwordCorrecto = await veterinario.comprobarPassword(pwd_actual); //compara la clave que el usuario coloco con la que esta en la base de datos
        if (!passwordCorrecto) {
          //si la clave no es correcta
          res.status(403).json({
            msg: "La clave no es correcta",
          });
          return;
        } 

        veterinario.password = pwd_nuevo;
        await veterinario.save();

        res.json({
            msg: "Contraseña actualizada"
        })
    } catch (error) {
        console.log(error);
    }
}


export {
    registrar,
    perfil,
    confirmarUser,
    autenticar,
    olvidePassword,
    comprobarToken,
    actualizarPassword,
    actualizarPerfil,
    nuevoPassword
}