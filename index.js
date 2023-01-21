import express from 'express'; //importamos express
import dotenv from 'dotenv'; //importamos dotenv
import cors from 'cors'; //importamos cors, protege una api 
import conectarBD from './config/db.js'
import veterinarioRoutes from './routes/veterinarioRoutes.js'; 
import pacienteRoutes from './routes/pacienteRoutes.js';
//crear servidor
const app = express();

app.use(express.json()); //le decimos que le enviaremos formatos json
//habilitar dotenv
dotenv.config();

//conectar a la base de datos
conectarBD(process.env.MONGO_URI); //pasamos la variable de entorno

//habilitar cors
const dominiosPermitidos =[process.env.FRONTEND_URL]

const opcionesCors = {
    origin: function (origin,callback)  {
        if (dominiosPermitidos.indexOf(origin) !== -1) {
            //El origen esta permitido
            callback(null,true)
        }else {
            //El origen no esta permitido
            callback(new Error('No permitido por CORS'))
        }
    }
}

app.use(cors(opcionesCors)); 

//rutas
app.use("/api/veterinarios",veterinarioRoutes);
app.use("/api/pacientes",pacienteRoutes);
//puerto de la app
const port = process.env.PORT || 4000;

app.listen(port,() => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});

