import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FileSizePipe implements PipeTransform {
  transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    // "value" es un objeto que contiene los atributos y metadata del 'file' entranate
    const maxSize = 3000000;
    if(value.size < maxSize) return value;
    throw new BadRequestException(`El archivo ha excedido el peso limite de ${maxSize}`)
  }
}
