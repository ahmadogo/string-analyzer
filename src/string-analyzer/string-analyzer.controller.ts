import { Body, Controller, Get, Param, Post, Query, Delete } from '@nestjs/common';
import { StringAnalyzerService } from './string-analyzer.service';

@Controller('strings')
export class StringAnalyzerController {
  constructor(private readonly stringService: StringAnalyzerService) {}

  @Post()
  async analyze(@Body('value') value: string) {
    const result = await this.stringService.createString(value);
    return {
      id: result.id,
      value: result.value,
      properties: result.properties,
      created_at: result.created_at,
    };
  }

  @Get('filter-by-natural-language')
  async filterByQuery(@Query('query') query: string) {
    return this.stringService.filterByNaturalLanguage(query);
  }
  
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

  @Get()
  async getAll(@Query() query: any) {
    return this.stringService.getAllStrings(query);
  }

  // New: DELETE a stored string by its value
  @Delete(':value')
  async remove(@Param('value') value: string) {
    const deleted = await this.stringService.deleteString(value);
    return {
      message: 'String deleted',
      id: deleted.id,
      value: deleted.value,
    };
  }
}