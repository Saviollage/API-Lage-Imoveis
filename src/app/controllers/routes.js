const fs = require('fs');
const path = require('path');

//Para adicionar automaticamente ao projeto todos os controllers que serão criados
module.exports = app => {
    fs
        .readdirSync(__dirname)
        //para cada arquivo verifica se o nome nao começa com . e se o nome é diferente de 'index.js'
        .filter(file => ((file.indexOf('.')) !== 0 && (file !== "routes.js")))
        //para cada arquivo que passou na verificação acima, chama o require() passando o nome do arquivo e o app
        .forEach(file => require(path.resolve(__dirname, file))(app));
};