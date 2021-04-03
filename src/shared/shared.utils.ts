import AWS from 'aws-sdk';

AWS.config.update({
  credentials: {
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET,
  },
});

const S3 = new AWS.S3();
const Bucket = 'instaclone-bucket';

export const uploadToS3 = async (file, userId, folderName) => {
  const { filename, createReadStream } = await file;
  const readStream = createReadStream();
  const objectName = `${folderName}/${userId}-${Date.now()}-${filename}`;
  const { Location } = await S3.upload({
    Bucket,
    Key: objectName,
    ACL: 'public-read',
    Body: readStream,
  }).promise();
  return Location;
};

export const deleteInS3 = async (fileUrl) => {
  const Key = fileUrl.replace(`https://${Bucket}.s3.amazonaws.com/`, '');
  await S3.deleteObject({
    Bucket,
    Key,
  }).promise();
};
