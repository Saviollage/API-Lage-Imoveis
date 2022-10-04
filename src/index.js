require("dotenv").config();
const express = require("express");
const morgan = require("morgan");

const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());
//Fazendo o app aceitar parametros json
app.use(express.json());
//Fazendo o app aceitar os parametros pela URL
app.use(express.urlencoded({ extended: false }));

app.use(morgan('dev'));

app.use(
    "/files",
    express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
);

//repassa o app ao controller (de forma a mante-lo unico no sistema), para importar os modulos presentes na pasta controller
require("./app/controllers/routes")(app);

app.get('*', (req,res) => {
    return res.redirect("http://www.lageimoveis.com.br/");
})

port = process.env.PORT;

//Rodar o app em uma porta (nesse caso, 3000)
app.listen(port);

console.log("Server running on port " + port)
