import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const passResend = process.env.RESEND_API_KEY;
const resend = new Resend("re_RTNGNP75_47rypHAFmdAkmNPidYcW1sH9");

const sendEmail = async (req, res) => {
    const { name, surname, email, phoneNumber, message, policy } = req.body;

    try {
        console.log('Tentativo invio email...');

        const { data, error } = await resend.emails.send({
            from: 'Portfolio <onboarding@resend.dev>', // usa questo per test, poi il tuo dominio
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `Messaggio da ${name} ${surname ? surname : ''} - Portfolio`,
            text: `${message}\n\n\nDa: ${name} ${surname ? surname : "Cognome non inserito"}\nEmail: ${email}\nTelefono: ${phoneNumber ? phoneNumber : "Numero non inserito"}`,
        });

        if (error) {
            throw new Error(error.message);
        }

        console.log('Email inviata con successo! ID:', data.id);

        // Salvataggio dati nel Log (identico a prima)
        const dataToSave = `\n===== Nuovo invio (${new Date().toLocaleString()}) =====
            Nome: ${name}
            Cognome: ${surname || 'Non inserito'}
            Email: ${email}
            Telefono: ${phoneNumber || 'Non inserito'}
            Messaggio: ${message}
            Consenso Privacy: ${policy ? 'SI' : 'NO'} in data ${new Date().toLocaleString()}
==============================================================\n`;

        const filePath = path.join(__dirname, 'contatti.txt');
        await fs.promises.appendFile(filePath, dataToSave);

        console.log('Dati salvati con successo!');

        res.json({
            success: true,
            message: "Email inviata con successo!"
        });

    } catch (error) {

        console.error('Errore:', error);
        res.status(500).json({
            success: false,
            type: "generic",
            message: `Errore nell'invio: ${error.message}`
        });
    }
};

const readLog = (req, res) => {
    const logPath = path.join(__dirname, 'contatti.txt');

    try {
        if (fs.existsSync(logPath)) {
            const data = fs.readFileSync(logPath, 'utf8')
            res.json({
                success: true,
                logs: data,
                message: 'File trovato'
            })
        } else {
            res.json({
                success: false,
                message: 'File non trovato (probabilmente cancellato dal restart)'
            })
        }
    } catch (error) {
        res.json({
            success: false,
            error: error.message
        })
    }
}

export { sendEmail, readLog };