import { Transform } from "class-transformer";
import { IsBoolean, IsDecimal, IsIn, IsInt, IsOptional, IsPositive, IsString, Max, Min, MinLength } from "class-validator";
import { Currency } from "src/common/constants/currency.constant";

/// Solo tiene acceso el Admin
export class CreatePackageTypeDto {

    @IsString()
    @MinLength(3)
    @Transform(({ value} ) => { 
        if(typeof value == 'string'){
            
        }
        return  value;
    } )
    name: string; // unico, dual, arrendador, arrendador-multiple

    @IsPositive()
    price: number;

    @IsString()
    @IsOptional()
    @IsIn( [Currency.COP, Currency.EUR, Currency.GBP, Currency.USD])
    currencyCode?: Currency;

    @IsOptional()
    @Min(0)
    @Max(100)
    discount?: number;
    
    @IsInt()
    @IsPositive()
    tickets: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsOptional()
    @IsInt()
    @Min(2024)
    since?:number = new Date().getFullYear()

}
