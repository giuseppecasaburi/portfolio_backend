import nodemailer from "nodemailer";
import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sendEmail = async (req, res) => {
    // Config del transporter
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        debug: true, // abilita debug dettagliato
        logger: true // abilita logging
    });

    const { name, surname, email, phoneNumber, message, policy } = req.body;

    try {

        console.log('Tentativo invio email...');

        // Contenuto dell'email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            replyTo: email,
            to: process.env.EMAIL_USER,
            subject: `Messaggio da ${name} ${surname ? surname : ''} - Portfolio`,
            text: `${message}\n\n\nDa: ${name} ${surname ? surname : "Cognome non inserito"}\nEmail: ${email}\nTelefono: ${phoneNumber ? phoneNumber : "Numero non inserito"}`,
        };

        await transporter.sendMail(mailOptions);

        // Salvataggio dati nel Log
        const dataToSave = `\n===== Nuovo invio (${new Date().toLocaleString()}) =====
            Nome: ${name}
            Cognome: ${surname || 'Non inserito'}
            Email: ${email}
            Telefono: ${phoneNumber || 'Non inserito'}
            Messaggio: ${message}
            Consenso Privacy: ${policy ? 'SI' : 'NO'} in data ${new Date().toLocaleString()}
==============================================================\n`
            ;

        // Percorso del file .txt dove salvare i dati
        const filePath = path.join(__dirname, 'contatti.txt');

        // Salviamo i dati appendendoli al file (usando promisified version)
        await fs.promises.appendFile(filePath, dataToSave);

        console.log('Dati salvati con successo!');

        res.json({
            success: true,
            message: "Email inviata con successo!"
        });

    } catch (error) {

        console.error('=== ERRORE DETTAGLIATO ===');
        console.error('Messaggio:', error.message);
        console.error('Codice:', error.code);
        console.error('Stack:', error.stack);

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