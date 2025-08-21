const validateEmailInput = (req, res, next) => {
    const { name, surname, email, phoneNumber, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: "Compilare i campi obbligatori" });
    }

    if (name.length < 3) {
        return res.status(400).json({ message: "Il nome deve essere di almeno 3 caratteri" })
    }

    if (surname != "") {
        if(surname.length < 3) {
            return res.status(400).json({ message: "Il cognome deve essere di almeno 3 caratteri" })
        }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Email non valida" });
    };

    const phoneRegex = /^[0-9+]+$/;
    if (phoneNumber != "") {
        if (!phoneRegex.test(phoneNumber)) {
            return res.status(400).json({ message: "Numero di telefono non valido" });
        };

        if (phoneNumber.length < 8 || phoneNumber.length > 13) {
            return res.status(400).json({ message: "Il numero di telefono deve essere compreso tra 8 e 13 numeri" });
        }
    }

    if (message.length < 3 || message.length > 500) {
        return res.status(400).json({ message: "Il testo deve essere compreso tra 3 e 500 caratteri" });
    }

    next();
};

export default validateEmailInput;