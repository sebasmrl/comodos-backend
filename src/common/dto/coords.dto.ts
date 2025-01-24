import { IsNumber, IsPositive } from "class-validator";

export class Coords{
    
    @IsNumber({}, { message: 'El campo lat es un valor numero requerido' })
    lat:number;

    @IsNumber({}, { message: 'El campo lat es un valor numero requerido' })
    lng:number;
}