import { ConfigService } from '@nestjs/config';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegistryDto } from './dto/registry.dto';

import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        @Inject()
        private readonly userService:UserService,
        private readonly jwtService: JwtService,
        private readonly configService:ConfigService
    ){}


    async login(loginDto:LoginDto){
        const { password, birthdate, gender, nationality, phone, phoneCode, ...data} 
                                    = await this.userService.findOneByEmail(loginDto.email);
        const comparation = await bcrypt.compare(loginDto.password, password)
        if(!comparation) throw new UnauthorizedException('Contraseña incorrecta, acceso denegado')

        const lastConnection = await this.userService.updateLastConnection(data.id);
        data.lastConnection = lastConnection;
        const accessToken = this.jwtService.sign(
            { id:data.id},
            { 
                expiresIn:'16m', 
                secret: this.configService.get('JWT_SECRET')  
            }
        ); //por defecto es 15min
        const refreshToken = this.jwtService.sign(
            { id:data.id }, 
            { 
                expiresIn:'31m', 
                secret: this.configService.get('REFRESH_JWT_SECRET') 
            }
        );

        return {user:{...data}, accessToken, refreshToken};
    }



    async registry(registryDto:RegistryDto){
        return this.userService.create(registryDto);
    }



    async refresh(id:string){
        const accessToken = this.jwtService.sign({ id:id }); //por defecto es 15min
        const refreshToken = this.jwtService.sign(
            { id:id }, 
            {   
                expiresIn:'35m', 
                secret: this.configService.get('REFRESH_JWT_SECRET') 
            }
        );

        return { accessToken, refreshToken}
    }
}
