import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateAdPeriodDto {

        @IsString({ message: 'El campo name debe ser una cadena de carateres' })
        @MinLength(2, { message: 'EL campo name debe contener al menos 2 caracteres' })
        @MaxLength(20, { message: 'EL campo name debe ser menor o igual a 20 caracteres' })
        name: string;
}
