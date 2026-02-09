import { HealthCheckService, HttpHealthIndicator, MemoryHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';
export declare class HealthService {
    private health;
    private memory;
    private db;
    private http;
    constructor(health: HealthCheckService, memory: MemoryHealthIndicator, db: TypeOrmHealthIndicator, http: HttpHealthIndicator);
    CheckHealth(): Promise<import("@nestjs/terminus").HealthCheckResult>;
}
