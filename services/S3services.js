const AWS = require('aws-sdk');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadSingleFile = upload.single('file'); // Middleware for handling single file uploads

const uploadToS3 = (data, filename) => {
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.USER_KEY;
    const IAM_USER_SECRET = process.env.SECRET_KEY;

    const s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
    });

    const params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ContentType: 'application/octet-stream', // Use a default if file.mimetype is unavailable
        ACL: 'public-read',
    };

    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, response) => {
            if (err) {
                console.error("Error uploading to S3:", err);
                reject(err);
            } else {
                resolve(response.Location);
            }
        });
    });
};

module.exports = {
    uploadToS3,
    uploadSingleFile,
};
