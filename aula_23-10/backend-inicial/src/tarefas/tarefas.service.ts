import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTarefaDto } from './dto/create-tarefa.dto';
import { UpdateTarefaDto } from './dto/update-tarefa.dto';
import { Tarefa } from './entities/tarefa.entity';

@Injectable()
export class TarefasService {
  constructor(
    @InjectRepository(Tarefa)
    private readonly tarefaRepo: Repository<Tarefa>,
  ) {}

  findAll(): Promise<Tarefa[]> {
    return this.tarefaRepo.find();
  }

  async findOne(id: number): Promise<Tarefa> {
    const tarefa = await this.tarefaRepo.findOneBy({ id });
    if (!tarefa) {
      throw new NotFoundException('Tarefa não encontrada');
    }
    return tarefa;
  }

  create(dto: CreateTarefaDto): Promise<Tarefa> {
    const tarefa = this.tarefaRepo.create(dto);
    return this.tarefaRepo.save(tarefa);
  }

  async update(id: number, dto: UpdateTarefaDto): Promise<Tarefa> {
    const tarefa = await this.findOne(id);
    Object.assign(tarefa, dto);
    return this.tarefaRepo.save(tarefa);
  }

  async remove(id: number): Promise<void> {
    const tarefa = await this.findOne(id);
    await this.tarefaRepo.remove(tarefa);
  }
}
