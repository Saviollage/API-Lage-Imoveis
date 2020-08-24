const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");

/*  Dois tipos de storage (Local e S3) */
const storageTypes = {
    local: multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'));
        },
        filename: (req, file, callback) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) callback(err);
                /*  Definindo o novo nome de arquivo precedido por um HASH  */
                file.key = `${hash.toString('hex')}-${file.originalname}`;
                callback(null, file.key);
            });
        },
    }),

    s3: multerS3({
        /*  Config s necessárias para o s3 bucket */
        s3: new aws.S3(
            {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
                region: process.env.AWS_DEFAULT_REGION
            }
        ),
        /*  Nome do bucket criado */
        bucket: process.env.BUCKET_NAME,
        /*  Definir como conteúdo automatico */
        contentType: multerS3.AUTO_CONTENT_TYPE,
        /*  Liberar permissão para leitura dos arquivos do bucket */
        acl: 'public-read',
        /*  Semelhante ao filename do localStorage -> Nome da imagem a ser gravada no s3 */
        key: (req, file, callback) => {

            crypto.randomBytes(16, (err, hash) => {
                if (err) {
                    callback(err);
                }

                const filename = `${hash.toString('hex')}-${file.originalname}`;
                callback(null, filename);
            });
        }
    })
}

module.exports = {

    dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    storage: storageTypes[process.env.STORAGE_TYPE],
    limits: {
        // 10 MB 
        fileSize: 10 * 1024 * 1024
    },
    // fileFilter é para fazer verificação de formatos dos arquivos
    fileFilter: (req, file, callback) => {
        const allowedMimes = ["image/jpeg",
            "image/pjpeg",
            "image/png",
            "image/gif"];

        if (allowedMimes.includes(file.mimetype)) {
            // callback tem o primeiro parametro sendo o erro, como aqui foi um caso de sucesso, o erro é null
            callback(null, true)
        }
        else {
            callback(new Error('Invalid file type'));
        }
    }
};