import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegistryDto } from './dto/registry.dto';
import { Response } from 'express';

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

  
}
