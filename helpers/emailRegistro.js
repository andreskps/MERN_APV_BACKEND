import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {

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
        subject: 'Comprueba tu cuenta en APV',
        text: 'Compruebe tu cuenta',
        html: `
        <h1>Comprueba tu cuenta en APV</h1>
        <p>Hola ${nombre}</p>
        <p>Para verificar tu cuenta, haz click en el siguiente enlace</p>
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Verificar cuenta</a>

        <p>Si tu no creste esta cuenta, puedes ignorar este mensaje</p>
        `
      });
      console.log('Mensaje enviado', info.messageId); 
}

export default emailRegistro;