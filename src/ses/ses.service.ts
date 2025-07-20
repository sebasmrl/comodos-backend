import { Inject, Injectable } from '@nestjs/common';
import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SesService {

    private readonly sesClient: SESClient;
    constructor(
        @Inject()
        private readonly configService: ConfigService,
    ) {
        
        this.sesClient = new SESClient({
            region: configService.get('AWS_SES_REGION'),
            credentials: {
                accessKeyId: configService.get('AWS_ACCESS_KEY'),
                secretAccessKey: configService.get('AWS_SECRET_KEY')
            }
        });
    }


    async sendEmail() {
        const sendEmailCommand = this.createSendEmailCommand(
            "recipient@example.com",
            "sender@example.com",
        );

        try {
            return await this.sesClient.send(sendEmailCommand);
        } catch (caught) {
            if (caught instanceof Error && caught.name === "MessageRejected") {
                /** @type { import('@aws-sdk/client-ses').MessageRejected} */
                const messageRejectedError = caught;
                return messageRejectedError;
            }
            throw caught;
        }
    };


    private createSendEmailCommand(toAddress, fromAddress) {
        return new SendEmailCommand({
            Destination: {
                /* required */
                CcAddresses: [
                    /* more items */
                ],
                ToAddresses: [
                    toAddress,
                    /* more To-email addresses */
                ],
            },
            Message: {
                /* required */
                Body: {
                    /* required */
                    Html: {
                        Charset: "UTF-8",
                        Data: "HTML_FORMAT_BODY",
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: "TEXT_FORMAT_BODY",
                    },
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: "EMAIL_SUBJECT",
                },
            },
            Source: fromAddress,
            ReplyToAddresses: [
                /* more items */
            ],
        });
    };
}
