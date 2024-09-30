import { PaginationDto } from './../common/dto/pagination.dto';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { handleDbErrors } from 'src/common/helpers/db-error.handler';
import { UpdateUserCompleteDto } from './dto/update-user-complete.dto';

@Injectable()
export class UsersService {

  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly datasource: DataSource,
  ) { }


  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...data } = createUserDto;
      const encriptedPass = bcrypt.hashSync(password, 10);

      const user = this.userRepository.create({
        password: encriptedPass, ...data
      });

      await this.userRepository.save(user);
      delete user.password;

      //TODO: Generar JWT

      return user;
    } catch (e) {
      handleDbErrors(this.logger, e);
    }

  }


  async findOne(uuid: string) {
    try {
      const { password,id, ...data} =  await this.userRepository.findOneBy({id:uuid})
      return data;
    } catch (error) {
      handleDbErrors(this.logger, error)
    }
  }

  async update(uuid: string, updateUserDto: UpdateUserDto) {

    await this.findOne(uuid); //lanza excepcionn en caso de que no encuentre
    try {

      if(updateUserDto.password) 
        updateUserDto.password = bcrypt.hashSync(updateUserDto?.password, 10);

      const userBase =  await this.userRepository.preload({id:uuid, ...updateUserDto});
      await this.userRepository.update({ id:uuid}, userBase);

      const {id, password, ...data} = userBase;
      return {
        entryValues: updateUserDto,
        updatedUser:data,
      };
    } catch (error) {
      console.log(error)
      handleDbErrors(this.logger, error)
    }
  }

  
  async updateComplete(uuid: string, updateUserDto: UpdateUserCompleteDto) {

    await this.findOne(uuid); //lanza excepcionn en caso de que no encuentre
    try {
      const userBase =  await this.userRepository.preload({id:uuid, ...updateUserDto});
      await this.userRepository.update({ id:uuid}, userBase);

      const {id, password, ...data} = userBase;
      return {
        entryValues: updateUserDto,
        updatedUser:data,
      };
    } catch (error) {
      console.log(error)
      handleDbErrors(this.logger, error)
    }
  }


  async remove(id: string) {
    const user = await this.findOne(id);
    if(!user.isActive) throw new BadRequestException(`Usuario con id:${id} no registra`)
    try {
      const userBase =  await this.userRepository.preload({id, isActive:false});
      await this.userRepository.update({ id}, userBase);
      return {
        message:'Usuario eliminado con éxito'
      }
    } catch (error) {
      handleDbErrors(this.logger, error)
    }
  }


  async findAll(paginationDto: PaginationDto) {
    const { offset = 0, limit = 10, activeEntries } = paginationDto;

    let condition = (activeEntries == undefined)  ? {}  : { isActive: activeEntries}

    try {
      const users = await this.userRepository.find({
        skip: offset,
        take: limit,
        select: {
          dni: true,
          names: true,
          lastNames: true,
          email: true,
          createdAt: true,
          confirmedEmail: true,
          tickets: true,
          id: true,
          isActive: true,
        },
        where: {...condition},
        loadRelationIds: true
      })
      return users;
    } catch (error) {
      handleDbErrors(this.logger, error);
    }
  }


}
