import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { Payload } from '../interfaces/payload.interface';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh' ){
    
        constructor(
            @Inject()
            private readonly userService:UserService,
            configService:ConfigService
        ){
            super({
                jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Refresh'),
                secretOrKey: configService.get('REFRESH_JWT_SECRET'),
                ignoreExpiration:false
            });
        }
        
    
        async validate(payload:Payload){
            const { id } = payload;
            let user:User;
            try{
                user = await this.userService.findOneById(id);
            }catch(e){
                throw new UnauthorizedException('El token no es válido')    
            }
            if(!    user.state) throw new UnauthorizedException('El usuario está inactivo, comunicate con el administrador') 
            return user;
        }

}