const mongoose = require("../../database");
const aws = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
    region: process.env.AWS_DEFAULT_REGION
});

const ImageSchema = new mongoose.Schema({
    name: {
        type: String,

    },
    size: {
        type: Number
    },
    key: {
        type: String
    },
    url: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property"
    }
});


ImageSchema.pre("save", function () {
    if (!this.url) {
        this.url = `${process.env.APP_URL}:${process.env.PORT}/files/${this.key}`
    }
    
});

ImageSchema.pre("remove", function () {
    if (process.env.STORAGE_TYPE === "s3") {
        return s3
            .deleteObject({
                Bucket: process.env.BUCKET_NAME,
                Key: this.key
            })
            .promise()
            .then(response => {
                console.log(response.status);
            })
            .catch(response => {
                console.log(response.status);
            });
    } else {
        return promisify(fs.unlink)(
            path.resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', this.key)
        );
    }
});



//Apos definir o model image, declara como um Schema do Mongo
const Image = mongoose.model("Image", ImageSchema);

//Exporta a Image
module.exports = Image;