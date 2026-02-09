import { Injectable } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator, MemoryHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Injectable()
export class HealthService{
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private http: HttpHealthIndicator,
  ) {}

  CheckHealth(){
    return this.health.check([
        ()=>  this.db.pingCheck('database', {timeout: 1000}),
        ()=> this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
       // ()=> this.http.pingCheck('http', 'http://localhost:3001/health')      
    ])
  }
}

