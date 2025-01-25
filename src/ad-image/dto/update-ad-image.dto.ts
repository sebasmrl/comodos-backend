import { PartialType } from '@nestjs/mapped-types';
import { CreateAdImageDto } from './create-ad-image.dto';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateAdImageDto {

    @IsString({ message: 'El campo name debe ser una cadena de carateres' })
    @MinLength(4, { message: 'EL campo name debe contener al menos 4 caracteres' })
    @MaxLength(10, { message: 'EL campo name debe ser menor o igual a 10 caracteres' })
    fieldName: string;
}
