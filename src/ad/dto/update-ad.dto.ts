import { PartialType } from '@nestjs/mapped-types';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { CreateAdDto } from './create-ad.dto';
import { Coords } from 'src/common/dto/coords.dto';


export class UpdateAdDto extends PartialType(CreateAdDto) {

     @IsOptional()
    @IsObject({ message: 'El campo coords debe ser un objeto {lat:number, lng:number}' })
    @ValidateNested()
    @Type(() => Coords)
    coords?: Coords
}
