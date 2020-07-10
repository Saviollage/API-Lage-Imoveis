const mongoose = require("../../database");

const bcrypt = require("bcryptjs");

//O userSchema contem os campos do nosso banco na table Usuario
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true,
        select: false //para a informação nao aparecer na hora da chamada
    },

    passwordResetToken: {
        type: String,
        select: false
    },

    passwordResetExpires: {
        type: Date,
        select: false
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

//.pre é uma funcao do mongoose para realizar uma acao antes de outra, nesse caso, antes de 'save'
UserSchema.pre("save", async function (next) {
    //Engriptando a senha antes de salvar no banco utilizando um hash
    const hash = await bcrypt.hash(this.password, 10);
    //Salva a senha encriptada no banco sobrescrevendo a senha digitada pelo usuario
    this.password = hash;

    next();
});

//Apos definir o model user, declara como um Schema do Mongo
const User = mongoose.model("User", UserSchema);

//Exporta o User
module.exports = User;