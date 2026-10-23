import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTarefaDto {
  @IsString({ message: 'O título deve ser um texto.' })
  @IsNotEmpty({ message: 'O título é obrigatório.' })
  @MinLength(3, { message: 'O título deve ter ao menos 3 caracteres.' })
  @MaxLength(100, { message: 'O título deve ter no máximo 100 caracteres.' })
  titulo: string;

  @IsOptional()
  @IsString({ message: 'A descrição deve ser um texto.' })
  @MaxLength(300, { message: 'A descrição deve ter no máximo 300 caracteres.' })
  descricao?: string;
}
