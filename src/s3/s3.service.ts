import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DeleteObjectCommand, GetObjectCommand, ListObjectsCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';


@Injectable()
export class S3Service {

    private readonly s3Client: S3Client;
    constructor(
        @Inject()
        private readonly configService: ConfigService,
    ) {
        this.s3Client = new S3Client({
            region: configService.get('AWS_BUCKET_REGION'),
            credentials: {
                accessKeyId: configService.get('AWS_ACCESS_KEY'),
                secretAccessKey: configService.get('AWS_SECRET_KEY')
            }
        })
    }   


    async uploadFile(file: Express.Multer.File, fileKey:string, envVariableBucketName:string = 'AWS_BUCKET_NAME') {

        const key = fileKey.split('.')[0];

        const uploadParams = {
            Bucket: this.configService.get(envVariableBucketName),
            Key: key,  //.${file.mimetype.split('/')[1]}
            Body: file.buffer,
            ContentType: file.mimetype
        }
        //command solo describe las operaciones
        const command = new PutObjectCommand(uploadParams);
        await this.s3Client.send(command);

        const result =  await this.getFile(fileKey)
        return result;
    }

    
    //Se guarda la filekey (key.ext) en la entidad para saber que tipo devolver en la url temporal
    async getFile(fileKey:string, envVariableBucketName:string = 'AWS_BUCKET_NAME') {
        const [key, ext] = fileKey.split('.');
        const command = new GetObjectCommand({
            Bucket: this.configService.get(envVariableBucketName),
            Key: key,
            ResponseContentDisposition: 'inline',
            ResponseContentType: `image/${ext}`
        });
;
        const result =  await getSignedUrl(this.s3Client, command, { expiresIn: 600}); //6min
        return result;
    }


    async deleteFile(fileKey:string, envVariableBucketName:string = 'AWS_BUCKET_NAME') {
        const key = fileKey.split('.')[0];
        const command = new DeleteObjectCommand({
            Bucket: this.configService.get(envVariableBucketName),
            Key: key,
        });
        await this.s3Client.send(command);
        return true;
    }


    //No disponible para uso - sin objetivo de uso
    private async getFiles(file: Express.Multer.File, envVariableBucketName:string = 'AWS_BUCKET_NAME') {
        const command = new ListObjectsCommand({
            Bucket: this.configService.get(envVariableBucketName)
        });
        const rs = await this.s3Client.send(command);
        return rs;
    }
}
