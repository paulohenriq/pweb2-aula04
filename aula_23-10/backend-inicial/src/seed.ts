import dataSource from './data-source';
import { Tarefa } from './tarefas/entities/tarefa.entity';

// Seeder simples: popula a tabela de tarefas com dados iniciais.
async function seed() {
  await dataSource.initialize();
  const repo = dataSource.getRepository(Tarefa);

  await repo.clear();
  await repo.save([
    { titulo: 'Estudar JWT', descricao: 'Autenticação e segurança de APIs', concluida: false },
    { titulo: 'Preparar a aula de hoje', concluida: true },
  ]);

  console.log('Seed concluído!');
  await dataSource.destroy();
}

seed();
