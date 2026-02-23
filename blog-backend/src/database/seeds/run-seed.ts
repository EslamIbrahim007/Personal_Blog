import { AppDataSource } from '../data-source';
import { seedRbac } from './seed-rbac';

async function run() {
  await AppDataSource.initialize();
  await seedRbac(AppDataSource);
  await AppDataSource.destroy();
}

run();