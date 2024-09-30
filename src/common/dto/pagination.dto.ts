import { Transform, Type } from "class-transformer";
import { IsBoolean, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto{

    @IsOptional()
    @IsPositive()
    @Type( ()=> Number )  //enableImplicitConvertions:true
    limit?:number;
    
    @IsOptional()
    @Min(0)
    @Type( ()=> Number )  //enableImplicitConvertions:true
    offset?:number;

    @IsBoolean()
    @IsOptional()
    @Transform(({ value} ) => { 
        //console.log("TRANSFORM: ",typeof value, value)
        return  (value == 'false' || value==false) 
                ? false: true;
        } )
    activeEntries?:boolean;
}