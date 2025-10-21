import { PartialType } from '@nestjs/mapped-types';
import { CreateStringAnalyzerDto } from './create-string-analyzer.dto';

export class UpdateStringAnalyzerDto extends PartialType(CreateStringAnalyzerDto) {}
