const mongoose = require("../../database");

//O propertySchema contem os campos do nosso banco na table Usuario
const PropertySchema = new mongoose.Schema({
    // TITULO DO ANUNCIO
    title: {
        type: String,
        required: true
    },
    // DESCRIÇÃO
    description: {
        type: String
    },
    // PREÇO
    price: {
        type: Number
    },
    // TIPO IMÓVEL ~ Casa, Apto, Sítio, Lote, etc etc
    type: {
        type: String
    },
    // DISPONÍVEL PARA VENDA
    forSale: {
        type: Boolean
    },
    // DISPONÍVEL PARA LOCAÇÃO
    forRent: {
        type: Boolean
    },
    // LOCALIZAÇÃO
    address: {
        type: String,
        required: true
    },
    // QUANTIDADE DE QUARTOS
    qtdRooms: {
        type: Number
    },
    // QUANTIDADE DE BANHEIROS
    qtdBathrooms: {
        type: Number
    },
    // QUANTIDADE DE VAGAS DE GARAGEM
    qtdGarage: {
        type: Number
    },
    // SE O IMÓVEL POSSUI SUÍTE
    haveSuit: {
        type: Boolean
    },
    // ÁREA TOTAL
    totalArea: {
        type: Number
    },
    // DIMENSÃO FRONTAL DO TERRENO
    frontDimensions: {
        type: Number
    },
    // DIMENSÃO LATERAL DO TERRENO
    sideDimensions: {
        type: Number
    },
    // DEFINIR SE O IMÓVEL ESTÁ VISIVEL
    active: {
        type: Boolean,
        default: true
    },
    // IMAGENS DO IMÓVEL
    images: [{
        type: String
    }],
    views: {
        type: Number,
        default: 0
    },
    highlight: {
        type: Boolean,
        default: false
    },
    fullAddress: {
        type: Object
    }

});

//Apos definir o model property, declara como um Schema do Mongo
const Property = mongoose.model("Property", PropertySchema);

//Exporta o property
module.exports = Property;