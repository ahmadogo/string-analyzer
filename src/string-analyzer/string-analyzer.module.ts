import { Module } from '@nestjs/common';
import { StringAnalyzerService } from './string-analyzer.service';
import { StringAnalyzerController } from './string-analyzer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyzedString } from './entities/string-analyzer.entity';

@Module({
imports: [
    TypeOrmModule.forFeature([AnalyzedString]),
  ],  controllers: [StringAnalyzerController],
  providers: [StringAnalyzerService],
})
export class StringAnalyzerModule {}
