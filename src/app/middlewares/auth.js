const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth");

//Intercepta o usuario pelo Middleware para ele proseguir somente se o token fornecido estiver correto
module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    //3 verificações simples de token para não sobrecarregar o sistema com a verificação mais pesada o tempo todo
    if (!authHeader) return res.status(401).send({ error: "No token provided" });

    const parts = authHeader.split(" ");

    if (!parts.length === 2)
        return res.status(401).send({ error: "Token error" });

    const [scheme, token] = parts;

    //verifica se a variavel scheme contem o texto Bearer ( que é a base de todo token )
    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).send({ error: "Token malformatted" });
    }

    //Verificação final do token (mais pesada), pega o token enviado pelo user e compara com o token gerado pelo sistema baseado na secretKey
    jwt.verify(token, authConfig.secretKey, (err, decoded) => {
        //Verifica se houve algum erro, caso positivo, retorna erro ao usuario
        if (err) return res.status(401).send({ error: "Token invalid" });

        //Se nao houve erro, prossegue
        req.userId = decoded.id;
        return next();
    });
};