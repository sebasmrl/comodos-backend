import { UpdatePasswordRepeatMethodDto } from './dto/update-password-repeat-method.dto';
import { PaginationDto } from './../common/dto/pagination.dto';
import { Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt'
import { handlerDbError } from 'src/common/helpers';

@Injectable()
export class UserService {

  private readonly logger = new Logger('UsersService');
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>

  ) { }


  async create(createUserDto: CreateUserDto) {
    const encriptedPassword = await bcrypt.hash(createUserDto.password, 10);
    if (!encriptedPassword) throw new InternalServerErrorException('Error al generar encriptado de contraseña');

    const user = this.userRepository.create({ ...createUserDto, password: encriptedPassword });
    if (!user) throw new InternalServerErrorException('Error al intentar crear modelo de usuario');

    try {
      const { password, state, ...newUserData } = await this.userRepository.save(user);
      return newUserData;
    } catch (e) {
      handlerDbError(e, this.logger)
    }
  }


  async findAll(paginationDto: PaginationDto) {
    const { skip = 0, limit = 10, activeRegisters } = paginationDto;

    let condition = (activeRegisters == undefined)
      ? {}
      : { state: activeRegisters }

    const users = await this.userRepository.find({
      //TODO: relations:{profileImage:true},
      where: { ...condition },
      skip: skip,
      take: limit
    });

    const result = users.map(user => {
      const { password, ...data } = user;
      return data;
    })
    //fecha: {   from: LessThan(new Date()),  to: MoreThan(new Date()) }
    return result;
  }


  async findOneById(id: string) {
    const user = await this.userRepository.findOne({ where: { id }, relations: { ads: true } });
    if (!user) throw new NotFoundException(`Usuario con id: ${id} no encontrado`)
    return user;
  }


  async findOneByDni(dni: number) {
    const user = await this.userRepository.findOneBy({ dni });
    if (!user) throw new NotFoundException(`Usuario con dni: ${dni} no encontrado`)
    return user;
  }


  async updateByAdmin(id: string, updateUserDto: UpdateUserDto) {

    const user = await this.findOneById(id);
    const { password } = updateUserDto;

    if (!password) {
      return await this.userRepository.save({ ...user, ...updateUserDto });
    } else {
      const encriptedPassword = await bcrypt.hash(updateUserDto.password, 10)
      const updatedUser = await this.userRepository.save({
        ...user, ...updateUserDto, password: encriptedPassword
      });
      return updatedUser;
    }
  }


  async updateBySelf(user: User, updateUserDto: UpdateUserDto) {
    const { password, ...data } = updateUserDto;    
    try {
       const updatedUser = await this.userRepository.save({ ...user, ...data });
      if (updatedUser) return true;
    } catch (e) {
      return false;
    }
    return false;
  }


  async updatePasswordRepeatMethodBySelf(user: User, updatePasswordRepeatMethodDto: UpdatePasswordRepeatMethodDto) {
    const comparation = await bcrypt.compare(updatePasswordRepeatMethodDto.currentPassword, user.password)
    if (!comparation) throw new UnauthorizedException('Tu contraseña actual no es correcta');

    const encriptedPassword = await bcrypt.hash(updatePasswordRepeatMethodDto.newPassword, 10);
    if (!encriptedPassword) throw new InternalServerErrorException('Error al intentar cambiar la contraseña');
    
    try {
      const userWithPasswordUpdated = await this.userRepository.save({ ...user, password: encriptedPassword });
      if (userWithPasswordUpdated) return true;
    } catch (e) {
      return false;
    }
    return false;
  }


  async updateLastConnection(id: string) {
    const user = await this.findOneById(id);
    try {
      const { lastConnection } = await this.userRepository.save({ ...user, lastConnection: new Date() })
      return lastConnection;
    } catch (e) {
      handlerDbError(e, this.logger);
    }
  }


  async removeByAdmin(id: string) {
    const { affected } = await this.userRepository.update({ id }, { state: false })
    if (affected) return true;
    return false;
  }

  async removeBySelf(user: User) {
    const { affected } = await this.userRepository.update({ id: user.id }, { state: false })
    if (affected) return true;
    return false;
  }



  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email }
    });
    if (!user) throw new NotFoundException(`Usuario con email: ${email} no encontrado`)
    return user;
  }


}
