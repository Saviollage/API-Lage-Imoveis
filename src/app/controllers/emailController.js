const express = require("express");
const nodemailer = require("nodemailer");

var router = express.Router();

router.post("/sendEmail", async (req, res) => {
    const { userMail, subject, text } = req.body;

    try {
        const transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        let sendMail = await transport.sendMail({
            from: '"🏠 Lage Imóveis" <lageimoveis2020@gmail.com>',
            to: "lageimoveis@uol.com.br",
            cc: "eustaquio.lage@uol.com.br",
            replyTo: userMail,
            subject: subject, // Subject line
            text: `📩 VOCÊ ACABOU DE RECEBER UM NOVO EMAIL PELO SITE 📩\n\n` +
                `👤 ` + userMail + ` 👤\n\n` + text,
        });



        if (sendMail.response.toString().includes("OK"))
            return res.send({ "message": "Email enviado com sucesso!" });
        else
            return res.status(400).send({ "error": "Email Não enviado" })
    }
    catch (e) {
        res.status(400).send(e);
        //return res.status(400).send({ "error": "Error on email" })
    }
});



module.exports = app => app.use("/email", router);