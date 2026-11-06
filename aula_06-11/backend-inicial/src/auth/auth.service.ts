import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, senha: string) {
    if (await this.usersService.findByEmail(email)) {
      throw new ConflictException('E-mail já cadastrado');
    }
    const hash = await bcrypt.hash(senha, 10); // hash: nunca salve a senha pura
    const user = await this.usersService.create(email, hash);
    return { id: user.id, email: user.email };
  }

  async validarUsuario(email: string, senha: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(senha, user.senha))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return user;
  }

  async login(email: string, senha: string) {
    const user = await this.validarUsuario(email, senha);
    // "sub" (subject) = id do usuário. É o que o servidor lê do token depois.
    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);
    return { token, user: { id: user.id, email: user.email } };
  }
}
