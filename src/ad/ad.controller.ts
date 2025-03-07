import { ProfileImageService } from './../profile-image/profile-image.service';
import { AdImageService } from './../ad-image/ad-image.service';
import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseUUIDPipe, Query } from '@nestjs/common';
import { AdService } from './ad.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/user/entities/user.entity';
import { AdSearchFilterDto } from './dto/ad-search-filter.dto';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { AdImage } from 'src/ad-image/entities/ad-image.entity';
import { Transaction } from 'typeorm';

@Controller('adds')
export class AdController {
  constructor(
    private readonly adService: AdService,
    private readonly adImageService: AdImageService,
    private readonly profileImageService:ProfileImageService
  ) { }

  @Auth()
  @Post()
  async create(@Body() createAdDto: CreateAdDto, @Req() req: Request) {
    const user: User = req['user'];
    return await this.adService.create(createAdDto, user);
  }

  //*Endpoint principal de filtrado para anuncios
  @Get()
  async findAll(@Query() filter: AdSearchFilterDto) {
    const data = await this.adService.findAll(filter);

    const rs = Promise.all( data.map(async (ad) => {
        const { owner_id, owner_image, owner_names, owner_lastnames } = ad;
        delete ad.owner_id;
        delete ad.owner_image, 
        delete ad.owner_names, 
        delete ad.owner_lastnames;

        const images = await this.adImageService.findAllAdImagesByAdId(ad.id);
        const profileImage = await this.profileImageService.findOneProfileImageFromDB(owner_image);
        
        const owner = { id: owner_id, names: owner_names, lastnames: owner_lastnames, profileImage }
        return { ...ad, images, owner }
      })
    )
    return rs;
  }

  @Get('/user/:id')
  findAllByUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.adService.findAllAddsByUserId(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adService.findOne(id);
  }

  @Auth(ValidRoles.USER, ValidRoles.SUPER_ADMIN)
  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateAdDto: UpdateAdDto, @Req() req: Request) {
    const user: User = req['user'];
    return await this.adService.update(id, updateAdDto, user);
  }

  @Auth(ValidRoles.USER, ValidRoles.SUPER_ADMIN)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const user: User = req['user'];
    return await this.adService.remove(id, user);
  }

}
