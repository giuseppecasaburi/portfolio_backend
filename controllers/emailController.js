import { Resend } from 'resend';

const sendEmail = async (req, res) => {
    const { name, surname, email, phoneNumber, message, policy } = req.body;

    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const dataOra = new Date().toLocaleString('it-IT');

        const { data, error } = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `Messaggio da ${name} ${surname || ''} - Portfolio`,
            text: `NUOVO MESSAGGIO DAL PORTFOLIO

                MESSAGGIO:
                ${message}

                DATI CONTATTO:
                Nome: ${name}
                Cognome: ${surname || 'Non inserito'}
                Email: ${email}
                Telefono: ${phoneNumber || 'Non inserito'}

                CONSENSO PRIVACY:
                L'utente ha ${policy ? 'ACCETTATO' : 'RIFIUTATO'} il trattamento dei dati personali
                Data e ora del consenso: ${dataOra}

                ---
                Questa email è stata generata automaticamente dal form di contatto del portfolio.`,
        });

        if (error) {
            throw new Error(error.message);
        }

        res.json({
            success: true,
            message: "Email inviata con successo!"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            type: "generic",
            message: `Errore nell'invio: ${error.message}`
        });
    }
};

export { sendEmail };