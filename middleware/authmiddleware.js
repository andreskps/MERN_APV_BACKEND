import jwt from 'jsonwebtoken';
import Veterinario from '../models/Veterinario.js';

const verificarAuteticacion = async (req,res,next) => {

    //console.log(req.headers.authorization);   
    //const {authorization} = req.headers;
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){ //se comprueba que les esten enviando un tojen y tenga el Bearer
       try {
         token=req.headers.authorization.split(' ')[1]; //quita la palabra bearer para quedar solo con el token
         const decoded = jwt.verify(token, process.env.JWT_SECRET); //verifica el token, le mandamos el token y la palabra secreta
         req.veterinario = await Veterinario.findById(decoded.id).select
         ("-password -token -confirmado"); //busca el veterinario por el id y trae todo menos el password,token,confirmado y req para almacenar la session
    
         return next();

       } catch (error) {
           
            return res.status(401).json({
              //si el token no es valido
              msg: "Token no valido",
            });
       }
    }
 
    if (!token) {
        res.status(403).json({ //si no tiene token o beares
            msg: "No tiene autorizacion"
        });
    }
   
    next();
    
};

export default verificarAuteticacion;