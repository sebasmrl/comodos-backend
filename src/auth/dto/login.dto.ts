import { IsEmail, IsString, Matches, MinLength } from "class-validator";

export class LoginDto{

        @IsEmail({},{message:'El campo email debe ser un email valido'})
        email: string;
    
        @IsString({message:'El campo password debe ser una cadena de caracteres'})
        @MinLength(10,{ message:'El campo password debe contener mínimo 10 caracteres'})
        @Matches(
                /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
                message: 'El campo password debe contener al menos una letra mayúscula, una letra minússcula y un numero'
            })
        password: string;
}