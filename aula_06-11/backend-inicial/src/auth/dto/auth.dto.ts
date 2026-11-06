import { IsEmail, IsString, MinLength } from 'class-validator';

// Mesmo DTO para registro e login (valida o formulário de credenciais).
export class AuthDto {
  @IsEmail({}, { message: 'E-mail inválido.' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'A senha deve ter ao menos 6 caracteres.' })
  senha: string;
}
