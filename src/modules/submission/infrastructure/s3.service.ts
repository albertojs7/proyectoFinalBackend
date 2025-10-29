import { PutObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class S3Service {
    private s3Client: S3Client;

    constructor() {
        console.log('S3Service initializing with:');
        console.log('Region:', process.env.AWS_REGION);
        console.log('Bucket:', process.env.AWS_S3_BUCKET);
        console.log('Access Key ID:', process.env.AWS_ACCESS_KEY_ID?.substring(0, 5) + '...');
        console.log('Secret Key exists:', !!process.env.AWS_SECRET_ACCESS_KEY);

        this.s3Client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
            }
        });
    }

    async getPresignedUrl(fileName: string): Promise<string>{
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: fileName
        });

        const presignedUrl = await getSignedUrl(
            this.s3Client,
            command,
            { expiresIn: 900 } // 15 minutos
        );

        console.log('Generated presigned URL:', presignedUrl.substring(0, 50) + '...');
        return presignedUrl;
    }

    async getPresignedDownloadUrl(fileName: string): Promise<string>{
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: fileName
        });

        const presignedUrl = await getSignedUrl(
            this.s3Client,
            command,
            { expiresIn: 3600 } // 1 hora para descargar
        );

        console.log('Generated download URL:', presignedUrl.substring(0, 50) + '...');
        return presignedUrl;
    }
}