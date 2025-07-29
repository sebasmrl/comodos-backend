import { UpdatePasswordRepeatMethodDto } from './dto/update-password-repeat-method.dto';
import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseUUIDPipe, ParseIntPipe, Query, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from './entities/user.entity';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';

@Controller('users')
export class UserController {
  constructor(
    @Inject()
    private readonly userService: UserService
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Auth(ValidRoles.USER, ValidRoles.SUPER_ADMIN)
  @Get()
  findAll(@Query() paginationDto:PaginationDto, @Req() req:Request) {
    return this.userService.findAll(paginationDto);
  }

  @Auth(ValidRoles.USER, ValidRoles.SUPER_ADMIN)
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const {password, ...result} = await this.userService.findOneById(id);
    return result;
  }

  @Auth(ValidRoles.USER, ValidRoles.SUPER_ADMIN)
  @Get('/dni/:dni')
  async findOneByDni(@Param('dni', ParseIntPipe) id: number) {
    const {password, ...result} = await this.userService.findOneByDni(id);
    return result;
  }

  @Get('/public-data/:id')
  async findOnePublicData(@Param('id', ParseUUIDPipe) id: string) {
    //TODO:extraer rating
    const { names, lastnames, lastConnection, profileImage, phone, phoneCode,  nationality} = await this.userService.findOneById(id);
    return {id, names, lastnames, lastConnection, profileImage, phone, phoneCode,  nationality};
  }

  @Get('/public-profile/:id')
  async findOnePublicProfile(@Param('id', ParseUUIDPipe) id: string) {
    //TODO:extraer rating
    const { names, lastnames, lastConnection, profileImage, phone, phoneCode,  nationality, ads} = await this.userService.findOneById(id);
    return {id, names, lastnames, lastConnection, profileImage, phone, phoneCode,  nationality, ads};
  }

  @Auth(ValidRoles.SUPER_ADMIN)
  @Patch('admin/:id')
  updateByAdmin(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateByAdmin(id, updateUserDto);
  }

  @Auth(ValidRoles.USER, ValidRoles.SUPER_ADMIN)
  @Patch()
  updateBySelf( @Body() updateUserDto: UpdateUserDto, @Req() req:Request) {
    const user:User = req['user'];
    return this.userService.updateBySelf(user, updateUserDto);
  }

  @Auth(ValidRoles.USER)
  @Patch('password/repeat-method')
  async updatePasswordRepeatMethod(@Body() updatePasswordByRepeatMethodDto:UpdatePasswordRepeatMethodDto, @Req() req:Request){
    const user:User = req['user'];
    return this.userService.updatePasswordRepeatMethodBySelf(user, updatePasswordByRepeatMethodDto);
  }



  @Auth(ValidRoles.SUPER_ADMIN)
  @Delete('admin/:id')
  removeByAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.removeByAdmin(id); 
  }

  @Auth(ValidRoles.SUPER_ADMIN, ValidRoles.USER)
  @Delete()
  removeBySelf(@Req() req:Request) {
    const user:User = req['user'];
    return this.userService.removeBySelf(user); 
  }

  
}
