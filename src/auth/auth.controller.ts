import { Body, Controller, InternalServerErrorException, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegistryDto } from './dto/registry.dto';
import { Response } from 'express';
import { User } from 'src/user/entities/user.entity';
import { Auth } from './decorators/auth.decorator';
import { RefreshAuth } from './decorators/refresh-auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  
  @Post('/login')
  async login(@Body()loginDto: LoginDto, @Res() res:Response){
    return res.status(200)
              .json( await this.authService.login(loginDto) );
  }

  @Post('/registry')
  async registry(@Body() registryDto:RegistryDto){
    return await this.authService.registry(registryDto); 
  }


  @RefreshAuth('jwt-refresh')
  @Post('/refresh')
  async refresh(@Req() req:Request){

    const user:User = req['user'];
    if(!user) throw new InternalServerErrorException('Ruta debe ser privada, necesita mantenimiento') 

    const  { accessToken, refreshToken} = await this.authService.refresh(user.id); 
    const { password, dni, birthdate, gender, nationality, phone, phoneCode, ...data} = user;     

    return {
      user:{...data},
      accessToken,
      refreshToken
    }
  }



  
}
