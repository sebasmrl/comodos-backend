import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { CreateAdDto } from './create-ad.dto';
import { Coords } from 'src/common/dto/coords.dto';


export class UpdateAdDto extends PartialType(CreateAdDto) {

    @IsOptional()
    @IsObject({ message: 'El campo coords debe ser un objeto {lat:number, lng:number}' })
    @ValidateNested()
    @Type(() => Coords)
    coords?: Coords

    
    @IsOptional()
    @IsBoolean({message:'El campo renevalDate debe ser un valor boolean'})
    renevaldDate: boolean
    //days*24h*60min*60s*1000ms


    //opciones de relaciones
    //period:Period
  
}
