
const mongoose = require("mongoose");

//Conectando o mongo ao nosso banco cujo nome é 'noderest', usando o mongoClient para conectar ao mongo
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
mongoose.Promise = global.Promise;

module.exports = mongoose;