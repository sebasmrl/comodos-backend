import { Transform } from "class-transformer";
import { IsDate, IsEmail, IsIn, IsInt, IsOptional, IsPositive, IsString, Matches, Max, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    

    @IsEmail({},{message:'El campo email debe ser un email valido'})
    email: string;

    @IsString({message:'El campo password debe ser una cadena de caracteres'})
    @MinLength(10,{ message:'El campo password debe contener mínimo 10 caracteres'})
    @Matches(
            /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
            message: 'El campo password debe contener al menos una letra mayúscula, una letra minúscula y un numero'
        })
    password: string;

    
    @IsString({message:'El campo names debe ser una cadena de carateres'})
    @MinLength(2)
    @MaxLength(30)
    names: string;

    @IsString({message:'El campo lastnames debe ser una cadena de carateres'})
    @MinLength(2)
    @MaxLength(30)
    lastnames: string;

    @IsString({message:'El campo gender debe ser una cadena de carecteres'})
    @IsIn(['M','F'], { message:'El campo gender debe ser un caracter que esté en [M,F]'})
    @IsOptional()
    gender: string;

    @Transform((param)=>{
        return new Date(param.value);
    } )
    @IsDate({message:'El campo birthdate debe tener una fecha en formato AAAA-MM-DD'})
    birthdate: Date;

    @IsString({message:'El campo nationality es requerido y debe ser una cadena de caracteres'})
    nationality: string;

    @IsInt({message:'El campo phone es un valor entero'})
    @IsPositive({ message:'El campo phone debe ser un valor positivo'})
    phone: number;

    @IsPositive({ message:'El campo phone debe ser un valor positivo'})
    @Max(999,{ message:'El campo phoneCode debe ser menor o igual a 999'})
    @IsInt({message:'El campo phoneCode es un valor entero'})
    phoneCode: number;

    
}
