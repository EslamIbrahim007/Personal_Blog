import { app } from './app';
import { env } from './config/env';
import { AppDataSource } from './database/data-source';

const PORT = env.port || 3000;


async function startServer() {
    await AppDataSource.initialize();
    console.log('Database connected');

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});

