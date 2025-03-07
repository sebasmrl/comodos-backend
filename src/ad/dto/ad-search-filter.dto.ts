import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsPositive, IsString, Max, Min, MinLength } from "class-validator";

export class AdSearchFilterDto {

    @IsNumber({}, {message:'El parametro lat debe ser un numero entero válido'})
    @Transform(({ value} ) =>  Number(value) )
    lat:number;

    @IsNumber({}, {message:'El parametro lng debe ser un numero entero válido'})
    @Transform(({ value} ) =>  Number(value) )
    lng:number;

    @IsOptional()
    @IsInt({message: 'El parametro offset debe ser un numero entero válido'})
    @Min(0,{ message:'El parametro offset debe ser un numero mayor o igual a 0 '})
    @Transform(({ value} ) =>  Number(value) )
    offset?: number;

    @IsOptional()
    @IsInt({message: 'El parametro limit debe ser un numero entero válido'})
    @Min(1,{ message:'El parametro limit debe ser un numero mayor o igual a 1 '})
    @Transform(({ value} ) =>  Number(value) )
    limit?: number;

    @IsOptional()
    @IsNumber({}, { message: 'El parametro minPrice debe ser un numero válido' })
    @IsPositive({ message: 'El parametro minPrice debe ser un número positivo' })
    @Transform(({ value} ) =>  Number(value) )
    minPrice?: number;

    @IsOptional()
    @IsNumber({}, { message: 'El parametro minPrice debe ser un numero válido' })
    @IsPositive({ message: 'El parametro minPrice debe ser un número positivo' })
    @Transform(({ value} ) =>  Number(value) )
    maxPrice?: number;

    @IsOptional()
    @IsInt( { message: 'El parametro range debe ser un numero entero válido que corresponde a la unidad de medida km' })
    @IsPositive({ message: 'El parametro range debe ser un número positivo' })
    @Max(14000, {message:'Rango máximo de busqueda permitida es de 14000km'})
    @Transform(({ value} ) =>  Number(value) )
    range?: number;

    @IsOptional()
    @IsString({message:'El campo propertyType debe ser una cadena de texto'})
    @IsNotEmpty({message:'El campo period no puede ser vacio'})
    propertyType?:string;

    @IsOptional()
    @IsNotEmpty({message:'El campo period no puede ser vacio'})
    @IsString({message:'El campo period debe ser una cadena de texto'})
    period?:string;
   
}