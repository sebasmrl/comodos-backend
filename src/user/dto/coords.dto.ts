import { IsNumber, IsPositive } from "class-validator";

export class Coords{

    @IsNumber()
    @IsPositive()
    lat:number;
    
    @IsNumber()
    @IsPositive()
    lng: number
}