import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { Payload } from '../interfaces/payload.interface';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(Strategy, 'jwt-access'){

    constructor(
        @Inject()
        private readonly userService:UserService,
        configService:ConfigService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_SECRET'),
            ignoreExpiration:false
        });
    }


    async validate(payload:Payload):Promise<User>{
        const { id } = payload;
        let user:User;
        try{
            user = await this.userService.findOneById(id);
        }catch(e){
            throw new UnauthorizedException('El token no es válido')    
        }
        if(!user.state) throw new UnauthorizedException('El usuario está inactivo, comunicate con el administrador') 
        return user;
    }

}