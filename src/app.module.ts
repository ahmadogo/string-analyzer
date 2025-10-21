import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { StringAnalyzerModule } from './string-analyzer/string-analyzer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes .env variables available everywhere
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        url: process.env.DATABASE_URL, // automatically uses Railway’s variable
        ssl:
          process.env.NODE_ENV === 'production'
            ? { rejectUnauthorized: false }
            : false,
        autoLoadEntities: true,
        synchronize: true, // OK for dev, turn off for prod migrations
      }),
    }),
    StringAnalyzerModule,
  ],
})
export class AppModule {}
