import { PartialType } from '@nestjs/mapped-types';
import { CreatePackageTypeDto } from './create-package-type.dto';
import { IsDate } from 'class-validator';

export class UpdatePackageTypeDto extends PartialType(CreatePackageTypeDto) {
}
