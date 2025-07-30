import { IsString, Matches, MinLength } from "class-validator";



export class UpdatePasswordRepeatMethodDto {

    @IsString({message:'El campo currentPassword debe ser una cadena de caracteres'})
    @MinLength(10, { message: 'El campo currentPassword debe contener mínimo 10 caracteres' })
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'El campo currentPassword debe contener al menos una letra mayúscula, una letra minúscula y un numero'
    })
    currentPassword: string;

    @IsString({message:'El campo newPassword debe ser una cadena de caracteres'})
    @MinLength(10, { message: 'El campo newPassword debe contener mínimo 10 caracteres' })
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'El campo newPassword debe contener al menos una letra mayúscula, una letra minúscula y un numero'
    })
    newPassword: string;
}