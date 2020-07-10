const express = require("express");
const multer = require("multer");
const multerConfig = require("../../config/multer");
const router = express.Router();

const authMiddleware = require("../middlewares/auth");
const Image = require("../models/image");
const Property = require("../models/property");



// Multer passado como middleware da rota para o upload de um unico arquivo
router.post('/new', authMiddleware, multer(multerConfig).single('file'), async (req, res) => {
    try {
        const { originalname: name, size, key, location: url = '' } = req.file;
        const { property } = req.body;

        const image = await Image.create({
            name,
            size,
            key,
            url,
            property
        });

        const prop = await Property.findById(property);

        prop.images.push(image.url);
        await prop.save();

        return res.json(image);
    }
    catch (err) {

        return res.status(400).json(err);
    }

});

router.get('/list', authMiddleware, async (req, res) => {
    try {

        const image = await Image.find();

        return res.json(image);
    }
    catch (err) {
        return res.status(400).json(err);
    }

});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {

        const image = await Image.findById(
            req.params.id
        );

        await image.remove();

        if (image)
            return res.json({
                message: "Imagem excluída com sucesso!"
            });

    }
    catch (err) {
        return res.status(400).json({ message: "Ocorreu um erro na hora de excluir este registro" });
    }

});

router.delete('/byProperty/:propertyId/:index', authMiddleware, async (req, res) => {
    try {

        const property = await Property.findById(
            req.params.propertyId);

        const image = await Image.findOne(
            {
                url: property.images[req.params.index]
            }
        );
        await image.remove();
        if (image) {

            if (req.params.index > -1) {
                property.images.splice(req.params.index, 1);
            }
            await property.save();
            return res.json({
                message: "Imagem excluída com sucesso!"
            });

        }

    }
    catch (err) {
        return res.status(400).json({ message: "Ocorreu um erro na hora de excluir este registro" });
    }

});

//Utiliza o app que mandamos pro controller no index.js, aqui estamos repassando o router para o app com o prefixo '/files'
module.exports = app => app.use("/files", router);