import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { StringAnalyzerService } from './string-analyzer.service';

@Controller('strings')
export class StringAnalyzerController {
  constructor(private readonly stringService: StringAnalyzerService) {}

  // ✅ POST /strings
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body('value') value: string) {
    const result = await this.stringService.createString(value);
    return {
      id: result.id,
      value: result.value,
      properties: result.properties,
      created_at: result.created_at,
    };
  }

  // ✅ GET /strings/filter-by-natural-language
  @Get('filter-by-natural-language')
  async filterByQuery(@Query('query') query: string) {
    return this.stringService.filterByNaturalLanguage(query);
  }

  // ✅ GET /strings/:value
  @Get(':value')
  async getOne(@Param('value') value: string) {
    const result = await this.stringService.getString(value);
    return {
      id: result.id,
      value: result.value,
      properties: result.properties,
      created_at: result.created_at,
    };
  }

  // ✅ GET /strings
  @Get()
  async getAll(@Query() query: any) {
    return this.stringService.getAllStrings(query);
  }

  // ✅ DELETE /strings/:value
  @Delete(':value')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('value') value: string) {
    const deleted = await this.stringService.deleteString(value);
    return deleted;
  }
}
