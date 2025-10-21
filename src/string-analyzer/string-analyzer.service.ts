import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { AnalyzedString } from './entities/string-analyzer.entity';

@Injectable()
export class StringAnalyzerService {
  constructor(
    @InjectRepository(AnalyzedString)
    private readonly stringRepo: Repository<AnalyzedString>,
  ) {}

  // Utility function to analyze a string
  analyzeString(value: string) {
    if (typeof value !== 'string') {
      throw new BadRequestException('Value must be a string');
    }

    const trimmedValue = value.trim();
    const length = trimmedValue.length;
    const reversed = trimmedValue.split('').reverse().join('');
    const is_palindrome = trimmedValue.toLowerCase() === reversed.toLowerCase();
    const unique_characters = new Set(trimmedValue).size;
    const word_count = trimmedValue.split(/\s+/).filter(Boolean).length;

    const sha256_hash = crypto
      .createHash('sha256')
      .update(trimmedValue)
      .digest('hex');

    const character_frequency_map: Record<string, number> = {};
    for (const char of trimmedValue) {
      character_frequency_map[char] = (character_frequency_map[char] || 0) + 1;
    }

    return {
      length,
      is_palindrome,
      unique_characters,
      word_count,
      sha256_hash,
      character_frequency_map,
    };
  }

  async createString(value: string) {
    if (!value) throw new BadRequestException('Missing "value" field');

    const analysis = this.analyzeString(value);

    const exists = await this.stringRepo.findOne({
      where: { id: analysis.sha256_hash },
    });
    if (exists) throw new ConflictException('String already exists');

    const record = this.stringRepo.create({
      id: analysis.sha256_hash,
      value,
      properties: analysis,
    });

    await this.stringRepo.save(record);

    return record;
  }

  async filterByNaturalLanguage(query: string) {
    const parsedFilters = this.parseNaturalLanguage(query);

    const all = await this.getAllStrings(parsedFilters);

    // Handle case where no matching records exist
    if (!all.data || all.data.length === 0) {
      return {
        data: [],
        count: 0,
        message: 'No strings match the provided natural language query',
        interpreted_query: {
          original: query,
          parsed_filters: parsedFilters,
        },
      };
    }

    return {
      data: all.data,
      count: all.data.length,
      interpreted_query: {
        original: query,
        parsed_filters: parsedFilters,
      },
    };
  }

  async getString(value: string) {
    const record = await this.stringRepo.findOne({ where: { value } });
    if (!record) {
      throw new NotFoundException('String does not exist in the system');
    }
    return record;
  }

  async getAllStrings(query: any) {
    const {
      is_palindrome,
      min_length,
      max_length,
      word_count,
      contains_character,
    } = query;

    const allRecords = await this.stringRepo.find();

    let filtered = allRecords;

    if (is_palindrome !== undefined) {
      const boolValue = is_palindrome === 'true';
      filtered = filtered.filter(
        (r) => r.properties.is_palindrome === boolValue,
      );
    }

    if (min_length) {
      filtered = filtered.filter(
        (r) => r.properties.length >= parseInt(min_length),
      );
    }

    if (max_length) {
      filtered = filtered.filter(
        (r) => r.properties.length <= parseInt(max_length),
      );
    }

    if (word_count) {
      filtered = filtered.filter(
        (r) => r.properties.word_count === parseInt(word_count),
      );
    }

    if (contains_character) {
      filtered = filtered.filter((r) => r.value.includes(contains_character));
    }

    return {
      data: filtered,
      count: filtered.length,
      filters_applied: {
        is_palindrome,
        min_length,
        max_length,
        word_count,
        contains_character,
      },
    };
  }

  parseNaturalLanguage(query: string) {
    if (!query) {
      throw new BadRequestException('Missing query parameter');
    }

    const normalized = query.toLowerCase().trim();

    const filters: any = {};

    // 1️⃣ Check for palindrome
    if (normalized.includes('palindromic')) {
      filters.is_palindrome = true;
    }

    // 2️⃣ Check for single word
    if (normalized.includes('single word')) {
      filters.word_count = 1;
    }

    // 3️⃣ Check for "longer than X characters"
    const longerMatch = normalized.match(/longer than (\d+) characters/);
    if (longerMatch) {
      filters.min_length = parseInt(longerMatch[1]) + 1;
    }

    // 4️⃣ Check for "containing the letter <x>"
    const containsLetterMatch = normalized.match(
      /containing (?:the letter )?([a-z])/,
    );
    if (containsLetterMatch) {
      filters.contains_character = containsLetterMatch[1];
    }

    // 5️⃣ Handle "first vowel" as 'a'
    if (normalized.includes('first vowel')) {
      filters.contains_character = 'a';
    }

    if (Object.keys(filters).length === 0) {
      throw new UnprocessableEntityException(
        'Unable to parse natural language query',
      );
    }

    return filters;
  }

  async deleteString(value: string) {
    if (!value) {
      throw new BadRequestException('Missing string value to delete');
    }

    const record = await this.stringRepo.findOne({ where: { value } });
    if (!record) {
      throw new NotFoundException('String does not exist in the system');
    }

    // Use delete by id to avoid reloading entity relations etc.
    await this.stringRepo.delete(record.id);

    return { id: record.id, value: record.value };
  }
}
