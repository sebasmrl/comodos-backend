import { ConfigService } from '@nestjs/config';
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { PayloadAfterVerify } from '../../interfaces/payload.interface';

@Injectable()
export class RefreshGuard implements CanActivate {

  constructor(
    @Inject()
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) { }


  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(req);
    if (!token) throw new UnauthorizedException("RefreshToken no existe en la peticion");

    try {
      const payload = await this.jwtService.verifyAsync<PayloadAfterVerify>(token, {
        secret: this.configService.get('REFRESH_JWT_SECRET')
      })
      req['user'] = payload
    } catch (e) {
      throw new UnauthorizedException('Token de actualización invalido')
    }

    return true;
  }


  //handler
  private extractTokenFromHeader(req: Request): string | undefined {
    const authorization: string = req.headers["authorization"] ?? '';
    const [type, token] = authorization.split(' ');

    return (type === 'Refresh') ? token : undefined
  }
}
