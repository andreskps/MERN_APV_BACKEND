import mongoose from "mongoose";

const conectarBD = async (cadena) => {

    try {
        const db = await mongoose.connect(`${cadena}`,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const url = `${db.connection.host}:${db.connection.port}`;
        console.log(`Conectado a la base de datos en ${url}`);
    } catch (error) {
        console.log(error.message);
        process.exit(1); //detener la app
    }
}

export default conectarBD;