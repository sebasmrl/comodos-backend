import { PartialType } from '@nestjs/mapped-types';
import { CreateAdPeriodDto } from './create-ad-period.dto';

export class UpdateAdPeriodDto extends PartialType(CreateAdPeriodDto) {}
