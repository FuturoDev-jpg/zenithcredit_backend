"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImageFromS3 = void 0;
const multer_1 = __importDefault(require("multer"));
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_s3_1 = __importDefault(require("multer-s3"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const s3 = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});
const deleteImageFromS3 = async (imageKey) => {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: imageKey
    };
    try {
        const command = new client_s3_1.DeleteObjectCommand(params);
        const result = await s3.send(command);
        console.log('Imagem deletada com sucesso', result);
        return result;
    }
    catch (error) {
        console.error('Erro ao deletar a imagem:', error);
        throw error;
    }
};
exports.deleteImageFromS3 = deleteImageFromS3;
const upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3,
        bucket: process.env.S3_BUCKET_NAME || "",
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const fileName = `${Date.now()}-${file.originalname}`;
            cb(null, fileName);
        },
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE
    }),
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error("Apenas arquivos PDF e imagens são permitidos"));
        }
    }
});
exports.default = upload;
