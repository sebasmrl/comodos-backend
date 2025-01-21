import { IsInt, IsObject, IsOptional, IsPositive, IsString, Matches, Max, MinLength, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { Coords } from "./coords.dto";


export class UpdateUserDto {

    
    @IsOptional()
    @IsString()
    @MinLength(10, { message: 'El campo password debe contener mínimo 10 caracteres' })
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'El campo password debe contener al menos una letra mayúscula, una letra minússcula y un numero'
    })
    password?: string;

    @IsOptional()
    @IsString()
    names?: string;

    @IsOptional()
    @IsString()
    lastnames?: string;

    @IsOptional()
    @IsInt()
    @IsPositive()
    phone?: number;

    @IsOptional()
    @IsPositive()
    @Max(999)
    @IsInt()
    phoneCode?: number;

    @IsOptional()
    @IsObject({message:'El campo coords debe ser un objeto {lat:number, lng:number}'})
    @ValidateNested() 
    @Type(() => Coords)
    coords?:Coords

}
