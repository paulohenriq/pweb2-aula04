import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: AuthDto) {
    return this.authService.register(dto.email, dto.senha);
  }

  @Post('login')
  async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const { token, user } = await this.authService.login(dto.email, dto.senha);

    // O token fica em um COOKIE httpOnly definido pelo SERVIDOR:
    res.cookie('access_token', token, {
      httpOnly: true,   // o JS do navegador NÃO lê o cookie (anti-XSS)
      sameSite: 'lax',  // não envia cross-site (ajuda contra CSRF)
      secure: false,    // em produção (HTTPS): true
      maxAge: 24 * 60 * 60 * 1000, // 1 dia
    });
    return { user };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { ok: true };
  }

  // Rota protegida: só responde com um token válido no cookie.
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: Request) {
    // req.user vem do JwtStrategy.validate (lido do token no cookie).
    return req.user;
  }
}
