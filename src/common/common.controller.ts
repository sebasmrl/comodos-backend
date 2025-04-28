import { BadRequestException, Controller, Get, Inject, Param, ParseIntPipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CommonService } from './common.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';

@Controller('common')
export class CommonController {


    constructor(
        @Inject()
        private readonly commonService: CommonService
    ) { }
    
    
    @Post('csv')
    @Auth(ValidRoles.SUPER_ADMIN)
    @UseInterceptors(FileInterceptor('csv-file'))
    async uploadCsv(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }
        const results = await this.commonService.transformDANECsvToJson(file);
        return results;
    }


    @Get('/countries')
    async findAllCountries() {
        return this.commonService.findAllCountries();
    }

    
    @Get('/countries/country/:countryId')
    async findStatesByCountryId(
        @Param('countryId', ParseIntPipe) countryId: number
    ) {
        return this.commonService.findAllStatesByCountryId(countryId);
    }


    @Get('/countries/country/:countryId/state/:stateId')
    async findCitiesByStateId(
        @Param('countryId', ParseIntPipe) countryId: number,
        @Param('stateId', ParseIntPipe) stateId: number
    ) {
        return this.commonService.findAllCitiesByStateId({ countryId, stateId });
    }


    @Get('/countries/country/:countryId/state/:stateId/city/:cityId')
    async findCityId(
        @Param('countryId', ParseIntPipe) countryId: number,
        @Param('stateId', ParseIntPipe) stateId: number,
        @Param('cityId', ParseIntPipe) cityId: number
    ) {
        return this.commonService.findCityById({ countryId, stateId, cityId });
    }

}
