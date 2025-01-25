import { IsUUID } from "class-validator";
import { Ad } from "src/ad/entities/ad.entity";

export class CreateAdImageDto {
    @IsUUID('all',{message:'El campo ad es requerido y debe ser un UUID valido'})
    ad:Ad
}
