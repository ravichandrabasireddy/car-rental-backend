import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
@Injectable()
export class BlobService {
    private storage: Storage;
    private bucketName: string;
    constructor(){
        this.storage = new Storage({
            keyFilename: process.env.SERVICE_ACCOUNT_KEY_PATH
        });
        this.bucketName = process.env.STORAGE_BUCKET_NAME;
    }

    async uploadFile(file: Express.Multer.File): Promise<{ url: string }> {
        return new Promise((resolve, reject) => {
            const bucket = this.storage.bucket(this.bucketName);
            const blob = bucket.file(file.originalname);
            const blobStream = blob.createWriteStream();

            blobStream.on('error', (err) => {
                console.error(err);
                reject(err);
            });

            blobStream.on('finish', async () => {
                const publicUrl = `${process.env.PUBLIC_IMAGE_URL}/${blob.name}`;
                resolve({ url: publicUrl });
            });

            blobStream.end(file.buffer);
        });
    }
}
