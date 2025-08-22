import express from "express";
import cors from "cors";
import configDotenv from "dotenv";
import validateEmailInput from "./middlewares/validateEmailInput.js";
import {sendEmail, readLog } from "./controllers/emailController.js";

const app = express();
const port = 3000;

configDotenv.config();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Test Esito Positivo");
});

app.post("/contact", validateEmailInput, sendEmail);

app.get("/contact/read", readLog);

app.listen(port, () => {
    console.log("Porta in ascolto");
});