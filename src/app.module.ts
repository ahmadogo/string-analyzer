import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StringAnalyzerModule } from './string-analyzer/string-analyzer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        // Prefer using DATABASE_URL if present, otherwise build from separate vars
        const databaseUrl = config.get<string>('DATABASE_URL');
        if (databaseUrl) {
          return {
            type: 'postgres' as const,
            url: databaseUrl,
            autoLoadEntities: true,
            synchronize: true,
            // If you need SSL in production, set NODE_ENV=production and configure below:
            // ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
          };
        }

        return {
          type: 'postgres' as const,
          host: config.get<string>('DATABASE_HOST') ?? 'localhost',
          port: Number(config.get<number>('DATABASE_PORT') ?? 5432),
          username: config.get<string>('DATABASE_USER'),
          password: config.get<string>('DATABASE_PASSWORD'),
          database: config.get<string>('DATABASE_NAME'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),

    StringAnalyzerModule,
  ],
})
export class AppModule {}
