import 'reflect-metadata';
import { DataSource } from "typeorm"

import { env } from "../config/env";


export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.db.host,
  port: Number(env.db.port),
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  synchronize: false,
  logging: false,
  entities: ['src/database/entities/**/*.ts'],
  migrations: ['src/database/migrations/**/*.ts'],
});