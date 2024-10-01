import { PartialType } from '@nestjs/mapped-types';
import { CreatePackageTypeDto } from './create-package-type.dto';

export class UpdatePackageTypeDto extends PartialType(CreatePackageTypeDto) {
}
