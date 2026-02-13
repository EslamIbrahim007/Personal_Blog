import { DataSource } from "typeorm";
import { config } from "dotenv";

config();

export default new DataSource({
    type: "postgres",
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [__dirname + "/../**/*.entity{.ts,.js}"],
    migrations: [__dirname + "/migrations/*{.ts,.js}"],
    subscribers: [__dirname + "/subscribers/*{.ts,.js}"],
    migrationsTableName: "migrations",
});