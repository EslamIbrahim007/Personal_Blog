import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import configuration from './configuration';
// import { EnvValidationSchema } from './env.validation';

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      // validationSchema: EnvValidationSchema, // Uncomment if validation schema is ready
    }),
  ],
})
export class ConfigModule { }
