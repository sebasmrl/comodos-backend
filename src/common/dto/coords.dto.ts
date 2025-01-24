import { IsNumber, IsPositive } from "class-validator";

export class Coords{

    @IsNumber()
    lat:number;
    
    @IsNumber()
    lng: number
}