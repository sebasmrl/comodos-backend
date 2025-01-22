import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';




@Injectable()
export class AllowedImageTypePipe implements PipeTransform {
  constructor(
    private readonly extensions: string[]
  ) {}

  transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    // "value" es un objeto que contiene los atributos y metadata del 'file' entranate
    const [type, extension] = value.mimetype.split('/');
    if(type=="image" && this.extensions.includes(extension))return value;
    throw new BadRequestException(`Imagen`)
  }
}
