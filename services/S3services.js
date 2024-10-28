const AWS=require('aws-sdk');
const uploadToS3=(data, filename)=>{
    const BUCKET_NAME=process.env.BUCKET_NAME;
    const IAM_USER_KEY=process.env.USER_KEY;
    const IAM_USER_SECRET=process.env.SECRET_KEY;

    let s3bucket=new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET
    })

    var params={
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    }
    return new Promise((resolve, reject)=>{
        s3bucket.upload(params, (err,response)=>{
            if(err){
                console.log(err);
                reject(err);
            }
            else{
                resolve(response.Location);
            }
        })
    })
}

module.exports={
    uploadToS3
}