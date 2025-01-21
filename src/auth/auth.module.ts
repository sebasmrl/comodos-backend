import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccessJwtStrategy } from './strategies/access-jwt-strategy';
import { RefreshJwtStrategy } from './strategies/refresh-jwt-strategy';

@Module({
  imports:[
    ConfigModule,
    forwardRef(()=>UserModule),
    PassportModule.register({ defaultStrategy:'jwt' }),
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory: async( configService:ConfigService)=> {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {  expiresIn:'15m' }
        }
      }
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    AccessJwtStrategy, 
    RefreshJwtStrategy
  ],
  exports:[ 
    JwtModule, 
    PassportModule, 
    AccessJwtStrategy, 
    RefreshJwtStrategy
  ]
})
export class AuthModule {}
