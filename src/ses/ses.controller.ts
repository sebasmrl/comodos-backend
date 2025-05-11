import { Controller } from '@nestjs/common';
import { SesService } from './ses.service';

@Controller('ses')
export class SesController {
  constructor(private readonly sesService: SesService) {}
}
