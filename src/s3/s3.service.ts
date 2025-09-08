import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DeleteObjectsCommand, DeleteObjectCommand, GetObjectCommand, ListObjectsCommand, PutObjectCommand, PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { CloudFrontClient, CreateInvalidationCommand } from "@aws-sdk/client-cloudfront";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';


@Injectable()
export class S3Service {

    private readonly s3Client: S3Client;
    private readonly cloudFrontClient: CloudFrontClient;

    constructor(
        @Inject()
        private readonly configService: ConfigService,
    ) {
        this.s3Client = new S3Client({
            region: configService.get('AWS_BUCKET_REGION'),
            //!no necesarias en ECS 
            /* credentials: {
                accessKeyId: configService.get('AWS_ACCESS_KEY'),
                secretAccessKey: configService.get('AWS_SECRET_KEY')
            } */
        })
        this.cloudFrontClient = new CloudFrontClient({
            region: 'us-east-1',
            //!no necesarias en ECS
            /* credentials: {
                accessKeyId: configService.get('AWS_ACCESS_KEY'),
                secretAccessKey: configService.get('AWS_SECRET_KEY')
            } */
        })
    }

    /**
     * @description Crea y/o actualiza un objecto de un bucket Oy retorna la URL de acceso al objeto desde la capa de CloudFront
     * @param file
     * @param fileKey 
     * @param fileKey 
     * @returns string
     */
    async uploadFile(file: Express.Multer.File, fileKey: string, envVariableBucketName: string = 'AWS_BUCKET_NAME') {
        const uploadParams: PutObjectCommandInput = {
            Bucket: this.configService.get(envVariableBucketName),
            Key: fileKey,
            Body: file.buffer,
            ContentType: file.mimetype,
            CacheControl: "max-age=600, s-maxage=3600"
        }
        //command solo describe las operaciones
        const command = new PutObjectCommand(uploadParams);
        await this.s3Client.send(command);
        await this.invalidateOneObject(this.configService.get('AWS_CLOUDFRONT_ID_DISTRIBUTION'), `/${fileKey}`)

        const result = this.getFileUrl(fileKey);
        return result;
    }


    /**
     * @description Obtiene la url de acceso a un objecto de bucket desde la capa de CloudFront
     * @param fileKey 
     * @returns string
     */
    getFileUrl(fileKey: string) {
        return `${this.configService.get('AWS_CLOUDFRONT_DOMAIN')}/${fileKey}`
    }


    /**
    * @description Elimina un objeto dentro de un bucket dada su fileKey
    * @param fileKey 
    * @param envVariableBucketName
    * @returns boolean | Error
    */
    async deleteFile(fileKey: string, envVariableBucketName: string = 'AWS_BUCKET_NAME') {
        const command = new DeleteObjectCommand({
            Bucket: this.configService.get(envVariableBucketName),
            Key: fileKey,
        });
        await this.s3Client.send(command);
        return true;
    }

    async deleteFiles(
        { fileKeys, envVariableBucketName = 'AWS_BUCKET_NAME' }: { fileKeys: string[], envVariableBucketName?: string }
    ) {
        const command = new DeleteObjectsCommand({
            Bucket: this.configService.get(envVariableBucketName),
            Delete: {
                Objects: [
                    ...fileKeys.map(key => ({ Key: key }))
                ]
            }
        });
        await this.s3Client.send(command);
        return true;
    }




    /**
     * @description Obtiene la url temporal de un Objecto dentro de un Bucket de forma directa
     * @deprecated  Esta funcion ya no se usará, puesto que se implementó la capa de AWS CloudFront
     * @param fileKey 
     * @param envVariableBucketName 
     * @returns string
     */
    //Se guarda la filekey (key.ext) en la entidad para saber que tipo devolver en la url temporal
    async getFileUrlFromBucketDirect(fileKey: string, envVariableBucketName: string = 'AWS_BUCKET_NAME') {
        const [key, ext] = fileKey.split('.');
        const command = new GetObjectCommand({
            Bucket: this.configService.get(envVariableBucketName),
            Key: key,
            ResponseContentDisposition: 'inline',
            ResponseContentType: `image/${ext}`
        });
        ;
        const result = await getSignedUrl(this.s3Client, command, { expiresIn: 600 }); //6min
        return result;
    }

    //No disponible para uso - sin objetivo de uso
    private async getFiles(file: Express.Multer.File, envVariableBucketName: string = 'AWS_BUCKET_NAME') {
        const command = new ListObjectsCommand({
            Bucket: this.configService.get(envVariableBucketName)
        });
        const rs = await this.s3Client.send(command);
        return rs;
    }




    private invalidateOneObject = async (distributionId: string, objectPathInCloudFront: string) => {
        const params = {
            DistributionId: distributionId, // Reemplázalo con tu ID de distribución
            InvalidationBatch: {
                CallerReference: `${Date.now()}`,
                Paths: {
                    Quantity: 1,
                    Items: [objectPathInCloudFront], // Ruta del objeto en CloudFront
                },
            },
        };

        try {
            const response = await this.cloudFrontClient.send(new CreateInvalidationCommand(params));
            if (response) return true;
        } catch (error) {
            console.error("Error al invalidar el objeto:", error);
            throw new InternalServerErrorException(`Error al invalidar el objeto con path: ${objectPathInCloudFront}`)
        }
    };


}
