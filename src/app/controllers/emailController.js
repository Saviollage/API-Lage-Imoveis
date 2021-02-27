const express = require("express");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

var router = express.Router();

router.post("/sendEmail", async (req, res) => {
    const { userMail, subject, text } = req.body;

    try {
        const createTransporter = async () => {
            const oauth2Client = new OAuth2(
                process.env.OAUTH_CLIENT_ID,
                process.env.OAUTH_SECRET,
                "https://developers.google.com/oauthplayground"
            );

            oauth2Client.setCredentials({
                refresh_token: process.env.REFRESH_TOKEN
            });
            
            const accessToken = await new Promise((resolve, reject) => {
                oauth2Client.getAccessToken((err, token) => {
                    if (err) {
                        reject("Failed to create access token :(");
                    }
                    resolve(token);
                });
            });
            const transport = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    type: "OAuth2",
                    user: process.env.EMAIL_USER,
                    accessToken,
                    clientId: process.env.OAUTH_CLIENT_ID,
                    clientSecret: process.env.OAUTH_SECRET,
                    refreshToken: process.env.REFRESH_TOKEN
                }
            });

            return transport
        }



        const transport = await createTransporter()

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