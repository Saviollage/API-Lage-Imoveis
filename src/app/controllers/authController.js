const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth");
const User = require("../models/user");
const router = express.Router();

//Definimos uma função que vai gerar um token com valiadde de 1 dia
function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secretKey, {
        //Define o tempo de expiração do token em segundos, neste caso, 1 dia
        expiresIn: 86400
    });
}

// Rota de registro do usuário
router.post("/createUser", async (req, res) => {
    //Recebo apenas o email enviado pelo usuario na requisição
    const { email, name, password } = req.body;

    try {
        //Verifica se o email cadastrado ja existe no sistema
        if (await User.findOne({ email }))
            return res.status(400).send({ error: "User already exists" });

        //Criando um usuario com todos os parametros presentes no body da aplicação
        const user = await User.create(req.body);

        //Ocultando a senha no retorno da api
        user.password = undefined;

        //Retorno da api com um token gerado baseado apenas na id do usuario
        return res.send({ user, token: generateToken({ id: user.id }) });
    } catch (err) {
        
        return res.status(400).send({ error: "Registration failed" });
    }
});

//Rota de autenticação do usuário
router.post("/authenticate", async (req, res) => {
    //Cecebo o email e senha enviados pelo usuario na requisição
    const { email, password } = req.body;

    //Como o password em /models/User.js está com select false para nao aparecer em requisições publicas,
    // adicionamos a função .select() passando o password como parametro para ser retornado pela API
    const user = await User.findOne({ email }).select("+password");

    //Verifica se o email está correto
    if (!user) return res.status(400).send({ error: "User not found" });

    //Verifica a compatibilidade das senhas
    if (!(await bcrypt.compare(password, user.password)))
        return res.status(400).send({ error: "Invalid password" });

    //Ocultando a senha no retorno da api
    user.password = undefined;

    //Retornando user com token gerado apenas baseado na id do usuario
    res.send({ user, token: generateToken({ id: user.id }) });
});


//Utiliza o app que mandamos pro controller no index.js, aqui estamos repassando o router para o app com o prefixo '/auth'
module.exports = app => app.use("/auth", router);