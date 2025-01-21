import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseUUIDPipe, ParseIntPipe, Query, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from './entities/user.entity';

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

  @Auth()
  @Get()
  findAll(@Query() paginationDto:PaginationDto, @Req() req:Request) {
    return this.userService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const {password, ...result} = await this.userService.findOneById(id);
    return result;
  }
  @Get('/dni/:dni')
  async findOneByDni(@Param('dni', ParseIntPipe) id: number) {
    const {password, ...result} = await this.userService.findOneByDni(id);
    return result;
  }

  @Get('/public/:id')
  async findOnePublic(@Param('id', ParseUUIDPipe) id: string) {
    //TODO:extraer foto cuando este la relacion y rating
    const { names, lastnames, lastConnection,   ...rest} = await this.userService.findOneById(id);
    return {names, lastnames, lastConnection};
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }
}
