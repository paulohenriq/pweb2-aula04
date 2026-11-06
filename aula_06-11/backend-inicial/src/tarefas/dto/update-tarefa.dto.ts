import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateTarefaDto } from './create-tarefa.dto';

export class UpdateTarefaDto extends PartialType(CreateTarefaDto) {
  @IsOptional()
  @IsBoolean({ message: 'O campo concluida deve ser verdadeiro ou falso.' })
  concluida?: boolean;
}
