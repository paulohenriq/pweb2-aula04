import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Tarefa } from './tarefas/entities/tarefa.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  entities: [Tarefa],
  synchronize: false,
};

const dataSource = new DataSource({
  ...dataSourceOptions,
  migrations: ['src/migrations/*.ts'],
});
export default dataSource;
