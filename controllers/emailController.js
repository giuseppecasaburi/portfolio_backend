import nodemailer from "nodemailer";

const sendEmail = async (req, res) => {
    // Config del transporter
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const { name, surname, email, phoneNumber, message } = req.body;

    try {
        // Contenuto dell'email
        const mailOptions = {
            from: email,
            to: process.env.EMAIL_USER,
            subject: `Messaggio da ${name} ${surname ? surname : ''} - Portfolio`,
            text:`${message}\n\n\n${name} ${surname ? surname : "Cognome non inserito"} \n${phoneNumber ? phoneNumber : "Numero non inserito"} 
                `,
        };

        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: "Email inviata con successo!"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            type: "generic",
            message: `Errore nell'invio ${error}`
        });
    };

}

export default sendEmail;