import { IsIn, IsInt, IsObject, IsOptional, IsPositive, IsString, Matches, Max, MinLength, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { Coords } from "../../common/dto/coords.dto";


export class UpdateUserDto {

    @IsOptional()
    @IsString({ message: 'El campo password debe ser una cadena de caracteres' })
    @MinLength(10, { message: 'El campo password debe contener mínimo 10 caracteres' })
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'El campo password debe contener al menos una letra mayúscula, una letra minúscula y un numero'
    })
    password?: string;

    @IsOptional()
    @IsString({ message: 'El campo names debe ser una cadena de carateres' })
    names?: string;

    @IsOptional()
    @IsString({ message: 'El campo lastnames debe ser una cadena de carateres' })
    lastnames?: string;

    @IsOptional()
    @IsInt({ message: 'El campo phone es un valor entero' })
    @IsPositive({ message: 'El campo phone debe ser un valor positivo' })
    phone?: number;

    @IsOptional()
    @IsPositive({ message: 'El campo phone debe ser un valor positivo' })
    @Max(999, { message: 'El campo phoneCode debe ser menor o igual a 999' })
    @IsInt({ message: 'El campo phoneCode es un valor entero' })
    phoneCode?: number;

    @IsOptional()
    @IsObject({ message: 'El campo coords debe ser un objeto {lat:number, lng:number}' })
    @ValidateNested()
    @Type(() => Coords)
    coords?: Coords

    @IsString({ message: 'El campo gender debe ser una cadena de caracteres' })
    @IsIn(['M', 'F'], { message: 'El campo gender debe ser un caracter que esté en [M,F]' })
    @IsOptional()
    gender ?: string;

}
