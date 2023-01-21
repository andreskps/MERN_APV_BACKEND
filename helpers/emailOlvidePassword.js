import nodemailer from 'nodemailer';


const emailOlvidePassword = async (datos) => {

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      //Enviar email
      const {email,nombre,token} = datos;
      const info = await transport.sendMail({
        from: "Administrador de Pacientes de Veterinaria",
        to: email, //lo manda al email 
        subject: 'Reestablece tu Password',
        text: 'Reestablece tu Password',
        html: `
        <h1>Comprueba tu cuenta en APV</h1>
        <p>Hola ${nombre}</p>
        <p>Para Reestablecer tu password, haz click en el siguiente enlace</p>
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password/a>
        
        <p>Si tu no creste esta cuenta, puedes ignorar este mensaje</p>
        `
      });
      console.log('Mensaje enviado', info.messageId); 
}

export default emailOlvidePassword;