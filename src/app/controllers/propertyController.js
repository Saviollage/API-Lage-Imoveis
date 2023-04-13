const express = require("express");
const authMiddleware = require("../middlewares/auth");

const Property = require("../models/property");
const Image = require("../models/image");
const generateSearchFields = require("../service/searchFields");

const router = express.Router();
//router.use(authMiddleware); 

//Define a rota de listagem de imóveis
router.get("/all", authMiddleware, async (req, res) => {
    try {
        //Retorna todos os imóveis para nossa variavel properties e ainda adiciona a essa requisição a tabela user
        const properties = await Property.find().sort({ views: -1 });

        //retorna a lista de imóveis
        return res.send(properties);
    } catch (err) {
        return res.status(400).send({ error: "Error listing properties " });
    }
});

router.get("/home", async (req, res) => {
    try {
        //Retorna todos os imóveis para nossa variavel properties e ainda adiciona a essa requisição a tabela user
        const properties = await Property.find().sort({ views: -1 });
        const homeObj = {
            search: generateSearchFields(properties),
            highlights: [],
            houses: [],
            apartaments: [],
            area: [],
            rooms: []
        };

        properties.reduce((acc, property) => {
            if (property.highlight) {
                acc.highlights.push(property);
            }
            else if (property.type === 'Casa') {
                acc.houses.push(property);
            }
            else if (property.type === 'Apartamento') {
                acc.apartaments.push(property);
            }
            else if (property.type === 'Área' || property.type === 'Terreno' || property.type === 'Lote') {
                acc.area.push(property);
            }
            else if (property.type === 'Sala' || property.type === 'Loja') {
                acc.rooms.push(property);
            }
            return acc;
        }, homeObj);
        //retorna a lista de imóveis
        return res.send(homeObj);
    } catch (err) {
        console.log(err)
        return res.status(400).send({ error: "Error listing properties ", details: err.message });
    }
});




//Define a rota de listagem de imóveis
router.get("/", async (req, res) => {
    try {
        //Retorna todos os imóveis para nossa variavel properties e ainda adiciona a essa requisição a tabela user
        const properties = await Property.find({ ...req.query, active: 1 }).sort({ views: -1 });

        //retorna a lista de imóveis
        return res.send(properties);
    } catch (err) {
        return res.status(400).send({ error: "Error listing properties " });
    }
});

//Define a rota de listagem  individual de imóvel
router.get("/:propertyId", async (req, res) => {
    try {
        //Retorna o imóvel cuja id foi requisitada para nossa variavel properties 
        const property = await Property.findByIdAndUpdate(
            req.params.propertyId,
            {
                $inc: { views: 1 }
            });

        await property.save();

        return res.send(property);
    } catch (err) {
        console.log(err)
        return res.status(400).send({ error: "Error listing property" });
    }
});

//Define a rota de criar propriedade
router.post("/", authMiddleware, async (req, res) => {
    try {
        //Cria um propriedade com o conteudo do body passado pelo usuario

        const data = req.body
        if (!data.price)
            data.price = 600
        const property = await Property.create(data);

        //Salva o imóvel
        await property.save();

        return res.send(property);
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: "Error creating new property" });
    }
});

//Define a rota de atualizar o imóvel
router.put("/:propertyId", authMiddleware, async (req, res) => {
    try {
        //Atualiza um imóvel com o conteudo do body passado pelo usuario
        const property = await Property.findOneAndUpdate(
            {
                _id: req.params.propertyId
            },
            req.body,
            {
                //Apenas para tirar o DeprecationWarning que aparecia
                useFindAndModify: false,

            }
        );

        //Salva o imóvel
        await property.save();

        return res.send(property);
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: "Error updating property" });
    }
});

//Define a rota de deletar  projeto
router.delete("/:propertyId", authMiddleware, async (req, res) => {
    try {
        //Retorna o projeto cuja id foi requisitad para nossa variavel projects e ainda adiciona a essa requisição a tabela user
        const property = await Property.findById(
            req.params.propertyId,
            {
                //Apenas para tirar o DeprecationWarning que aparecia
                useFindAndModify: false
            }
        );
        await property.remove();

        const images = await Image.find({
            'property': req.params.propertyId
        })

        await await Promise.all(images.map(async img => {
            await img.remove();
        }));

        return res.json({
            message: "Propriedade excluída com sucesso!",
            property
        });
    } catch (err) {
        return res.status(400).send({ error: "Error deleting property" });
    }
});

//Utiliza o app que mandamos pro controller no index.js, aqui estamos repassando o router para o app com o prefixo '/property'
module.exports = app => app.use("/properties", router);