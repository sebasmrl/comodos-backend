import { IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class UpdateUserDto {

    @IsString()
    @IsOptional()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña debe ser al menos una mayuscula, una miniscula y un valor numérico'
    })
    password?:string;
    
    @IsString()
    @IsOptional()
    @MinLength(2)
    @MaxLength(25)
    names?:string;
    
    @IsString()
    @IsOptional()
    @MinLength(2)
    @MaxLength(25)
    lastNames?:string;
}
