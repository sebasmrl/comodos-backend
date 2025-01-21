import { Transform } from "class-transformer";
import { IsDate, IsEmail, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, Max, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {


    @IsInt({message:'El campo dni debe ser un valor numerico entero'})
    @IsPositive()
    dni: number;


    @IsEmail({},{message:'El campo email debe ser un email valido'})
    email: string;

    @IsString()
    @MinLength(10,{ message:'El campo password debe contener mínimo 10 caracteres'})
    password: string;

    
    @IsString()
    names: string;

    @IsString()
    lastnames: string;

    @IsString()
    @IsIn(['M','F'])
    @IsOptional()
    gender: string;

    @Transform((param)=>{
        return new Date(param.value);
    } )
    @IsDate()
    birthdate: Date;

    @IsString()
    nationality: string;

    @IsInt()
    @IsPositive()
    phone: number;

    @IsPositive()
    @Max(999)
    @IsInt()
    phoneCode: number;

    
}
