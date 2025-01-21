import { Transform, Type } from "class-transformer";
import { IsBoolean, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto{

    @IsOptional()
    @Min(0)
    @Type( ()=> Number)
    skip?: number;
    
    @IsOptional()
    @IsPositive()
    @Type( ()=> Number)
    limit?: number;

    @IsBoolean()
    @IsOptional()
    @Transform(({ value} ) => { 
        //console.log("TRANSFORM: ",typeof value, value)
        return  (value == 'false' || value==false) 
                ? false: true;
        } )
    activeRegisters?:boolean;
}